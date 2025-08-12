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