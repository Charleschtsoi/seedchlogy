# Seedchlogy — zen relaxation (web + iOS/Android)

A calm, warm-toned experience: **breathing first**, then a conversational **AI guide** (optional) that suggests short relaxation activities from a shared library. This is **wellness-only**—not therapy or crisis care.

## Monorepo layout

| Path | Purpose |
|------|---------|
| Next.js app (root) | Web UI + `/api/chat` backend |
| [`packages/shared`](packages/shared) | Copy, breathing math, activities, chat client helper (`postChat`) |
| [`mobile`](mobile) | Expo (React Native) app — same flows as web |

**React in a workspace:** keep the root `react` / `react-dom` on the **same minor as Expo’s React Native** (e.g. `19.1.0` with Expo SDK 54). A newer root-only version (e.g. `19.2.x`) gets hoisted and triggers *“Incompatible React versions: react vs react-native-renderer”* on device. After changing versions, restart Metro with a clean cache: `npx expo start --clear`.

## Tech stack

| Layer | Choice |
| -------- | ------ |
| Web framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Web UI | React 19, [Tailwind CSS](https://tailwindcss.com/) v4 |
| Mobile | [Expo SDK 54](https://expo.dev/), React Navigation, AsyncStorage |
| Fonts (web) | Nunito Sans, Fraunces via `next/font` |
| AI | OpenAI Chat Completions (`gpt-4o-mini` by default); **offline fallback** when `OPENAI_API_KEY` is unset |
| Content | [`packages/shared/src/activities.ts`](packages/shared/src/activities.ts) |

## Design tokens

- **Web CSS variables**: [`src/app/globals.css`](src/app/globals.css)
- **Shared programmatic tokens**: [`packages/shared/src/tokens.ts`](packages/shared/src/tokens.ts)
- **Mobile theme**: [`mobile/src/theme.ts`](mobile/src/theme.ts) (warm palette parity)

Breathing presets: [`packages/shared/src/breathing.ts`](packages/shared/src/breathing.ts).

## Environment — web

Create `.env.local` in the repo root:

```bash
OPENAI_API_KEY=sk-...
# optional:
# OPENAI_MODEL=gpt-4o-mini
```

## Environment — mobile (chat API)

The app **never** embeds `OPENAI_API_KEY`. It calls your **deployed** Next.js site:

1. Deploy the web app (e.g. Vercel) so `https://your-domain.com/api/chat` is public.
2. Point the mobile app at that origin:

```bash
cd mobile
EXPO_PUBLIC_API_BASE_URL=https://your-domain.com npx expo start
```

Or set `extra.apiBaseUrl` via [`mobile/app.config.ts`](mobile/app.config.ts) / EAS secrets for production builds.

On a **physical device**, `http://localhost:3000` will not reach your Mac; use your machine’s LAN IP or a deployed URL.

**CORS:** Native `fetch` does not use browser CORS; no extra headers are required for the app calling your API.

## Scripts

```bash
npm install
npm run dev
```

Web: [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

**Mobile:**

```bash
npm run mobile
```

Then press `i` for iOS simulator or scan the QR code in Expo Go.

## Web routes

- `/` — Landing, crisis links, resume session hints
- `/breathe` — Setup + guided breathing
- `/chat` — Guide, chips, suggestion cards
- `/activity/[slug]` — Step-by-step activities
- `/safety`, `/settings`

## Mobile screens

- **Tabs:** Home, Breathe, Guide (chat), More (Safety + Settings stack)
- **Stack:** Activity player (opened from suggestion cards)

Session and “force reduced motion” use **AsyncStorage** on device (see `mobile/src/storage/`).

## iOS (TestFlight) — outline

1. [Apple Developer Program](https://developer.apple.com/programs/) ($99/year).
2. Install [EAS CLI](https://docs.expo.dev/build/setup/): `npm i -g eas-cli`
3. In `mobile/`: `eas login`, `eas build:configure`, then `eas build -p ios`
4. Submit the build to App Store Connect and enable **TestFlight** for internal/external testers.

Use **EAS environment variables** for `EXPO_PUBLIC_API_BASE_URL` in production builds so the app hits your deployed API.

## Product copy

[`packages/shared/src/copy.ts`](packages/shared/src/copy.ts) — positioning, crisis lines, microcopy (web + mobile).
