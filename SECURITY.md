# Security operations

- Do not commit credentials, tokens, deploy-hook URLs, private keys, customer files or other secrets. `.env*` stays ignored except the intentionally blank `.env.example`.
- `CF_PAGES_DEPLOY_HOOK` must be configured as a private repository Actions secret. Never copy its value into an issue, commit, log, or workflow output.
- To rotate the Cloudflare Pages deploy hook, create a new hook in the Pages project, update the repository secret `CF_PAGES_DEPLOY_HOOK`, trigger the scheduled-post deployment workflow once, confirm it succeeds, then delete the old hook in Cloudflare.

## After deployment

1. Open the public website's response headers in the browser developer tools.
2. Confirm `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy`, and `Strict-Transport-Security` are present.
3. Check the domain at [securityheaders.com](https://securityheaders.com/) to confirm the headers are delivered. The Content Security Policy (CSP) remains report-only: it does not currently block anything, and this site has no CSP report endpoint.
4. Do not treat the report-only CSP as a security control or enforcement. The static export contains inline Next.js scripts with hashes that vary by page. Enforcing the current single-hash policy would block scripts. Enforcement would require per-page hashes or allowing inline scripts.
5. Keep `Content-Security-Policy-Report-Only` as the header name. Do not change it to an enforcing `Content-Security-Policy` without separately designing and validating a policy that works for every exported page.
