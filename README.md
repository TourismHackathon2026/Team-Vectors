# NepaliSathi — Gamified Tourism Discovery for Nepal

Web app that turns exploring Nepal's heritage sites into an interactive quest with stamps, XP, leaderboards, and AI-powered storytelling and help tourist to explore Nepal as a local.

## Tech Stack

- **Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4
- **UI/UX:** Framer Motion, Lucide React
- **Map:** Leaflet / React-Leaflet
- **Database:** Supabase (auth, reviews, user data; localstorage fallback)
- **AI Chat:** Gemini API (falls back to mock responses when key is absent)
- **QR Scanning:** html5-qrcode
- **Linting:** oxlint

## Getting Started

```bash
npm install
cp .env.example .env    # fill in your Supabase & Gemini keys
npm run dev             # http://localhost:5173
npm run build           # production build to dist/
```

## Features

### Heritage Discovery
- Browse 10 UNESCO / cultural heritage sites with descriptions, ratings, opening hours
- Explore 25+ places across food, crafts, nature, hidden gems categories
- Interactive map with Leaflet showing all locations

### Gamification
- **Stamps** — collect a digital stamp at each site visited
- **XP & Levels** — earn XP for stamps, reviews, quests; level up from "Wanderer" to "Living Legend"
- **Leaderboard** — top travellers ranked by XP or stamps collected
- **Achievements** — unlock badges for milestones (e.g. 10 stamps, 5 reviews)
- **Quests** — themed challenges that reward XP

### On-the-Go Features
- **QR Code Scanning** — scan site QR codes to auto-collect stamps
- **GPS Proximity Detection** — auto-collect stamp + 50 XP when within 150m of a site
- **Multi-language** — English, Nepali, Hindi (language switcher in navbar)

### Social & Memory
- **Reviews & Ratings** — star ratings and comments per site (synced to Supabase)
- **Photo Upload** — attach up to 5 photos per memory book entry
- **Passport** — personal digital passport of collected stamps
- **Itinerary Planner** — plan your day by time slots

### AI Story Mode
- Generate a dramatic retelling of your visit via Gemini AI
- Falls back to pre-written mock stories when API key is not configured

## Project Structure

```
src/
├── components/       # Reusable UI (button, card, badge, star, etc.)
├── pages/            # Route pages (Home, Explore, HeritageDetails, etc.)
├── data/             # Static data (heritage.ts, places.ts, reviews.ts)
├── context/          # React context (Auth, Data, Toast)
├── lib/              # Utilities (i18n, supabase client)
├── layouts/          # Shared layout shell
├── services/         # Supabase chat service
├── types/            # TypeScript interfaces
├── styles/           # Global CSS (Tailwind imports)
└── utils/            # Helper functions
```

## Environment Variables

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key   # optional, AI falls back without it
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |
