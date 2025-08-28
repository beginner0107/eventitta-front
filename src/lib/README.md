# Library

Purpose: Shared utilities and clients.

Key Modules

- `axios-instance.ts`: Axios instance with base URL `NEXT_PUBLIC_API_BASE_URL` and interceptors.
- `auth-storage.ts`: Dev-only localStorage fallback for auth state.
- `cookie-debug.ts`: Helpers for inspecting cookies in the browser.
- `utils.ts`: Generic helpers.

Guidelines

- Keep modules framework-agnostic and side-effect free where possible.
- Reuse in components/contexts via explicit imports.
- Do not hardcode secrets; use environment variables.
