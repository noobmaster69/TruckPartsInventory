# CLAUDE.md — Truck Parts Inventory

## What this project is
A local-first truck parts inventory app. Node + Express + SQLite (Prisma) on the
backend, React + Vite + Tailwind on the frontend. Single-user desktop use to
start; may grow into multi-user later.

See `TruckPartsInventory-Plan.md` for the full build plan, data model, and
phased roadmap. Section references below (§N) point into that document.

## Golden rules
- **Never mutate `Part.quantityOnHand` directly.** Always create a
  `StockMovement` and recompute quantity inside a DB transaction.
- Use TypeScript everywhere. No `any` unless justified with a comment.
- Validate all API input with Zod before it touches the DB.
- Keep business logic in `server/services/`, not in route handlers.
- Money is stored in **cents (integers)**, never floats.
- Every new feature ships with: the API route, the UI, and a seed/sample so it's demoable.

## Commands
- `npm run dev` — run backend + frontend together.
- `npm run db:migrate` — create/apply a Prisma migration.
- `npm run db:seed` — load sample data.
- `npm run db:studio` — open Prisma Studio to inspect data.
- `npm run build` — production build.

## Conventions
- API base path: `/api`.
- REST naming: plural nouns (`/api/parts`, `/api/suppliers`).
- React components: PascalCase files; hooks in `src/lib`.
- Show user-facing errors as toasts; log technical detail to console.
- Confirm before any destructive action (delete, bulk import overwrite).

## Definition of done for a feature
1. Schema/migration applied if needed.
2. API endpoint(s) with Zod validation + tests for the happy path and one error path.
3. UI wired up with loading + empty + error states.
4. Sample data updated so the feature is visible after `db:seed`.
5. Manual smoke test passes; commit with a descriptive message.

## When unsure
Ask before: changing the schema in a breaking way, adding a new dependency, or
introducing auth. Otherwise proceed and explain what you did.
