import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/data/blog";

export const dynamic = "force-static";

const siteUrl = "https://vijayebhava.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await getPublishedPosts();
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    ...(posts.length ? [{ url: `${siteUrl}/blog/`, changeFrequency: "weekly" as const, priority: 0.8 }] : []),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${encodeURIComponent(post.slug)}/`,
      lastModified: new Date(post.modified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
