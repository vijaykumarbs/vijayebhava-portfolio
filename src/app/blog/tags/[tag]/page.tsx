import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TagPageListing } from "@/components/blog-listing";
import { getPublishedPosts, tagSlug } from "@/data/blog";

export const dynamicParams = false;
type TagPageProps = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const tags = new Set(posts.flatMap((post) => post.tags.map(tagSlug)).filter(Boolean));
  return tags.size ? [...tags].map((tag) => ({ tag })) : [{ tag: "__no-tags-yet__" }];
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const posts = await getPublishedPosts();
  const matching = posts.filter((post) => post.tags.some((name) => tagSlug(name) === tag));
  const label = matching.flatMap((post) => post.tags).find((name) => tagSlug(name) === tag);
  if (!label) return { title: "Topic not found | Vijayebhava", robots: { index: false, follow: false } };
  return {
    title: `${label} | Product Notes | Vijayebhava`,
    alternates: { canonical: `/blog/tags/${tag}/` },
    robots: { index: false, follow: true },
  };
}

export default async function BlogTagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getPublishedPosts();
  const matching = posts.filter((post) => post.tags.some((name) => tagSlug(name) === tag));
  if (!matching.length) notFound();
  return <TagPageListing posts={matching} tag={tag} />;
}
