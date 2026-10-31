import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import matter from "gray-matter";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import type { BlogCta } from "@/data/site-config";

export type BlogPost = {
  slug: string;
  date: string;
  updated?: string;
  title: string;
  description: string;
  content: unknown;
  tags: string[];
  image?: { src: string; alt: string; width?: number; height?: number };
  canonicalUrl?: string;
  cta?: BlogCta;
};

type Frontmatter = {
  title?: unknown;
  slug?: unknown;
  date?: unknown;
  updated?: unknown;
  description?: unknown;
  tags?: unknown;
  image?: unknown;
  imageAlt?: unknown;
  imageWidth?: unknown;
  imageHeight?: unknown;
  draft?: unknown;
  canonicalUrl?: unknown;
  cta?: unknown;
};

type MarkdownNode = {
  type?: unknown;
  tagName?: unknown;
  value?: unknown;
  properties?: Record<string, unknown>;
  children?: MarkdownNode[];
};

const postsDirectory = resolve(process.cwd(), "content", "blog");
const publicDirectory = resolve(process.cwd(), "public");
let publishedPostsPromise: Promise<BlogPost[]> | undefined;
const EXPECT_POSTS = process.env.EXPECT_BLOG_POSTS !== "false";

function readString(value: unknown, field: string, fileName: string, optional = false): string | undefined {
  if (optional && value === undefined) return undefined;
  if (typeof value !== "string" || (!optional && !value.trim())) {
    throw new Error(`${fileName}: frontmatter field "${field}" must be a non-empty string.`);
  }
  return value;
}

function readIsoDate(value: unknown, field: string, fileName: string, optional = false): string | undefined {
  const date = readString(value, field, fileName, optional);
  if (!date) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(date) || Number.isNaN(Date.parse(date))) {
    throw new Error(`${fileName}: frontmatter field "${field}" must be an ISO date or datetime.`);
  }
  return date;
}

function assertUrl(value: string, field: string, fileName: string, allowRelative = false) {
  try {
    const url = new URL(value, "https://vijayebhava.com");
    if (!allowRelative && !/^https?:$/.test(url.protocol)) throw new Error();
    if (allowRelative && !/^(https?:|mailto:)$/.test(url.protocol)) throw new Error();
    if (allowRelative && value.startsWith("//")) throw new Error();
  } catch {
    throw new Error(`${fileName}: frontmatter field "${field}" must be an HTTP(S) URL${allowRelative ? " or site-relative path" : ""}.`);
  }
}

function validateMarkdownImages(node: MarkdownNode, fileName: string) {
  if (node.type === "element" && node.tagName === "img") {
    const src = node.properties?.src;
    if (typeof src !== "string" || !src.startsWith("/blog/") || src.split("/").includes("..")) {
      throw new Error(`${fileName}: Markdown images must use a local /blog/ path.`);
    }
    if (!existsSync(resolve(publicDirectory, `.${src}`))) {
      throw new Error(`${fileName}: Markdown image path "${src}" does not exist under public/.`);
    }
  }
  node.children?.forEach((child) => validateMarkdownImages(child, fileName));
}

