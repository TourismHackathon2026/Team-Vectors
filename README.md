# NepalSathi

**Your Nepal travel companion** discover authentic local experiences across the Kathmandu Valley. Nepal Sathi is a gamified tourism platform that helps travelers explore Nepal's heritage sites like a local.

---

## Features

- **Interactive Map** — Leaflet-powered map with heritage site markers, heatmap circles, and routing
- **Digital Passport** — Collect stamps by visiting heritage sites (QR code scanning) to build your Heritage Passport
- **Gamified Quests** — 23 quests (20 standard + 3 secret) across 8 categories with XP rewards and levels
- **Your Story** — Auto-generated narrative chapters for each completed quest, displayed on a timeline
- **AI Chat** — Nepali Sathi AI assistant powered by Google Gemini 2.0 Flash for travel recommendations
- **Authentic Places** — 25 curated local spots: food, crafts, hidden gems, coffee, and more
- **Itinerary Planner** — Drag-and-drop day planner with time slots (morning, afternoon, evening, night)
- **Memory Book** — Personal travel journal with photos and notes per visit
- **Achievements** — 8 badges to unlock (Heritage Hunter, Food Explorer, Nepal Master, etc.)
- **Dark Mode** — Class-based dark mode with warm ivory canvas and glassmorphism
- **Emergency Contacts** — Quick access to hospitals, police, embassies, and safety tips

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animations | Framer Motion |
| Icons | Lucide React |
| Maps | Leaflet + react-leaflet |
| AI | Google Gemini 2.0 Flash API |
| Auth & DB | Supabase (PostgreSQL + Row Level Security) |
| Routing | react-router-dom v7 |
| Linting | Oxlint |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm

### Installation

```bash
git clone <repo-url>
cd nepalsathi
npm install
```

### Environment Variables

Copy the `.env` file and fill in your keys:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `VITE_GEMINI_API_KEY` | No | For AI chat (falls back to mock responses) |

### Development

```bash
npm run dev
```

Starts the Vite dev server with hot module replacement at `http://localhost:5173`.

### Build

```bash
npm run build
```

Type-checks with TypeScript and produces an optimized production build in `dist/`.

### Lint

```bash
npm run lint
```

---

## Project Structure

```
nepalsathi/
├── src/
│   ├── App.tsx                 # Router + provider tree
│   ├── main.tsx                # Entry point
│   ├── styles/index.css        # Tailwind v4 theme + global CSS
│   ├── types/index.ts          # All TypeScript interfaces
│   ├── lib/supabase.ts         # Supabase client
│   ├── utils/helpers.ts        # Utility functions
│   ├── layouts/Layout.tsx      # Page shell: Navbar + Outlet + Footer
│   ├── context/                # React context providers
│   │   ├── AuthContext.tsx      # Auth state & login/register/logout
│   │   ├── DataContext.tsx      # App data (quests, stamps, stories, etc.)
│   │   └── ToastContext.tsx     # Toast notifications
│   ├── components/             # Reusable components
│   │   ├── Navbar.tsx, Footer.tsx, MapView.tsx, AIChat.tsx, AIStoryMode.tsx
│   │   └── ui/                 # Primitives
│   │       ├── Button.tsx, Card.tsx, Modal.tsx, Badge.tsx, Input.tsx
│   │       ├── Toast.tsx, Skeleton.tsx, EmptyState.tsx
│   │       ├── AchievementUnlock.tsx, AuthenticityBadge.tsx, StarRating.tsx
│   ├── pages/                  # Page components (17 routes)
│   │   ├── Home.tsx, Explore.tsx, ExploreMap.tsx, HeritageDetails.tsx
│   │   ├── Passport.tsx, Stamps.tsx, Dashboard.tsx, Profile.tsx
│   │   ├── About.tsx, Contact.tsx, Login.tsx, Register.tsx
│   │   ├── Quests.tsx, Itinerary.tsx, MemoryBook.tsx, Emergency.tsx
│   │   └── Story.tsx
│   ├── services/               # Service modules
│   │   ├── storage.ts          # localStorage wrapper
│   │   ├── aiService.ts        # Gemini AI integration
│   │   └── passport.ts         # Passport stamp CRUD
│   └── data/                   # Static data
│       ├── heritage.ts, places.ts, quests.ts, levels.ts
│       ├── emergency.ts, ai-responses.ts, story-templates.ts
├── supabase/migrations/        # Database migrations
│   ├── 00001_initial_schema.sql
│   ├── 00002_add_achievements.sql
│   └── 00003_fix_auth_trigger.sql
└── scripts/fix-auth-trigger.mjs  # Utility to drop broken auth trigger
```

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing page with hero, features, testimonials |
| `/explore` | Explore | Browse heritage sites by category |
| `/explore-map` | ExploreMap | Interactive Leaflet map |
| `/heritage/:id` | HeritageDetails | Site details, stamp collection, AI story mode |
| `/passport` | Passport | Digital passport with stamps |
| `/stamps` | Stamps | Grid view of collected stamps |
| `/dashboard` | Dashboard | User stats, activity feed, quick actions |
| `/profile` | Profile | Edit profile, XP/level, logout |
| `/about` | About | Mission & values |
| `/contact` | Contact | Contact form |
| `/login` | Login | Sign in with email/password |
| `/register` | Register | Create account |
| `/quests` | Quests | Gamified quests with secret questline |
| `/itinerary` | Itinerary | Drag-and-drop day planner |
| `/memory-book` | Memory Book | Personal travel journal |
| `/emergency` | Emergency | Emergency contacts & safety tips |
| `/story` | Story | Narrative chapters from completed quests |

