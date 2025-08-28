# UI Primitives

Purpose: Reusable UI components built on Radix + Tailwind.

Structure

- One component per file (e.g., `button.tsx`, `dropdown-menu.tsx`).
- Co-locate variants and small helpers with the component.

Conventions

- Props are typed; keep stable, minimal APIs.
- Use Tailwind utilities; prefer `clsx`/`tailwind-merge` for conditional classes.
- Avoid app-specific state; make these components stateless/presentational.

Extend

- Copy an existing pattern and update props/types.
- Add stories/tests in the future alongside the component (e.g., `button.test.tsx`).
