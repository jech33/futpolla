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

### Hexagonal Architecture (Ports & Adapters)

Business logic and framework/infrastructure code are kept in separate layers so the core domain has zero dependency on Next.js, Firebase, or football-data.org.

```
domain/        Pure business models and rules. No imports from outside domain/.
  entities/      Fixture, GroupTable, Prediction, UserProfile, MatchStatus, UserRole
  rules/         calculatePredictionPoints() (scaffolded, not yet implemented), PREDICTION_CONSTRAINTS

ports/         Interfaces only - the contracts between layers.
  inbound/       Use-case contracts (e.g. GetFixturesUseCase, AuthenticateUserUseCase)
  outbound/      What the domain needs from the outside (e.g. FixtureRepository, AuthProvider)

application/   Use-case implementations. Orchestrate domain rules + outbound ports.
  *.usecase.ts   One factory function per inbound port, e.g. makeGetFixturesUseCase(repo)

adapters/
  outbound/
    shared/            Code used by more than one adapter - nothing else should import
                       from here except other files inside adapters/.
      errorHandler.ts    FirestoreError/ApiError classes + handlers
      firestorePaths.ts  Firestore collection/path builders - no SDK import, so it's
                         safe for both the client and admin adapters to use
    firebase/          Client SDK - config.ts (init), validators.ts (Zod schemas for
                       Firestore reads), plus the repository/provider implementations.
                       Everything here runs in the browser.
    firebase-admin/    Admin SDK - admin.ts (init, service-account credentials), plus the
                       repository implementation. Server-only - never bundled client-side.
    football-data/     football-data.org API adapter + validators.ts (Zod schemas, not
                       yet wired in - see Important Notes)

composition/   Wires concrete adapters into use-case instances (the only place that
               imports both a port and its adapter).
  client.ts      Client-SDK-backed use cases - imported by hooks/, app/login/, Header.tsx
  server.ts      Admin-SDK + football-data-backed use cases - imported ONLY by
                 app/api/cron/route.ts (keeps service-account credentials out of the
                 client bundle)
```

**`app/` and `components/` are the inbound adapter layer.** Next.js's file-based routing
requires `app/` to stay at the project root, so it is not physically nested under
`adapters/` - instead, pages/components/route handlers stay thin and call into
`composition/client` or `composition/server` rather than talking to Firebase or
`fetch()` directly.

**Data flow:** component/hook → `composition/{client,server}` → application use case →
outbound port (interface) → adapter (Firebase / football-data.org implementation).

**When adding a new piece of business logic:**
1. Model it in `domain/` if it's a rule or shape with zero framework dependency.
2. Define the contract in `ports/inbound/` (what a caller can do) and `ports/outbound/`
   (what the use case needs from the outside), if new.
3. Implement the orchestration in `application/`.
4. Implement any new outbound port in `adapters/outbound/`.
5. Wire it up in `composition/client.ts` or `composition/server.ts`.
6. Call it from a hook (`hooks/queries/` or `hooks/mutations/`) or directly from a
   Server Component / Route Handler.

### Directory Reference

Every top-level folder, what belongs in it, and what doesn't. If you're unsure where a
new file goes, find the closest match here.

