# Blog migration notes

The public CMS posts endpoint returned one published article: `my-first-step-towards-independent-work`. It had no featured image and no tags; the only assigned taxonomy was the generic “Uncategorized” category, so no tag was added. The article is now `content/blog/my-first-step-towards-independent-work.md`.

The CMS pages endpoint returned no pages for the portfolio or chapter copy. The currently reviewed local home and chapter fallback copy was retained unchanged.

## Old CMS URLs to redirect or noindex

- `https://cms.vijayebhava.com/my-first-step-towards-independent-work/` — redirect this post URL to `https://vijayebhava.com/blog/my-first-step-towards-independent-work/` at the CMS host. A Cloudflare Pages `_redirects` file for `vijayebhava.com` cannot redirect the separate `cms.vijayebhava.com` host.
- `https://cms.vijayebhava.com/category/uncategorized/` — noindex or retire; it contained no useful category/tag archive content.
- `https://cms.vijayebhava.com/wp-json/` — noindex or disable from search results; this API is no longer used by the portfolio site.
- `https://cms.vijayebhava.com/wp-admin/` — keep out of search results.

No path on `vijayebhava.com` changed, so `public/_redirects` was not added.
