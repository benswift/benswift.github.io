import path from "path"
import fs from "fs"
import { discoverPosts, pathToRkey } from "./lib/posts"
import { readState, writeState, type AtprotoState } from "./lib/state"
import { createClient, type AtprotoClient } from "./lib/atproto"

export interface PublishConfig {
  blogDir: string
  statePath: string
  wellKnownDir: string
  siteUrl: string
  siteName: string
  siteDescription: string
}

const defaultConfig: PublishConfig = {
  blogDir: path.resolve(import.meta.dirname, "..", "blog"),
  statePath: path.resolve(import.meta.dirname, "..", "atproto-state.json"),
  wellKnownDir: path.resolve(import.meta.dirname, "..", "public", ".well-known"),
  siteUrl: "https://benswift.me",
  siteName: "benswift.me",
  siteDescription: "Ben Swift — researcher, educator, artist, developer",
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function publish(
  client: AtprotoClient,
  config: PublishConfig = defaultConfig,
) {
  const state = readState(config.statePath)
  const oldHashes = state?.contentHashes ?? {}

  const pubAtUri = await client.ensurePublication({
    url: config.siteUrl,
    name: config.siteName,
    description: config.siteDescription,
  })

  fs.mkdirSync(config.wellKnownDir, { recursive: true })
  fs.writeFileSync(
    path.join(config.wellKnownDir, "site.standard.publication"),
    pubAtUri + "\n",
  )

  const posts = discoverPosts(config.blogDir)
  let created = 0
  let updated = 0
  let unchanged = 0

  for (const post of posts) {
    const rkey = pathToRkey(post.path)

    if (oldHashes[post.path] === post.contentHash) {
      unchanged++
      continue
    }

    const isNew = !(post.path in oldHashes)

    await client.putDocument(rkey, {
      title: post.title,
      site: pubAtUri,
      path: post.path,
      content: post.content,
      textContent: post.textContent,
      publishedAt: `${post.date}T00:00:00.000Z`,
      description: post.description,
      tags: post.tags.length ? post.tags : undefined,
    })

    if (isNew) created++
    else updated++

    await sleep(100)
  }

  const newState: AtprotoState = {
    did: client.did,
    publicationAtUri: pubAtUri,
    contentHashes: Object.fromEntries(posts.map((p) => [p.path, p.contentHash])),
  }
  writeState(config.statePath, newState)

  console.log(
    `atproto publish: ${created} new, ${updated} updated, ${unchanged} unchanged`,
  )
}

async function main() {
  const identifier = process.env.ATP_IDENTIFIER
  const password = process.env.ATP_APP_PASSWORD
  if (!identifier || !password) {
    throw new Error("ATP_IDENTIFIER and ATP_APP_PASSWORD env vars required")
  }

  const client = await createClient("https://bsky.social", identifier, password)
  await publish(client)
}

if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