async function parsePost(fileName: string): Promise<{ post?: BlogPost; publishCandidate: boolean }> {
  const fullPath = join(postsDirectory, fileName);
  const { data, content } = matter(readFileSync(fullPath, "utf8"));
  const frontmatter = data as Frontmatter;
  const title = readString(frontmatter.title, "title", fileName)!;
  const slug = readString(frontmatter.slug, "slug", fileName)!;
  const date = readIsoDate(frontmatter.date, "date", fileName)!;
  const updated = readIsoDate(frontmatter.updated, "updated", fileName, true);
  const description = readString(frontmatter.description, "description", fileName)!;
  const imageAlt = readString(frontmatter.imageAlt, "imageAlt", fileName, true);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${fileName}: slug must use lowercase letters, numbers, and hyphens.`);
  if (fileName.slice(0, -3) !== slug) throw new Error(`${fileName}: filename must match the frontmatter slug.`);
  if (typeof frontmatter.draft !== "boolean") throw new Error(`${fileName}: frontmatter field "draft" must be a boolean.`);
  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
    throw new Error(`${fileName}: frontmatter field "tags" must be an array of non-empty strings.`);
  }
  if ((frontmatter.tags as string[]).some((tag) => !tagSlug(tag))) {
    throw new Error(`${fileName}: every tag must contain at least one letter or number.`);
  }

  const canonicalUrl = readString(frontmatter.canonicalUrl, "canonicalUrl", fileName, true);
  if (canonicalUrl) assertUrl(canonicalUrl, "canonicalUrl", fileName);

  let image: BlogPost["image"];
  const imagePath = readString(frontmatter.image, "image", fileName, true);
  const imageWidth = frontmatter.imageWidth;
  const imageHeight = frontmatter.imageHeight;
  if ((imageWidth === undefined) !== (imageHeight === undefined)) {
    throw new Error(`${fileName}: imageWidth and imageHeight must be supplied together.`);
  }
  if (imageWidth !== undefined && (!Number.isInteger(imageWidth) || (imageWidth as number) <= 0)) {
    throw new Error(`${fileName}: imageWidth must be a positive integer.`);
  }
  if (imageHeight !== undefined && (!Number.isInteger(imageHeight) || (imageHeight as number) <= 0)) {
    throw new Error(`${fileName}: imageHeight must be a positive integer.`);
  }
  if (!imagePath && (imageWidth !== undefined || imageHeight !== undefined)) {
    throw new Error(`${fileName}: image dimensions require an image field.`);
  }
  if (imagePath) {
    if (!imagePath.startsWith("/blog/") || imagePath.split("/").includes("..")) {
      throw new Error(`${fileName}: image must be a path under public/blog/ (for example, /blog/example.jpg).`);
    }
    if (!imageAlt?.trim()) throw new Error(`${fileName}: imageAlt is required when an image is set; decorative posts must omit image.`);
    if (!existsSync(resolve(publicDirectory, `.${imagePath}`))) {
      throw new Error(`${fileName}: image path "${imagePath}" does not exist under public/.`);
    }
    image = {
      src: imagePath,
      alt: imageAlt,
      ...(imageWidth !== undefined ? { width: imageWidth as number, height: imageHeight as number } : {}),
    };
  }

  let cta: BlogCta | undefined;
  if (frontmatter.cta !== undefined) {
    if (!frontmatter.cta || typeof frontmatter.cta !== "object") throw new Error(`${fileName}: cta must contain a label and url.`);
    const rawCta = frontmatter.cta as { label?: unknown; url?: unknown };
    const label = readString(rawCta.label, "cta.label", fileName)!;
    const url = readString(rawCta.url, "cta.url", fileName)!;
    assertUrl(url, "cta.url", fileName, true);
    cta = { label, url };
  }

  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSanitize);
  const parsed = processor.parse(content);
  const tree = await processor.run(parsed);
  validateMarkdownImages(tree as MarkdownNode, fileName);
  await unified().use(rehypeStringify).stringify(tree);

  const publishCandidate = !frontmatter.draft && Date.parse(date) <= Date.now();
  return {
    publishCandidate,
    post: frontmatter.draft ? undefined : {
      slug,
      date,
      updated,
      title,
      description,
      content: tree,
      tags: frontmatter.tags as string[],
      image,
      canonicalUrl,
      cta,
    },
  };
}

async function loadPublishedPosts(): Promise<BlogPost[]> {
  if (!existsSync(postsDirectory)) {
    if (EXPECT_POSTS) throw new Error("No content/blog directory exists, but blog posts are expected.");
    return [];
  }
  const files = readdirSync(postsDirectory).filter((name) => name.endsWith(".md") && !name.startsWith("_"));
  const parsed = await Promise.all(files.map((fileName) => parsePost(fileName)));
  const slugs = new Set<string>();
  for (const { post } of parsed) {
    if (!post) continue;
    if (slugs.has(post.slug)) throw new Error(`Duplicate blog slug "${post.slug}".`);
    slugs.add(post.slug);
  }

  const now = Date.now();
  const posts = parsed
    .map(({ post }) => post)
    .filter((post): post is BlogPost => Boolean(post) && Date.parse(post!.date) <= now)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  if (parsed.some((item) => item.publishCandidate) && posts.length === 0) {
    throw new Error("Blog posts were expected, but no valid published Markdown posts were found.");
  }
  if (EXPECT_POSTS && posts.length === 0) {
    throw new Error("No published Markdown posts were found. Add a post or set EXPECT_BLOG_POSTS=false for a deliberately empty blog.");
  }
  return posts;
}

export function getPublishedPosts(): Promise<BlogPost[]> {
  publishedPostsPromise ??= loadPublishedPosts();
  return publishedPostsPromise;
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(date));
}

export function tagSlug(tag: string) {
  return tag.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function absoluteBlogPath(path: string) {
  const normalized = resolve(publicDirectory, `.${path}`);
  if (!normalized.startsWith(`${resolve(publicDirectory, "blog")}${sep}`)) throw new Error(`Invalid public blog path: ${path}`);
  return normalized;
}
