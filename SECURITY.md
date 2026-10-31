# Security operations

- Do not commit credentials, tokens, deploy-hook URLs, private keys, customer files or other secrets. `.env*` stays ignored except the intentionally blank `.env.example`.
- `CF_PAGES_DEPLOY_HOOK` must be configured as a private repository Actions secret. Never copy its value into an issue, commit, log, or workflow output.
- To rotate the Cloudflare Pages deploy hook, create a new hook in the Pages project, update the repository secret `CF_PAGES_DEPLOY_HOOK`, trigger the scheduled-post deployment workflow once, confirm it succeeds, then delete the old hook in Cloudflare.

## After deployment

1. Open the public website's response headers in the browser developer tools.
2. Confirm `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy`, and `Strict-Transport-Security` are present.
3. Check the domain at [securityheaders.com](https://securityheaders.com/) and review the report-only Content Security Policy violations in a browser console or configured Cloudflare reporting destination.
4. Investigate each CSP violation and verify needed analytics, images, forms, styles, and scripts before enforcement.
5. Update the hash in `public/_headers` whenever the inline theme script changes. Recalculate it as Base64 SHA-256 of the exact script text.
6. Once report-only violations are understood, change `Content-Security-Policy-Report-Only` to `Content-Security-Policy`, deploy, and recheck the site and headers.
