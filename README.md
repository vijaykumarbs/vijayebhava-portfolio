# Vijayebhava — Product Management Portfolio

A responsive editorial portfolio for product management and business transformation. It uses a lightweight product-journey illustration, typography-led sections and a reduced-motion-aware entrance animation. The static export is designed to run on Hostinger Premium Web Hosting without a Node.js runtime.

## Run locally

```sh
npm install
npm run dev
```

## Build for Hostinger Premium

```sh
npm run build
```

Next.js writes the static site to `out/`. Upload the **contents** of `out/` to the document root for `vijayebhava.com` (usually `public_html`). Hostinger's File Manager opens in the current website's `public_html` directory; use its Upload action to add the exported files. Keep a separate WordPress installation on a CMS subdomain such as `cms.vijayebhava.com` so it does not replace the portfolio document root.

The export does not require a running Node process. It intentionally does not use Next.js runtime routes, server rendering or ISR.

## Google Analytics 4

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the GA4 web stream Measurement ID before running `npm run build`. The static export embeds the ID at build time; the tag is omitted when the variable is unset. The provided `.env.example` contains the current ID (`G-EK0TS9LYBC`).

The root layout loads `gtag.js` once across the site. Automatic page views are disabled, and the App Router tracker sends one `page_view` for the initial route and each pathname change. Section anchors and query strings do not create extra page views or enter the reported page URL. No form contents or personal information are sent.

To verify, build with the variable set, open the exported site, and use GA4 **Realtime** or **DebugView** to confirm a `page_view` event. For a locally served static export, check the browser Network panel for `gtag/js?id=G-EK0TS9LYBC` and the `g/collect` request. Rebuild and upload `out/` to Hostinger only when you choose to publish; no live deployment is performed as part of this change.

## WordPress copy

Set `WORDPRESS_URL` in `.env.local` to the WordPress site's base URL before building, for example:

```env
WORDPRESS_URL=https://cms.vijayebhava.com
```

Create and publish a `portfolio-intro` page to override the hero title and excerpt. If it is unavailable, the reviewed local copy is used. Because the site is static, WordPress edits appear after rebuilding and uploading `out/`.

## Main files

- Main content and company marks: `src/app/page.tsx`
- Responsive visual system: `src/app/globals.css`
- Process narrative: `src/data/chapters.ts`
- WordPress build-time copy: `src/data/wordpress.ts`
- SEO and page metadata: `src/app/layout.tsx`

The company strip uses official local logo files where available, with a text wordmark for Vyturr. No client outcomes, role tenure, testimonials or performance figures are invented.
