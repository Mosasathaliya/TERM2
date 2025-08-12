<<<<<<< Current (Your changes)
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
=======
# TriNav

English learning app with AI features powered by Cloudflare Workers AI.

## Development

- Install: `npm install`
- Run dev: `npm run dev`

## Environment Variables

Set these in your environment (local `.env` or Cloudflare Pages project Variables/Secrets):

Required for AI:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_AI_GATEWAY_URL` (AI Gateway URL for LLM requests)

Authentication:
- `APP_LOGIN_ID` (login ID number)
- `APP_LOGIN_PASSWORD` (login password)
- `SESSION_SECRET` (random secret string for session token hashing)

Storage (KV):
- `LESSON_RAG_NS_ID` (the KV Namespace ID for `LESSON_RAG`)

## Cloudflare Setup

1) Create KV Namespace (if not already):
- In Cloudflare dashboard → Workers & Pages → KV → Create Namespace named `LESSON_RAG`
- Copy its Namespace ID and set `LESSON_RAG_NS_ID` in your project environment (or as a Pages Variable).

2) Pages Project Variables
- Add Variables (plain values):
  - `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_AI_GATEWAY_URL`, `APP_LOGIN_ID`, `APP_LOGIN_PASSWORD`, `SESSION_SECRET`, `LESSON_RAG_NS_ID`
- Add Secrets (if preferred for sensitive):
  - `CLOUDFLARE_API_TOKEN`

3) Wrangler local binding
- `wrangler.toml` already binds KV as `LESSON_RAG` and forwards env vars into Pages runtime.

## Build and Deploy (Cloudflare Pages)

- Build for Pages: `npm run cf:build`
- Local preview: `npm run cf:preview`
- Deploy: `npm run cf:deploy`

Notes:
- The app uses Edge runtime (`runtime = 'edge'`) for dynamic routes.
- Dynamic AI calls use KV caching (RAG) to reduce cost.
- Middleware enforces login; first page is `/login` with Arabic UI (no signup).
>>>>>>> Incoming (Background Agent changes)
