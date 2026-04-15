# Seedchlogy — zen relaxation web app

A calm, warm-toned Next.js experience: **breathing first**, then a conversational **AI guide** (optional) that suggests short relaxation activities from a fixed on-site library. This is **wellness-only**—not therapy or crisis care. See the in-app **Safety** page for disclaimers and crisis resources.

## Tech stack

| Layer | Choice |
| -------- | ------ |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | React 19, [Tailwind CSS](https://tailwindcss.com/) v4 |
| Fonts | [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) (UI), [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) via `next/font` |
| AI | OpenAI Chat Completions API (`gpt-4o-mini` by default) with JSON output; **offline heuristic fallback** when `OPENAI_API_KEY` is unset |
| Content | Relaxation scripts live in [`src/lib/activities.ts`](src/lib/activities.ts) (grounding, PMR-lite, stretch, breath, visualization) |

## Design tokens

- **CSS variables** (colors, radii, motion): [`src/app/globals.css`](src/app/globals.css)
- **Programmatic tokens** (durations, radii numbers): [`src/lib/tokens.ts`](src/lib/tokens.ts)

Breathing pattern presets and phase math: [`src/lib/breathing.ts`](src/lib/breathing.ts) (slow ≈ 4-4-6 with 0s tail skipped; medium 4-1-4-1). Zero-second phases are omitted so timers stay correct.

## Environment

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-...
# optional override:
# OPENAI_MODEL=gpt-4o-mini
```

Without a key, the chat API still returns supportive copy and suggestions using simple keyword routing.

## Scripts

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Routes

- `/` — Landing, crisis links, resume session hints
- `/breathe` — Setup + guided breathing (orb / bar / text; pause; Space)
- `/chat` — Warm assistant, chips, suggestion cards, “Why this?”
- `/activity/[slug]` — Step-by-step activity player
- `/safety` — Scope, AI disclosure, crisis resources
- `/settings` — Optional forced reduced motion (stored in `localStorage`)

## Product copy

Centralized in [`src/lib/copy.ts`](src/lib/copy.ts) (positioning, crisis lines, microcopy).
