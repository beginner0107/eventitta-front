# API Client (Orval)

- Spec source: `docs/eventitta.json` (OpenAPI).
- Generation: `npm run orval` or `npm run orval:watch`.
- Output: `src/api/eventitta.ts` (Axios + TanStack Query hooks).

Usage

- Queries: `const { data } = useGetMyProfile();`
- Mutations: `const { mutate } = useLogout();`
- Direct calls (rare): use exported functions that call `axiosInstance`.

Configuration

- HTTP client: `src/lib/axios-instance.ts` (base URL, credentials, interceptors).
- Update the spec when backend changes, regenerate, and commit the result.

Notes

- Do not edit `src/api/eventitta.ts` manually; regenerate instead.
- Prefer hooks for caching and retries; configure query options in `src/app/providers.tsx`.
