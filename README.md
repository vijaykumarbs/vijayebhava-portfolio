# Vijayebhava portfolio

A customer-centred, scroll-led portfolio experience built with Next.js and a Three.js 3D journey scene. Six open work pods circle a shared customer hub; each uses a distinct department colour and a chapter-specific activity. A guided light travels between the rooms as the scroll position changes, while the camera moves smoothly to the active chapter. It is configured for **static export** so the generated site can be served by Hostinger Premium Web Hosting without a Node.js runtime.

## Run locally

```sh
npm install
npm run dev
```

## Build for Hostinger Premium

```sh
npm run build
```

Next.js writes the static website to `out/`. Upload the **contents** of `out/` to the document root for `vijayebhava.com` (usually `public_html`). WordPress can live on a separate subdomain such as `cms.vijayebhava.com`; do not overwrite the portfolio's document root with the WordPress installation.

The office scene and scrolling transitions execute in the visitor's browser. The site does not need a running Node process. The static export intentionally does not use Next.js server routes, runtime rendering, or ISR.

## WordPress copy

Set `WORDPRESS_URL` in `.env.local` to the WordPress site's base URL before running `npm run build`, for example:

```env
WORDPRESS_URL=https://cms.vijayebhava.com
```

The build requests public WordPress REST API pages and uses plain text from their titles and excerpts. Create and publish these WordPress pages to override the local copy:

| WordPress page slug | Fields used |
| --- | --- |
| `portfolio-intro` | Title and excerpt for the opening headline and introduction |
| `chapter-discovery` | Title and excerpt for chapter 01 |
| `chapter-strategy` | Title and excerpt for chapter 02 |
| `chapter-design` | Title and excerpt for chapter 03 |
| `chapter-engineering` | Title and excerpt for chapter 04 |
| `chapter-delivery` | Title and excerpt for chapter 05 |
| `chapter-outcomes` | Title and excerpt for chapter 06 |

Any page not found falls back to the reviewed local copy in `src/data/chapters.ts`. Because the website is static, edits in WordPress appear after rebuilding and uploading `out/`; they do not appear immediately after publishing. No WordPress credentials are stored in this project because only public page data is fetched.

## Content and visual settings

- Chapter narrative and deliverables: `src/data/chapters.ts`
- WordPress build-time content fetch: `src/data/wordpress.ts`
- 3D office scene and camera positions: `src/components/OfficeScene.tsx`
- Main page, chapter anchors and contact section: `src/app/page.tsx`
- Styling and responsive/reduced-motion behavior: `src/app/globals.css`

The contact section intentionally has no invented email, profile URL, client history, testimonials or results. Add a preferred contact method before publication.

## Deployment notes

- `next.config.ts` uses `output: "export"`, `trailingSlash: true`, and disables Next image optimization for static hosting compatibility.
- Uploading WordPress into the same document root would replace the portfolio. Keep the CMS on its own subdomain or hosting site.
- Use local image assets or add a static-compatible image loader if the visual is expanded with photography. The current scene is procedural and has no third-party 3D asset dependency.
