import { AtpAgent } from "@atproto/api"

export interface PublicationRecord {
  url: string
  name: string
  description: string
}

export interface DocumentRecord {
  title: string
  site: string
  path: string
  content: string
  textContent: string
  publishedAt: string
  description: string
  tags?: string[]
}

export interface AtprotoClient {
  did: string
  ensurePublication(pub: PublicationRecord): Promise<string>
  putDocument(rkey: string, doc: DocumentRecord): Promise<string>
}

export async function createClient(
  service: string,
  identifier: string,
  password: string,
): Promise<AtprotoClient> {
  const agent = new AtpAgent({ service })
  await agent.login({ identifier, password })
  const did = agent.session!.did

  return {
    did,

    async ensurePublication(pub: PublicationRecord): Promise<string> {
      await agent.com.atproto.repo.putRecord({
        repo: did,
        collection: "site.standard.publication",
        rkey: "self",
        record: {
          $type: "site.standard.publication",
          url: pub.url,
          name: pub.name,
          description: pub.description,
          createdAt: new Date().toISOString(),
        },
      })
      return `at://${did}/site.standard.publication/self`
    },

    async putDocument(rkey: string, doc: DocumentRecord): Promise<string> {
      const record: Record<string, unknown> = {
        $type: "site.standard.document",
        title: doc.title,
        site: doc.site,
        path: doc.path,
        content: doc.content,
        textContent: doc.textContent,
        publishedAt: doc.publishedAt,
        description: doc.description,
        createdAt: new Date().toISOString(),
      }
      if (doc.tags?.length) {
        record.tags = doc.tags
      }

      await agent.com.atproto.repo.putRecord({
        repo: did,
        collection: "site.standard.document",
        rkey,
        record,
      })
      return `at://${did}/site.standard.document/${rkey}`
    },
  }
}
