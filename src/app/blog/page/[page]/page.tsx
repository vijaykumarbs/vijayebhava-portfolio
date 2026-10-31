import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/blog-listing";
import { getPublishedPosts, POSTS_PER_PAGE } from "@/data/blog";

export const dynamicParams = false;

type PaginationProps = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (pageCount <= 1) {
    // Next static export rejects an empty generateStaticParams result for this dynamic route.
    // Keep one noindex not-found route so the route can still participate in the export.
    return [{ page: "2" }];
  }
  return Array.from({ length: pageCount - 1 }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: PaginationProps): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Product Notes · Page ${page} | Vijayebhava`,
    alternates: { canonical: `/blog/page/${page}/` },
    robots: { index: false, follow: true },
  };
}

export default async function BlogPaginationPage({ params }: PaginationProps) {
  const { page: pageText } = await params;
  const page = Number(pageText);
  const posts = await getPublishedPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();
  const start = (page - 1) * POSTS_PER_PAGE;
  return <BlogListing posts={posts.slice(start, start + POSTS_PER_PAGE)} page={page} totalPages={totalPages} />;
}
