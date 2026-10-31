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
- Build command: `npm run build`
- Build output directory: `out`
- Node.js version: `22`
- Environment variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

To connect the repository, create a Cloudflare Pages project, connect the GitHub repository and production branch, enter the settings above, add the optional GA4 environment variable, then start the first deployment. Add the repository secret `CF_PAGES_DEPLOY_HOOK` with the project's deploy-hook URL for scheduled post publishing. The daily workflow calls this hook; Cloudflare rebuilds the connected branch and future-dated posts become eligible when the new build runs.

Before relying on scheduled deploys, confirm current Cloudflare Pages deploy-hook behavior and the support and precedence of `_headers` and `_redirects` in the Cloudflare documentation. Static export behavior can change independently of this repository.

## Blog authoring

Posts live in `content/blog/<slug>.md`. Required frontmatter fields are `title`, `slug`, `date` (ISO date or datetime), `description`, `tags` (array), `imageAlt`, and `draft` (boolean). Optional fields are `updated`, `image` (local file under `public/blog/`), `canonicalUrl`, and `cta` with `label` and `url`.

```sh
npm run new-post -- "A useful title"
```

The command creates a draft with `TODO(Vijay)` content fields. Fill them in and remove the TODO values before setting `draft: false`. Draft posts and future-dated posts are excluded from the static export. Images must be local `/blog/...` files; Markdown raw HTML is not enabled. Markdown is parsed using `gray-matter` and Unified/remark, transformed to HAST, and sanitized with `rehype-sanitize`; React renders the sanitized tree without injecting HTML strings.

Blog URLs preserve `/blog/` and `/blog/<slug>/`. The archive paginates at 10 posts, tag pages are at `/blog/tags/<tag>/`, and `/feed.xml` provides RSS. The sitemap includes articles, archive pages, tag archives and the feed. Posts with shared tags show up to three related links. The end-of-post CTA defaults to “Book a call” and can be overridden in post frontmatter.

The migration notes list CMS URLs that should be redirected or noindexed at the old host. No `vijayebhava.com` content path changed, so no Pages redirect is currently needed.

## Response security headers

`public/_headers` sets the standard hardening headers and starts the Content Security Policy in report-only mode. After deployment, inspect browser-console or configured Cloudflare CSP reports, resolve required violations, and then change `Content-Security-Policy-Report-Only` to `Content-Security-Policy`. Keep the exact hash for the inline theme initializer synchronized whenever its source changes. Check the deployed result at [securityheaders.com](https://securityheaders.com/).

## Google Analytics 4

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the build environment to the GA4 web stream Measurement ID. The static export embeds the ID at build time; the tag is omitted when unset. No form contents or personal information are sent.

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
