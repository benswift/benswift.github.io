import fs from "node:fs";
import { AtpAgent, RichText } from "@atproto/api";
import sharp from "sharp";

/** A record's AT-URI paired with the CID of its exact contents. */
export interface StrongRef {
  uri: string;
  cid: string;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/** Simplified theme readers use to render the publication (site.standard.theme.basic). */
export interface BasicTheme {
  background: RgbColor;
  foreground: RgbColor;
  accent: RgbColor;
  accentForeground: RgbColor;
}

export interface PublicationRecord {
  url: string;
  name: string;
  description: string;
  /** Square source image (at least 256x256) uploaded as the publication icon blob. */
  iconPath?: string;
  basicTheme?: BasicTheme;
  /** Opt in to reader discovery surfaces (Leaflet discover, trending feeds, etc.). */
  showInDiscover?: boolean;
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
  bskyPostRef?: StrongRef;
  /** Uploaded image blob used by readers as the document thumbnail/cover. */
  coverImage?: unknown;
  /** Timestamp of the most recent edit; only set once a published post changes. */
  updatedAt?: string;
}

export interface SkeetInput {
  /** Post text, kept within Bluesky's 300-grapheme limit by the caller. */
  text: string;
  /** Canonical URL for the link-card embed. */
  url: string;
  /** Link-card title. */
  title: string;
  /** Link-card description (required by app.bsky.embed.external). */
  description: string;
  /** Uploaded image blob for the card thumbnail. */
  thumb?: unknown;
  /**
   * StrongRefs to the site.standard records backing this link, so Bluesky can
   * hydrate an enhanced card from them instead of recrawling the page.
   */
  associatedRefs?: StrongRef[];
}

export interface SkeetResult {
  uri: string;
  cid: string;
}

export interface RecommendEntry {
  rkey: string;
  /** AT-URI of the recommended site.standard.document. */
  document: string;
}

export interface AtprotoClient {
  did: string;
  /**
   * Convert a local image (AVIF/PNG/JPEG) to a 1200x630 JPEG and upload it,
   * returning the blob ref, or undefined when the source file is missing.
   */
  uploadImage(sourcePath: string): Promise<unknown | undefined>;
  ensurePublication(pub: PublicationRecord): Promise<StrongRef>;
  putDocument(rkey: string, doc: DocumentRecord): Promise<StrongRef>;
  createSkeet(input: SkeetInput): Promise<SkeetResult>;
  listRecommends(): Promise<RecommendEntry[]>;
  createRecommend(documentUri: string): Promise<void>;
  deleteRecommend(rkey: string): Promise<void>;
}

/** Tag each colour with the lexicon type readers expect (matches records in the wild). */
function themeColor(c: RgbColor) {
  return { $type: "site.standard.theme.color#rgb", r: c.r, g: c.g, b: c.b };
}

export function buildPublicationRecord(
  pub: PublicationRecord,
  iconBlob?: unknown,
): Record<string, unknown> {
  const record: Record<string, unknown> = {
    $type: "site.standard.publication",
    url: pub.url,
    name: pub.name,
    description: pub.description,
  };
  if (iconBlob) {
    record.icon = iconBlob;
  }
  if (pub.basicTheme) {
    record.basicTheme = {
      background: themeColor(pub.basicTheme.background),
      foreground: themeColor(pub.basicTheme.foreground),
      accent: themeColor(pub.basicTheme.accent),
      accentForeground: themeColor(pub.basicTheme.accentForeground),
    };
  }
  if (pub.showInDiscover !== undefined) {
    record.preferences = { showInDiscover: pub.showInDiscover };
  }
  return record;
}

export function buildDocumentRecord(doc: DocumentRecord): Record<string, unknown> {
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
  if (doc.coverImage) {
    record.coverImage = doc.coverImage;
  }
  if (doc.updatedAt) {
    record.updatedAt = doc.updatedAt;
  }
  if (doc.bskyPostRef) {
    record.bskyPostRef = { uri: doc.bskyPostRef.uri, cid: doc.bskyPostRef.cid };
  }
  return record;
}

const RECOMMEND_COLLECTION = "site.standard.graph.recommend";

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

    async uploadImage(sourcePath: string): Promise<unknown | undefined> {
      if (!fs.existsSync(sourcePath)) return undefined;
      const jpeg = await sharp(sourcePath)
        .resize(1200, 630, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();
      const uploaded = await agent.uploadBlob(jpeg, { encoding: "image/jpeg" });
      return uploaded.data.blob;
    },

    async ensurePublication(pub: PublicationRecord): Promise<StrongRef> {
      let iconBlob: unknown;
      if (pub.iconPath && fs.existsSync(pub.iconPath)) {
        const png = await sharp(pub.iconPath).resize(512, 512, { fit: "cover" }).png().toBuffer();
        const uploaded = await agent.uploadBlob(png, { encoding: "image/png" });
        iconBlob = uploaded.data.blob;
      }

      const res = await agent.com.atproto.repo.putRecord({
        repo: did,
        collection: "site.standard.publication",
        rkey: "self",
        record: buildPublicationRecord(pub, iconBlob),
      });
      return { uri: res.data.uri, cid: res.data.cid };
    },

    async putDocument(rkey: string, doc: DocumentRecord): Promise<StrongRef> {
      const res = await agent.com.atproto.repo.putRecord({
        repo: did,
        collection: "site.standard.document",
        rkey,
        record: buildDocumentRecord(doc),
      });
      return { uri: res.data.uri, cid: res.data.cid };
    },

    async createSkeet(input: SkeetInput): Promise<SkeetResult> {
      const external: Record<string, unknown> = {
        uri: input.url,
        title: input.title,
        description: input.description,
      };
      if (input.thumb) {
        external.thumb = input.thumb;
      }
      if (input.associatedRefs?.length) {
        external.associatedRefs = input.associatedRefs.map((r) => ({ uri: r.uri, cid: r.cid }));
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

    async listRecommends(): Promise<RecommendEntry[]> {
      const entries: RecommendEntry[] = [];
      let cursor: string | undefined;
      do {
        const res = await agent.com.atproto.repo.listRecords({
          repo: did,
          collection: RECOMMEND_COLLECTION,
          limit: 100,
          cursor,
        });
        for (const record of res.data.records) {
          const rkey = record.uri.split("/").at(-1)!;
          const document = (record.value as { document?: string }).document;
          if (document) entries.push({ rkey, document });
        }
        cursor = res.data.cursor;
      } while (cursor);
      return entries;
    },

    async createRecommend(documentUri: string): Promise<void> {
      await agent.com.atproto.repo.createRecord({
        repo: did,
        collection: RECOMMEND_COLLECTION,
        record: {
          $type: RECOMMEND_COLLECTION,
          document: documentUri,
          createdAt: new Date().toISOString(),
        },
      });
    },

    async deleteRecommend(rkey: string): Promise<void> {
      await agent.com.atproto.repo.deleteRecord({
        repo: did,
        collection: RECOMMEND_COLLECTION,
        rkey,
      });
    },
  };
}
