import type { Chapter } from "@/data/chapters";

type WordPressPage = {
  slug: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
};

export type PortfolioCopy = {
  home?: { title: string; excerpt: string };
  chapters: Record<string, { title: string; excerpt: string }>;
};

function plainText(markup = "") {
  return markup
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function readPage(baseUrl: string, slug: string) {
  try {
    const url = new URL(`/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=slug,title,excerpt`, baseUrl);
    const response = await fetch(url, { signal: AbortSignal.timeout(2500), cache: "force-cache" });
    if (!response.ok) return null;
    const pages = (await response.json()) as WordPressPage[];
    const page = pages[0];
    if (!page) return null;
    return { title: plainText(page.title?.rendered), excerpt: plainText(page.excerpt?.rendered) };
  } catch {
    // WordPress is optional during early development; use the reviewed local copy.
    return null;
  }
}

export async function getPortfolioCopy(chapters: Chapter[]): Promise<PortfolioCopy> {
  const url = process.env.WORDPRESS_URL;
  if (!url) return { chapters: {} };
  const [home, ...chapterPages] = await Promise.all([
    readPage(url, "portfolio-intro"),
    ...chapters.map((chapter) => readPage(url, `chapter-${chapter.id}`)),
  ]);
  const overrides: PortfolioCopy["chapters"] = {};
  chapters.forEach((chapter, index) => {
    const page = chapterPages[index];
    if (page && (page.title || page.excerpt)) overrides[chapter.id] = page;
  });
  return {
    home: home && (home.title || home.excerpt) ? home : undefined,
    chapters: overrides,
  };
}

