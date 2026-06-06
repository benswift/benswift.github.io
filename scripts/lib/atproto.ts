import fs from "node:fs";
import { AtpAgent, RichText } from "@atproto/api";
import sharp from "sharp";

export interface PublicationRecord {
  url: string;
  name: string;
  description: string;
}

export interface DocumentRecord {
  title: string;
  site: string;
  path: string;
  textContent: string;
  publishedAt: string;
  description: string;
  tags?: string[];
  /** Strong reference to the Bluesky post that announces this document. */
  bskyPostRef?: { uri: string; cid: string };
}

export interface SkeetInput {
  /** Post text, kept within Bluesky's 300-grapheme limit by the caller. */
  text: string;
  /** Canonical URL for the link-card embed. */
  url: string;
  /** Link-card title. */
  title: string;
  /** Source image (AVIF/PNG/JPEG) for the card thumbnail; converted to JPEG. */
  thumbPath?: string;
}

export interface SkeetResult {
  uri: string;
  cid: string;
}

export interface AtprotoClient {
  did: string;
  ensurePublication(pub: PublicationRecord): Promise<string>;
  putDocument(rkey: string, doc: DocumentRecord): Promise<string>;
  createSkeet(input: SkeetInput): Promise<SkeetResult>;
}

export async function createClient(
  service: string,
  identifier: string,
  password: string,
): Promise<AtprotoClient> {
  const agent = new AtpAgent({ service });
  await agent.login({ identifier, password });
  const did = agent.session!.did;

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
        },
      });
      return `at://${did}/site.standard.publication/self`;
    },

    async putDocument(rkey: string, doc: DocumentRecord): Promise<string> {
      const record: Record<string, unknown> = {
        $type: "site.standard.document",
        title: doc.title,
        site: doc.site,
        path: doc.path,
        textContent: doc.textContent,
        publishedAt: doc.publishedAt,
        description: doc.description,
      };
      if (doc.tags?.length) {
        record.tags = doc.tags;
      }
      if (doc.bskyPostRef) {
        record.bskyPostRef = { uri: doc.bskyPostRef.uri, cid: doc.bskyPostRef.cid };
      }

      await agent.com.atproto.repo.putRecord({
        repo: did,
        collection: "site.standard.document",
        rkey,
        record,
      });
      return `at://${did}/site.standard.document/${rkey}`;
    },

    async createSkeet(input: SkeetInput): Promise<SkeetResult> {
      const external: Record<string, unknown> = {
        uri: input.url,
        title: input.title,
      };

      if (input.thumbPath && fs.existsSync(input.thumbPath)) {
        const jpeg = await sharp(input.thumbPath)
          .resize(1200, 630, { fit: "cover" })
          .jpeg({ quality: 80 })
          .toBuffer();
        const uploaded = await agent.uploadBlob(jpeg, { encoding: "image/jpeg" });
        external.thumb = uploaded.data.blob;
      }

      const rt = new RichText({ text: input.text });
      await rt.detectFacets(agent);

      const res = await agent.com.atproto.repo.createRecord({
        repo: did,
        collection: "app.bsky.feed.post",
        record: {
          $type: "app.bsky.feed.post",
          text: rt.text,
          facets: rt.facets,
          langs: ["en"],
          embed: { $type: "app.bsky.embed.external", external },
          createdAt: new Date().toISOString(),
        },
      });
      return { uri: res.data.uri, cid: res.data.cid };
    },
  };
}
