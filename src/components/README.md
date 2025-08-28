# Components

Purpose: Reusable UI and view-level building blocks.

- `ui/`: Low-level, reusable primitives (Radix + Tailwind).
- `layout/`: Shell components (e.g., headers, nav, footers).
- `home/`: Page-specific components for the home/marketing surface.

Guidelines

- Keep components small and composable; prefer props over globals.
- Public API via named exports; document complex props with TSDoc.
- Styling with Tailwind; avoid ad-hoc globals—co-locate styles.
- Data fetching belongs in pages/containers; pass data down via props.

Naming

- Files lowercased (e.g., `button.tsx`), components PascalCase, hooks in `src/lib` or alongside components.
