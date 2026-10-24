import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vijay Ebhava | Product Management & Business Transformation",
  description:
    "Product management portfolio of Vijay Ebhava: connecting customer needs, business priorities and engineering realities to build what matters.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
