# Vijayebhava — Product Management Portfolio

A responsive Next.js 15 portfolio and local Markdown blog for product management and business transformation. The site is statically exported to `out/` for Cloudflare Pages.

## Run locally

```sh
npm ci
npm run dev
```

## Build and deploy

```sh
npm run typecheck
npm run lint
npm run build
```

Cloudflare Pages settings:

- Framework preset: Next.js (Static HTML Export) or None
- Build command: `npm run build && npm run check:output`
- Build output directory: `out`
- Node.js version: `22`
- Environment variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

### Contact form

The `/api/contact` Pages Function sends messages through Resend. Configure the encrypted secrets `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, and `RESEND_API_KEY` in the Cloudflare Pages project. `CONTACT_FROM_EMAIL` must use a verified sending domain. Bind a KV namespace as `CONTACT_RATE_LIMIT_KV` for the existing per-IP limit of five messages per hour. Do not commit secret values.

To connect the repository, create a Cloudflare Pages project, connect the GitHub repository and production branch, enter the settings above, add the optional GA4 environment variable, then start the first deployment. Add the repository secret `CF_PAGES_DEPLOY_HOOK` with the project's deploy-hook URL for scheduled post publishing. The daily workflow calls this hook; Cloudflare rebuilds the connected branch and future-dated posts become eligible when the new build runs.

Before relying on scheduled deploys, confirm current Cloudflare Pages deploy-hook behavior and the support and precedence of `_headers` and `_redirects` in the Cloudflare documentation. Static export behavior can change independently of this repository.

## Blog authoring

Posts live in `content/blog/<slug>.md`. Required frontmatter fields are `title`, `slug`, `date` (ISO date or datetime), `description`, `tags` (array), and `draft` (boolean). Optional fields are `updated`, `image` (local file under `public/blog/`, requires non-empty `imageAlt` and decorative posts must omit the image), `imageAlt`, `imageWidth` and `imageHeight` (positive integers, supplied together), `canonicalUrl`, and `cta` with `label` and `url`.

```sh
npm run new-post -- "A useful title"
```

The command creates a draft with `TODO(Vijay)` content fields. Fill them in and remove the TODO values before setting `draft: false`. Draft posts and future-dated posts are excluded from the static export. Images must be local `/blog/...` files; Markdown raw HTML is not enabled. Markdown is parsed using `gray-matter` and Unified/remark, transformed to HAST, and sanitized with `rehype-sanitize`; React renders the sanitized tree without injecting HTML strings.

To publish from GitHub, open **Actions → Publish blog post → Run workflow** on the `main` branch and paste the complete Markdown file, including frontmatter, into the `markdown` input. The workflow rejects drafts, invalid slugs, duplicate filenames, empty bodies, and oversized input. It then runs the existing post validation through typecheck, lint, tests and a static build. If all checks pass, it commits only the new file to `content/blog/` on `main`; the Cloudflare Pages production build is triggered by that push. You need repository write access. Future-dated posts are allowed and become eligible through the scheduled deployment workflow.

Blog URLs preserve `/blog/` and `/blog/<slug>/`. The archive paginates at 10 posts, tag pages are at `/blog/tags/<tag>/`, and `/feed.xml` provides RSS. The sitemap includes articles, archive pages, tag archives and the feed. Posts with shared tags show up to three related links. The end-of-post CTA defaults to “Book a call” and can be overridden in post frontmatter.

The migration notes list CMS URLs that should be redirected or noindexed at the old host. No `vijayebhava.com` content path changed, so no Pages redirect is currently needed.

## Response security headers

`public/_headers` sets the standard response headers and a Content Security Policy (CSP) in report-only mode. The CSP does not currently block anything, and there is no CSP report endpoint. The static export has inline Next.js scripts whose hashes differ by page, so an enforced policy with the current single hash would block scripts. Enforcement would require per-page hashes or allowing inline scripts; the CSP must remain report-only until that design is completed. Check delivered headers at [securityheaders.com](https://securityheaders.com/).

## Google Analytics 4

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the build environment to the GA4 web stream Measurement ID. The static export embeds the ID at build time; the tag is omitted when unset. Analytics and AdSense load only after a visitor chooses “Accept all”; “Necessary only” and “Reject all” leave both disabled. The saved choice can be changed with the Privacy choices button. Events include `page_view`, `linkedin_profile_click`, `whatsapp_click`, `booking_click`, and `generate_lead` after a successful contact-form response. GA receives no form contents or personal information. LinkedIn profile views and messages actually sent in WhatsApp are not observable from this site; click events are proxies.

## Google AdSense

The blog listing and article pages include the configured display ad unit. `/ads.txt` identifies the publisher account. Ads are requested only after a visitor chooses “Accept all” and use non-personalized targeting; delivery depends on Google marking the site Ready for ads.

## Main files

- Main content and company marks: `src/app/page.tsx`, `src/data/portfolio.ts`
- Responsive visual system: `src/app/globals.css`
- Animated process: `src/components/how-i-work-animation.tsx`, `src/data/chapters.ts`
- Local Markdown parser and validation: `src/data/blog.ts`
- Blog source: `content/blog/`
- Blog pages and components: `src/app/blog/`, `src/components/blog-listing.tsx`, `src/components/markdown-content.tsx`
- Sitemap, RSS and crawler rules: `src/app/sitemap.ts`, `src/app/feed.xml/route.ts`, `src/app/robots.ts`
- Site identity and booking configuration: `src/data/site-config.ts`

The company strip uses local logo files where available and a text wordmark for Vyturr. Case details include only information currently supported by the source material.