| Folder | What goes here | What does NOT go here |
|---|---|---|
| `app/` | Next.js pages, layouts, route handlers (file-based routing - location is fixed by Next.js). Kept thin: calls `composition/client` or `composition/server`, never Firebase/`fetch()` directly. | Business logic, Firebase calls |
| `components/ui/` | Generic, app-agnostic design-system primitives (Avatar, Card, Table, DropdownMenu, Spinner, DataLoader). If you stripped out "Futpolla," these would still make sense in any project. Matches shadcn's own convention. | Anything that imports a domain type (`Fixture`, `GroupTable`, etc.) |
| `components/features/` | App-specific components that know about the domain (FixtureCard, FixturesList, GroupTable, PredictionStepper, StandingsList, Header, Footer, Countdown). | Generic, reusable primitives - put those in `ui/` |
| `components/auth/` | Auth-flow-specific components: `AuthGuard.tsx` (route protection), `NextHydrationWaiter.tsx`, `routes.ts` (`ROUTES`/`PUBLIC_ROUTES` - lives here because `AuthGuard` is its only consumer) | |
| `components/providers/` | React context providers (`QueryProvider.tsx`) | |
| `hooks/` | React hooks: `queries/` and `mutations/` (TanStack Query, one hook per use case) call `composition/client`; `useInitializeAuth.ts` subscribes to auth changes; `queryConfig.ts` (`QUERY_KEYS`/`QUERY_CONFIG` - lives here because hooks are its only consumer) | Firebase calls - hooks call use cases, not adapters |
| `stores/` | Zustand client-side UI state. Currently just `useAuthStore.ts` (auth session state, persisted to localStorage). | Server/Firestore data - that's TanStack Query's job |
| `lib/` | Small, genuinely framework-agnostic utilities used across *multiple* layers (UI **and** adapters): `utils.ts` (`cn()`, `specialCharsToSpace`), `logger.ts`, `dateFormatter.ts`, `appConfig.ts` (`APP_CONFIG` - used by UI **and** adapters, which is why it's here and not colocated with one consumer), `env.ts` (Zod env schema - currently unused, see Important Notes), `__fixtures__/` (sample JSON payloads, not currently wired into any test). If a helper only has one consumer, it belongs next to that consumer, not here (see `queryConfig.ts`, `components/auth/routes.ts`). | Firebase/API-specific code - that belongs under `adapters/outbound/` |
| `domain/` | Pure business models (`entities/`) and rules (`rules/`). Zero imports from outside `domain/` - no Next.js, no Firebase, no Zod-schema-for-Firestore-shapes (that's a validator, an adapter concern). | Anything that imports React, Firebase, or Next.js |
| `ports/` | TypeScript interfaces only, no implementations. `inbound/` = use-case contracts, `outbound/` = what a use case needs from the outside world. | Any executable logic |
| `application/` | One factory function per inbound port, orchestrating `domain/` rules + `outbound/` ports. Framework-agnostic - could run in a CLI or a test with fake adapters, no Next.js/Firebase needed. | Firebase calls, React hooks, Next.js imports |
| `adapters/outbound/` | Firebase/football-data.org-specific code, split by SDK/API so the client/server boundary is visible at a glance (see the tree above). | Anything importable from more than one runtime context without care - `firebase-admin/` must never end up in a client bundle |
| `composition/` | The only place that imports both a port and its concrete adapter. `client.ts` (browser-safe) vs `server.ts` (Admin SDK, server-only). | Business logic - this file only wires things together |

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
- Hooks call use cases from [composition/client.ts](composition/client.ts), which wire
  application use cases ([application/](application/)) to Firestore adapters
  ([adapters/outbound/firebase/](adapters/outbound/firebase/))

**Why this split?** Auth state needs to persist across sessions and doesn't change frequently. Server data should be cached with smart invalidation strategies and doesn't need persistence.

### Firebase Architecture - Dual SDK Pattern

**Two separate Firebase SDK instances:**

1. **Client SDK** - [adapters/outbound/firebase/config.ts](adapters/outbound/firebase/config.ts)
   - Browser-side authentication and queries
   - Only imported by files in `adapters/outbound/firebase/` - never import this directly
     from a component or hook, go through `composition/client.ts` instead
   - Environment vars: `NEXT_PUBLIC_FIREBASE_*`

2. **Admin SDK** - [adapters/outbound/firebase-admin/admin.ts](adapters/outbound/firebase-admin/admin.ts)
   - Server-side operations (API routes, cron jobs)
   - Elevated permissions for batch writes and admin operations
   - Only imported by files in `adapters/outbound/firebase-admin/`, wired through
     `composition/server.ts` - this keeps service-account credentials out of anything
     that could end up in the client bundle
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
- `app/(sharedLayout)/` - Route group with shared [Header](components/features/Header.tsx) and [Footer](components/features/Footer.tsx)
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
1. Define/reuse the outbound port in `ports/outbound/` (e.g. `FixtureRepository`)
2. Implement it as an adapter in `adapters/outbound/firebase/` (uses Firebase client SDK)
3. Define/reuse the inbound port in `ports/inbound/` and implement the use case as a
   factory function in `application/`
4. Wire the use case in `composition/client.ts`
5. Create a TanStack Query hook in `hooks/queries/` that calls `useCase.execute()`
6. Configure appropriate `staleTime` and `gcTime` for the data type
7. Use the hook in components

Example:
```tsx
// ports/outbound/FixtureRepository.ts
export interface FixtureRepository {
  getAll(): Promise<Fixture[]>
}

// adapters/outbound/firebase/firestoreFixtureRepository.ts
export function makeFirestoreFixtureRepository(): FixtureRepository {
  return { getAll: async () => { /* Firestore query */ } }
}

// application/getFixtures.usecase.ts
export function makeGetFixturesUseCase(repo: FixtureRepository): GetFixturesUseCase {
  return { execute: () => repo.getAll() }
}

// composition/client.ts
export const getFixturesUseCase = makeGetFixturesUseCase(makeFirestoreFixtureRepository())

// hooks/queries/useFixtures.ts
export const useFixtures = () => {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: () => getFixturesUseCase.execute(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Component
const { data: fixtures } = useFixtures()
```

### Authentication Flow
1. User clicks "Login with Google" on [app/login/page.tsx](app/login/page.tsx)
2. `authenticateUserUseCase.execute()` (from [composition/client.ts](composition/client.ts))
   calls the `AuthProvider` port, implemented by
   [adapters/outbound/firebase/firebaseAuthProvider.ts](adapters/outbound/firebase/firebaseAuthProvider.ts),
   which opens the Google OAuth popup, then syncs the user via the `UserRepository` port
3. Firebase stores auth token
4. `useInitializeAuth` subscribes to `authProvider.onAuthStateChanged()` and updates
   Zustand state (`useAuthStore`) on every auth change
5. The same `onAuthStateChanged` handler also syncs the user profile via
   `useSyncUserProfile` (a pre-existing double-sync with step 2 - not a bug introduced
   by this architecture, kept as-is)
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

- **Prediction saving:** Logic is stubbed in [components/features/PredictionStepper.tsx](components/features/PredictionStepper.tsx) but not fully implemented. There is no save/submit handler yet.
- **Scoring rule:** [domain/rules/scoring.ts](domain/rules/scoring.ts)'s `calculatePredictionPoints()` is scaffolded (typed signature, throws "not implemented") - the actual point scheme (exact score vs. correct outcome, etc.) has not been decided yet.
- **`lib/env.ts` is currently dead code:** it defines a Zod-validated `env` object but nothing imports it - [adapters/outbound/firebase/config.ts](adapters/outbound/firebase/config.ts) and [adapters/outbound/firebase-admin/admin.ts](adapters/outbound/firebase-admin/admin.ts) read `process.env.*` directly instead. Don't assume env vars are validated at startup; if you need that guarantee, wire `lib/env.ts` in.
- **`adapters/outbound/football-data/validators.ts`** (Zod schemas for football-data.org responses) is also currently unused - the football-data adapter uses untyped `any` and doesn't validate the external response.
- **Admin dashboard:** Mentioned in README but not yet built
- **Dark mode:** Supported via CSS custom properties in [app/globals.css](app/globals.css)
- **Hydration handling:** Use `NextHydrationWaiter` wrapper for components that read Zustand persisted state

## Critical Files Reference

When implementing features, refer to these architectural anchors:

- [stores/useAuthStore.ts](stores/useAuthStore.ts) - Auth state pattern with persistence
- [components/providers/QueryProvider.tsx](components/providers/QueryProvider.tsx) - TanStack Query configuration
- [components/auth/AuthGuard.tsx](components/auth/AuthGuard.tsx) - Route protection pattern
- [app/api/cron/route.ts](app/api/cron/route.ts) - Thin inbound adapter delegating to `syncTournamentDataUseCase`
- [domain/entities/index.ts](domain/entities/index.ts) - Domain models (Fixture, UserProfile, Prediction, etc.)
- [domain/rules/scoring.ts](domain/rules/scoring.ts) - Scoring rule scaffold
- [ports/outbound/AuthProvider.ts](ports/outbound/AuthProvider.ts) - Auth port contract and `AuthUser` type
- [composition/client.ts](composition/client.ts) - Client-side use-case wiring (start here to trace any data flow)
- [composition/server.ts](composition/server.ts) - Server-side (Admin SDK + football-data.org) use-case wiring
- [adapters/outbound/firebase-admin/firestoreTournamentDataRepository.ts](adapters/outbound/firebase-admin/firestoreTournamentDataRepository.ts) - Admin SDK batch-write pattern
- [components/features/FixtureCard.tsx](components/features/FixtureCard.tsx) - Example of an app-specific component composed from `components/ui/` primitives
- [hooks/queryConfig.ts](hooks/queryConfig.ts) - `QUERY_KEYS`/`QUERY_CONFIG` used by every hook in `hooks/queries/`