---

## Architecture

### Data Flow

- **Auth**: Supabase auth with local fallback (guest mode). Profiles stored in `profiles` table.
- **Persistence**: localStorage for guest users, Supabase PostgreSQL for authenticated users. Data syncs both ways local state persists independently.
- **State Management**: React Context (AuthContext, DataContext, ToastContext) — no external state library.
- **AI**: Google Gemini 2.0 Flash via REST API. Falls back to hand-written mock responses when API key is missing.

### Dark Mode

Class-based dark mode with a permanent warm ivory background (`#FAF9F5`). Dark mode only affects floating UI elements (cards, nav, panels, modals) — the canvas remains unchanged, inspired by Lokta paper.

### Quest to Story Pipeline

1. User marks a quest complete
2. `completeQuest()` updates local state + Supabase
3. `generateStoryChapter()` picks a narrative template (quest-specific or category fallback)
4. Optionally enriches via Gemini AI for a unique paragraph
5. Chapter appended to story timeline in chronological order
6. Visible on Quests page summary + `/story` page

---

## Database (Supabase)

14 tables with Row Level Security. Key tables:

- `profiles` — User profiles with XP/level/preferences
- `passport_stamps` — Collected heritage stamps (UNIQUE per user/site)
- `completed_quests` — Quest completions with timestamps
- `favorites` — Saved places
- `itinerary_items` — Day planner entries
- `memory_entries` — Travel journal
- `ai_conversations` / `ai_messages` — AI chat history
- `reviews` — Site reviews
- `user_achievements` — Unlocked badges

Run migrations:
```bash
# Apply via Supabase dashboard SQL editor, or:
# Use the Supabase CLI:
supabase migration up
```

---

## Future Roadmap

### Near-term

- **GPS-based visit verification** — Auto-detect when a user is at a heritage site and trigger quest completion / passport stamp collection without manual input
- **QR code scanning** — Place scannable QR codes at physical heritage site locations; scanning confirms the visit and awards XP + stamps
- **Mobile application** — Native mobile experience with offline mode, push notifications, and background GPS tracking
- **Dedicated database backend** — Migrate from the current prototype storage to a fully normalized production database with caching, replication, and real-time sync

### Longer-term vision

- **Expanded quest engine** — Dynamic quest generation, time-limited challenges, and peer-to-peer quests
- **Multi-language support** — Full feature of any languages translations
- **Community features** — Traveler forums, shared itineraries, and local guide connections
- **Admin dashboard** — Analytics for site popularity, user engagement, and tourism insights
- **Offline-first architecture** — Full offline capability with background sync when connectivity returns

> **Note:** This project is currently a prototype focused on demonstrating the product concept, user experience design, and technical architecture. It prioritizes solving the core problem helping travelers discover authentic Nepal — over being a fully productionized application.

---
