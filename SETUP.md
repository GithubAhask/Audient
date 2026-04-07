# Audient — Local Setup Guide

## Prerequisites
- Node.js 18+ (`node -v` to check)
- npm 9+ (`npm -v` to check)
- An Anthropic API key — [console.anthropic.com](https://console.anthropic.com)
- A Voyage AI API key (for embeddings) — [dash.voyageai.com](https://dash.voyageai.com) (free tier available)

## 1. Install dependencies

```bash
cd audient
npm install
```

## 2. Add your API keys

Open `.env.local` and fill in both keys:

```
ANTHROPIC_API_KEY=sk-ant-...
VOYAGE_API_KEY=pa-...
```

## 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 4. Test it

1. Find a YouTube podcast URL — a Lex Fridman, Huberman Lab, or Acquired episode works well
2. Paste the URL and click **Load**
3. Wait ~10–30 seconds for transcript indexing (progress shown in the UI)
4. Type a question and hit Enter

## 5. Run unit tests

```bash
npm run test
```

All tests should pass before deploying.

## 6. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set your environment variables in the Vercel dashboard:
- `ANTHROPIC_API_KEY`
- `VOYAGE_API_KEY`

## Troubleshooting

**"Could not retrieve transcript"** — The YouTube video may have captions disabled. Try a different video.

**Images not loading** — Check that `next.config.ts` has the YouTube image domain allowlist (already included).

**Slow first response** — Normal. The first embedding query after server start may take a few extra seconds.

**"Episode not ready"** — The server restarted and lost in-memory state. Reload the episode URL.
