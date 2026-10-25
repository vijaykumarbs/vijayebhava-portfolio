export type WordPressPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string }>;
  };
};

export type BlogPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: string;
  excerpt: string;
  content: string;
  image?: { src: string; alt: string };
};

export type BlogFeed = { posts: BlogPost[]; cmsAvailable: boolean };

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&colon;/gi, ":")
    .replace(/&tab;/gi, "\t")
    .replace(/&newline;/gi, "\n")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);?/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);?/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
}

function plainText(markup: string) {
  return decodeEntities(markup.replace(/<br\s*\/?\s*>/gi, " ").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function safeContent(markup: string) {
  return markup
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|template|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|template|svg|math)\b[^>]*\/?\s*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(?:srcdoc|style)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src|xlink:href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi, (attribute, doubleQuoted, singleQuoted, unquoted) => {
      const value = doubleQuoted ?? singleQuoted ?? unquoted ?? "";
      const normalized = decodeEntities(value).replace(/[\u0000-\u0020]+/g, "").toLowerCase();
      return /^(javascript|vbscript|data):/.test(normalized) ? "" : attribute;
    });
}

function toBlogPost(post: WordPressPost): BlogPost {
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    title: plainText(post.title.rendered),
    excerpt: plainText(post.excerpt.rendered),
    content: safeContent(post.content.rendered),
    image: featuredMedia?.source_url
      ? { src: featuredMedia.source_url, alt: featuredMedia.alt_text || plainText(post.title.rendered) }
      : undefined,
  };
}

export async function getPublishedPosts(): Promise<BlogFeed> {
  const baseUrl = process.env.WORDPRESS_URL;
  if (!baseUrl) return { posts: [], cmsAvailable: false };

  try {
    const endpoint = new URL("/wp-json/wp/v2/posts", baseUrl);
    endpoint.searchParams.set("status", "publish");
    endpoint.searchParams.set("per_page", "100");
    endpoint.searchParams.set("orderby", "date");
    endpoint.searchParams.set("order", "desc");
    endpoint.searchParams.set("_embed", "1");
    endpoint.searchParams.set("_fields", "id,slug,date,modified,link,title,excerpt,content,_embedded");

    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(3000),
      cache: "force-cache",
    });
    if (!response.ok) return { posts: [], cmsAvailable: false };
    const posts = (await response.json()) as WordPressPost[];
    return { posts: posts.map(toBlogPost), cmsAvailable: true };
  } catch {
    return { posts: [], cmsAvailable: false };
  }
}

export function getWordPressAdminUrl() {
  const baseUrl = process.env.WORDPRESS_URL;
  return baseUrl ? new URL("/wp-admin/", baseUrl).toString() : undefined;
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(date));
}
