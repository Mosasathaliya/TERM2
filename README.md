# TriNav

English learning app with AI features powered by Cloudflare Workers AI.

## Development

- Install: `npm install`
- Run dev: `npm run dev`

## Environment Variables

Set these in your environment (local `.env` or Cloudflare secrets/vars):

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_AI_GATEWAY_URL` (for LLM streaming via gateway)

## Build and Deploy (Cloudflare Pages)

- Build for Pages: `npm run cf:build`
- Local preview: `npm run cf:preview`
- Deploy: `npm run cf:deploy`

Configure the same env vars in your Cloudflare Project (Pages) before deploying.