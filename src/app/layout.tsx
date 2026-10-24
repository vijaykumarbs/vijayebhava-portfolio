import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { GoogleAnalyticsPageViews } from "@/components/google-analytics-page-views";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://vijayebhava.com"),
  title: "Vijayebhava | Product Discovery & Product Management",
  description:
    "Product discovery and product management for founders building AI-enabled SaaS and digital products. Clarify the problem, prioritise what matters, and shape practical delivery.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vijayebhava | Product Discovery & Product Management",
    description:
      "Product discovery and product management for founders building AI-enabled SaaS and digital products.",
    url: "https://vijayebhava.com/",
    siteName: "Vijayebhava",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={dmSans.variable}>
        {children}
        {gaMeasurementId && (
          <GoogleAnalyticsPageViews measurementId={gaMeasurementId} />
        )}
      </body>
    </html>
  );
}
