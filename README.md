## Deploy on Cloudflare Pages

1. Install deps: `npm i`
2. Set env (example `.env.local`):
```
CLOUDFLARE_AI_GATEWAY_URL=https://api.cloudflare.com/client/v4/ai/gateway
CLOUDFLARE_API_TOKEN=REPLACE_WITH_YOUR_TOKEN
CLOUDFLARE_ACCOUNT_ID=REPLACE_WITH_YOUR_ACCOUNT
```
3. Build for Pages: `npm run pages:build`
4. Deploy: `npm run pages:deploy`

Resources (optional): create KV/D1/Vectorize with Wrangler and bind to project `term2`.
