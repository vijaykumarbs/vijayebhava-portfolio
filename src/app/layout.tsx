import type { Metadata } from "next";
import { GoogleAnalyticsPageViews } from "@/components/google-analytics-page-views";
import { ThemeController } from "@/components/theme-controller";
import { ScrollAndPointerEffects } from "@/components/scroll-and-pointer-effects";
import "./globals.css";

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
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Vijayebhava — Make the complex clear. Build what matters." }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="auto" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "(()=>{const r=document.documentElement;try{const t=localStorage.getItem('vb-theme');r.dataset.theme=t==='light'||t==='dark'||t==='auto'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){r.dataset.theme='light'}const h=new Date().getHours();r.dataset.atmosphere=h>=5&&h<8?'dawn':h>=8&&h<16?'day':h>=16&&h<18?'golden-hour':h>=18&&h<20?'dusk':'night'})()" }} />
      </head>
      <body>
        <ThemeController />
        <ScrollAndPointerEffects />
        {children}
        {gaMeasurementId && (
          <GoogleAnalyticsPageViews measurementId={gaMeasurementId} />
        )}
      </body>
    </html>
  );
}
