import type { Metadata } from "next";
import { BlogListing } from "@/components/blog-listing";
import { getPublishedPosts } from "@/data/blog";

const POSTS_PER_PAGE = 10;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  const hasArticles = posts.length > 0;
  return {
    title: "Product Notes & Articles | Vijayebhava",
    description: "Notes on product discovery, prioritisation, AI-enabled products and practical product management.",
    alternates: { canonical: "/blog/" },
    robots: { index: hasArticles, follow: hasArticles },
    openGraph: {
      title: "Product Notes & Articles | Vijayebhava",
      description: "Notes on product discovery, prioritisation, AI-enabled products and practical product management.",
      url: "https://vijayebhava.com/blog/",
      siteName: "Vijayebhava",
      type: "website",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Vijayebhava — Make the complex clear. Build what matters." }],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
  };
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  return <BlogListing posts={posts.slice(0, POSTS_PER_PAGE)} page={1} totalPages={Math.ceil(posts.length / POSTS_PER_PAGE)} />;
}
