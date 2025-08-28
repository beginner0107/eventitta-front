# Architecture Overview

This repository is a Next.js (App Router) + TypeScript frontend using React 19, TanStack Query, Axios, Tailwind, and Radix UI. API clients are generated from an OpenAPI spec via Orval.

## Routing & Composition

- App Router in `src/app` with route groups (e.g., `(public)`).
- `src/app/layout.tsx` wraps pages with `src/app/providers.tsx` for global state/providers.
- Client components opt-in via `'use client'`. Prefer Server Components unless interactivity is required.
- `src/middleware.ts` guards protected routes and redirects unauthenticated users.

## Data & API Layer

- OpenAPI spec: `docs/eventitta.json` → generated client: `src/api/eventitta.ts`.
- Orval config: `orval.config.cjs` (Axios + React Query hooks).
- HTTP client: `src/lib/axios-instance.ts` with base URL `NEXT_PUBLIC_API_BASE_URL` and response interceptors.
- Data fetching/caching via TanStack Query in `src/app/providers.tsx`.

## State & Auth

- `src/contexts/AuthContext.tsx` manages session state (profile, login/logout, refresh), integrates with generated API.
- Dev-only localStorage fallback supports cookie issues during development.

## UI & Styling

- Tailwind (see `tailwind.config.js`, `postcss.config.js`) and utility helpers.
- Radix UI primitives + custom components in `src/components/ui`.

## Conventions

- TypeScript throughout; 2-space indent, Prettier + ESLint enforced.
- Keep components focused; lift shared logic to `src/lib` or context.
- Do not edit `src/api/eventitta.ts` directly; regenerate via Orval.
