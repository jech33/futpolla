# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Futpolla** is a World Cup 2026 prediction pool application. Users authenticate via Google, predict match scores, and compete on a live leaderboard. Built with Next.js 16 (App Router), TypeScript, Firebase, TanStack Query, and Zustand.

## Development Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run commit    # Interactive conventional commits (czg)
```

**Note:** No test suite exists currently. Consider adding Jest + React Testing Library for new features.

## Tech Stack

- **Next.js 16.1.4** with App Router (Server Components by default)
- **React 19.2.3** + **TypeScript** (strict mode)
- **Firebase** (Authentication + Firestore)
- **TanStack React Query 5.90.20** (server state management)
- **Zustand 5.0.10** (auth state with localStorage persistence)
- **Tailwind CSS 4** + **shadcn/ui** (New York style)
- **Prettier** with Tailwind class sorting

## High-Level Architecture

### Two-Tier State Management

**Critical pattern:** State is split between two systems based on concern.

#### Zustand - Authentication State Only
File: [stores/useAuthStore.ts](stores/useAuthStore.ts)

- Manages `firebaseUser`, `isAuthenticated`, `isLoadingSession`
- Persisted to localStorage with key `user-storage`
- Listens to Firebase `onAuthStateChanged()` via `initializeSession()`
- **Do not** use for server data - use TanStack Query instead

#### TanStack Query - All Server/Firestore Data
Configuration: [components/providers/QueryProvider.tsx](components/providers/QueryProvider.tsx)

- Fixtures: 5min stale time, 30min cache time
- User profiles: 1hr stale time, 24hr cache time
- All query hooks live in [hooks/queries/](hooks/queries/)
- All Firestore service functions in [services/](services/)

**Why this split?** Auth state needs to persist across sessions and doesn't change frequently. Server data should be cached with smart invalidation strategies and doesn't need persistence.

### Firebase Architecture - Dual SDK Pattern

**Two separate Firebase SDK instances:**

1. **Client SDK** - [lib/firebase/config.ts](lib/firebase/config.ts)
   - Browser-side authentication and queries
   - Used in components and client-side hooks
   - Environment vars: `NEXT_PUBLIC_FIREBASE_*`

2. **Admin SDK** - [lib/firebase/admin.ts](lib/firebase/admin.ts)
   - Server-side operations (API routes, cron jobs)
   - Elevated permissions for batch writes and admin operations
   - Environment vars: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

**When to use each:**
- Client SDK: User authentication, reading user-specific data in components
- Admin SDK: Cron jobs, admin endpoints, operations requiring elevated privileges

### Firestore Data Structure

```
competitions/wc-2026/
  ├── matches/{matchId}      # Match fixtures (synced via cron)
  └── standings/{groupId}    # Group standings (synced via cron)

users/{uid}                  # User profiles (created on first login)

predictions/{userId}/{matchId}  # User predictions (planned, not fully implemented)
```

### Routing & Protection Pattern

**Route structure:**
- `app/` - Next.js App Router directory
- `app/(sharedLayout)/` - Route group with shared [Header](components/ui/Header.tsx) and [Footer](components/ui/Footer.tsx)
- `app/login/` - Public authentication page
- `app/api/cron/` - Scheduled job endpoint (secured with `CRON_SECRET`)

**Protected routes:**
Wrap pages with `<AuthGuard>` component from [components/auth/AuthGuard.tsx](components/auth/AuthGuard.tsx):

```tsx
<AuthGuard>
  <YourProtectedPage />
