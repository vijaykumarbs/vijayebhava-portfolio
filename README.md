# Vijayebhava — Product Management Portfolio

A responsive Next.js portfolio for product management and business transformation. It uses a lightweight product-journey illustration, typography-led sections and a reduced-motion-aware entrance animation. WordPress on `cms.vijayebhava.com` provides blog content through its public REST API.

## Run locally

```sh
npm install
npm run dev
```

## Run a production build

```sh
npm run build
```

The app uses Next.js server rendering and Incremental Static Regeneration (ISR), so production hosting must support the Next.js runtime. Hostinger Premium serves static files but does not provide the Node.js app runtime needed for this configuration.

## Google Analytics 4

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the GA4 web stream Measurement ID before running `npm run build`. The static export embeds the ID at build time; the tag is omitted when the variable is unset. The provided `.env.example` contains the current ID (`G-EK0TS9LYBC`).

The root layout loads `gtag.js` once across the site. Automatic page views are disabled, and the App Router tracker sends one `page_view` for the initial route and each pathname change. Section anchors and query strings do not create extra page views or enter the reported page URL. No form contents or personal information are sent.

To verify, build with the variable set, open the exported site, and use GA4 **Realtime** or **DebugView** to confirm a `page_view` event. For a locally served static export, check the browser Network panel for `gtag/js?id=G-EK0TS9LYBC` and the `g/collect` request.

## WordPress copy and blog

Set `WORDPRESS_URL` in the deployment environment (or `.env.local` for local development) to the WordPress site's base URL:

```env
WORDPRESS_URL=https://cms.vijayebhava.com
```

Published WordPress posts populate `/blog/` and each article gets a search-friendly page with canonical metadata and BlogPosting structured data. The sitemap includes published posts; drafts are excluded. Blog data is revalidated every 60 seconds, so a new post appears without a site rebuild or redeploy.

To add an article, sign in at `https://cms.vijayebhava.com/wp-admin/`, choose **Posts → Add Post**, and publish it. The Next.js site reads the public WordPress REST API; no WordPress password is stored in this repository. The CMS's WordPress theme is separate from the branded Next.js frontend.

For deployment, connect this repository to a Next.js runtime host and configure `WORDPRESS_URL` and `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Vercel Hobby is free for personal, non-commercial projects; review its current usage terms before using it for commercial work.

## Main files

- Main content and company marks: `src/app/page.tsx`
- Responsive visual system: `src/app/globals.css`
- WordPress blog API and post formatting: `src/data/blog.ts`
- Blog index and article pages: `src/app/blog/`
- Sitemap and crawler rules: `src/app/sitemap.ts`, `src/app/robots.ts`
- Process narrative: `src/data/chapters.ts`
- WordPress build-time copy: `src/data/wordpress.ts`
- SEO and page metadata: `src/app/layout.tsx`

The company strip uses official local logo files where available, with a text wordmark for Vyturr. No client outcomes, role tenure, testimonials or performance figures are invented.
