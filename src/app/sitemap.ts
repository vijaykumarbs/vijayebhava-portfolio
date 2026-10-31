import type { MetadataRoute } from "next";
import { getPublishedPosts, POSTS_PER_PAGE, postUrl, SITE_URL, tagSlug } from "@/data/blog";

export const dynamic = "force-static";

const siteUrl = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const lastModified = (date: string) => new Date(date);
  const postLastModified = (post: (typeof posts)[number]) => lastModified(post.updated || post.date);
  const latestPostDate = posts.reduce<Date | undefined>((latest, post) => {
    const modified = postLastModified(post);
    return !latest || modified > latest ? modified : latest;
  }, undefined);
  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  const tags = new Set(posts.flatMap((post) => post.tags.map(tagSlug)).filter(Boolean));

  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/blog/`, lastModified: latestPostDate, changeFrequency: "weekly", priority: 0.8 },
    ...Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => ({
      url: `${siteUrl}/blog/page/${index + 2}/`,
      lastModified: latestPostDate,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
    ...[...tags].map((tag) => ({
      url: `${siteUrl}/blog/tags/${tag}/`,
      lastModified: latestPostDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    { url: `${siteUrl}/feed.xml`, lastModified: latestPostDate, changeFrequency: "daily", priority: 0.4 },
    ...posts.map((post) => ({
      url: postUrl(post.slug),
      lastModified: postLastModified(post),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