</AuthGuard>
```

The AuthGuard:
- Redirects unauthenticated users to `/login`
- Shows loading spinner during hydration
- Uses `NextHydrationWaiter` to prevent SSR/hydration mismatches with persisted Zustand state

### External Data Sync (Cron Job)

File: [app/api/cron/route.ts](app/api/cron/route.ts)

**Purpose:** Syncs match fixtures and standings from football-data.org API to Firestore.

**Trigger:** Vercel Cron Jobs or external scheduler (secured with bearer token or query param).

**Process:**
1. Fetches data from `football-data.org/v4/competitions/WC/matches` and `/standings`
2. Transforms API response to Firestore document format
3. Uses Firebase Admin SDK batch writes for atomicity
4. Updates `competitions/wc-2026/matches` and `competitions/wc-2026/standings` collections

**Authentication:** Validates `Authorization: Bearer <CRON_SECRET>` header or `?key=<CRON_SECRET>` query param.

## Key Development Patterns

### Import Paths
Always use the `@/` alias (configured in tsconfig.json):
```tsx
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'
```

### Component Patterns
- **Server Components by default** (Next.js App Router)
- Mark client components with `'use client'` directive
- Use shadcn/ui components for base UI primitives
- Use Lucide React for all icons

### Styling
- Tailwind utility classes for all styling
- Use `cn()` helper from [lib/utils.ts](lib/utils.ts) for conditional classes (combines clsx + tailwind-merge)
- Prettier automatically sorts Tailwind classes - don't manually organize them

### Data Fetching Pattern
1. Create service function in `services/` directory (uses Firebase client SDK)
2. Create TanStack Query hook in `hooks/queries/`
3. Configure appropriate `staleTime` and `gcTime` for the data type
4. Use the hook in components

Example:
```tsx
// services/fixturesServices.ts
export const getFixtures = async () => { /* Firestore query */ }

// hooks/queries/useFixtures.ts
export const useFixtures = () => {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: getFixtures,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Component
const { data: fixtures } = useFixtures()
```

### Authentication Flow
1. User clicks "Login with Google" on [app/login/page.tsx](app/login/page.tsx)
2. `loginWithGoogle()` from [services/authServices.ts](services/authServices.ts) opens Google OAuth popup
3. Firebase stores auth token
4. `useAuthStore.initializeSession()` listens to Firebase `onAuthStateChanged()` and updates Zustand state
5. `syncUserProfile()` creates user document in Firestore if first login
6. User redirected to home page
7. `<AuthGuard>` allows access to protected routes

## Code Style & Conventions

**Prettier configuration:**
- 2-space indentation
- Single quotes
- 100 character line width
- Trailing commas (ES5)

**Git commits:** Use Conventional Commits specification. Run `npm run commit` for interactive prompts.

Examples from this repo:
```
feat: create prediction stepper component
refactor: change zustand async to tanstack query
fix: resolve authentication bug
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

**Client-side (NEXT_PUBLIC_ prefix):**
- Firebase configuration (API key, auth domain, project ID, etc.)

**Server-side:**
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (Admin SDK)
- `CRON_SECRET` (API endpoint authentication)
- `FOOTBALL_DATA_API_KEY` (external API)

## Important Notes

- **Prediction saving:** Logic is stubbed in [components/ui/PredictionStepper.tsx](components/ui/PredictionStepper.tsx) but not fully implemented
- **Admin dashboard:** Mentioned in README but not yet built
- **Dark mode:** Supported via CSS custom properties in [app/globals.css](app/globals.css)
- **Hydration handling:** Use `NextHydrationWaiter` wrapper for components that read Zustand persisted state

## Critical Files Reference

When implementing features, refer to these architectural anchors:

- [stores/useAuthStore.ts](stores/useAuthStore.ts) - Auth state pattern with persistence
- [components/providers/QueryProvider.tsx](components/providers/QueryProvider.tsx) - TanStack Query configuration
- [components/auth/AuthGuard.tsx](components/auth/AuthGuard.tsx) - Route protection pattern
- [app/api/cron/route.ts](app/api/cron/route.ts) - Data sync and Admin SDK usage pattern
- [types/index.ts](types/index.ts) - Domain models (Fixture, User, Prediction, etc.)
- [services/authServices.ts](services/authServices.ts) - Authentication flow implementation
