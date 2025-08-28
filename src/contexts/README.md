# Contexts

Purpose: Cross-cutting application state (e.g., authentication).

`AuthContext`

- Exposes `user`, `isAuthenticated`, `isLoading`, `login`, `logout`, `refresh`.
- Uses TanStack Query hooks from the generated API for profile, logout, and refresh.
- Includes a dev-only localStorage fallback for environments with strict cookies.

Usage

- Wraps app via `src/app/providers.tsx`; access with `const { user } = useAuth()`.
- Keep side effects (navigation, storage) inside context or dedicated hooks.

Guidelines

- Keep context surface small; prefer colocated component state when possible.
- Do not call context from Server Components; expose fetchers for server use instead.
