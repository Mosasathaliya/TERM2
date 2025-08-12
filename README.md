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

Optional: Provision RAG resources (Vectorize, D1, KV)
```bash
# Vectorize (term2, 768-dims cosine)
wrangler vectorize create term2 --dimensions=768 --metric=cosine

# D1 database (term2)
wrangler d1 create term2

# KV namespace (TERM2_KV)
wrangler kv:namespace create TERM2_KV
```
Bindings are scaffolded in `wrangler.toml` (commented). The app auto-resolves Account ID from token.
