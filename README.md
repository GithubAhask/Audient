# Audient

Timestamp-aware podcast Q&A companion built with Next.js 14, TypeScript, and Claude AI.

## Features

- Extract transcripts from YouTube videos
- Generate embeddings for semantic search
- Ask questions about podcast content
- Get timestamp-linked answers

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **AI:** Voyage AI (embeddings), Anthropic Claude (answers)
- **Testing:** Vitest + Testing Library

## Prerequisites

- Node.js 18+ 
- npm 10+

## Environment Setup

1. Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

2. Add your API keys:
```
VOYAGE_API_KEY=your_voyage_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run tests:

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

UI mode:

```bash
npm run test:ui
```

## Building

Create a production build:

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js app directory (pages, layouts)
├── components/       # Reusable React components
├── lib/              # Utilities, types, and shared logic
├── __tests__/        # Test files
└── styles/           # Global styles
```

## License

MIT
