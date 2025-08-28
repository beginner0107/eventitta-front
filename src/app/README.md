# App Directory

Purpose: Route definitions and layout composition using the Next.js App Router.

- Structure: route groups (e.g., `(public)`), nested `page.tsx`, and shared `layout.tsx`.
- Providers: `src/app/layout.tsx` includes `src/app/providers.tsx` (TanStack Query + `AuthProvider`).
- Client/Server: Use Server Components by default; add `'use client'` only when needed.
- Middleware: `src/middleware.ts` protects routes like `/dashboard`, `/me`, and redirects to `/auth/login` when unauthenticated.

Adding a page

- Create `src/app/<segment>/page.tsx` and export a component.
- Use generated hooks for data: `const { data } = useGetSomething();`.
- For protected pages, rely on middleware; inside components, check `useAuth()` state for UI.

Naming

- Folders lowercased; components PascalCase; keep pages minimal and delegate logic to components.
