# Truck Parts Inventory App — Claude Code Build Plan

A complete, step-by-step plan for using **Claude Code** to build a truck parts
inventory management application from scratch. This document is written so you
can drop it into your project root, point Claude Code at it, and work through
the phases one at a time.

---

## 1. Project Overview

**Goal:** A desktop/web application to track truck parts inventory — stock
levels, part details, suppliers, locations, purchase/sale movements, low-stock
alerts, and reporting.

**Primary users:** Shop owner / parts counter staff / mechanics.

**Core problems it solves:**
- Knowing what parts are in stock and where they are.
- Avoiding running out of fast-moving parts.
- Tracking which supplier sells which part and at what cost.
- Logging parts in (received) and out (sold/used on a job).
- Quick search by part number, name, or vehicle fitment.

---

## 2. Recommended Tech Stack

Pick **one** track. Track A is simplest to run on a single Windows PC (your
`C:\Users\nike2` environment). Track B is better if you want multi-user/web.

### Track A — Local desktop web app (recommended to start)
| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | Node.js (LTS) | Single install, runs on Windows |
| Backend | Express | Minimal REST API |
| Database | SQLite (better-sqlite3) | Zero-config single file DB, no server |
| Frontend | React + Vite + Tailwind | Fast, modern UI |
| ORM | Prisma | Type-safe queries, easy migrations |
| Packaging (optional) | Electron | Ship as a `.exe` later |

### Track B — Multi-user web app
Same as A but swap SQLite → **PostgreSQL**, add auth (Clerk/Auth.js), deploy to
a host (Railway/Render/Fly).

> The rest of this plan assumes **Track A**. Differences for B are noted inline.

---

## 3. Data Model

Design the schema first — everything else follows from it.

### Entities

**Part**
- `id` (PK)
- `partNumber` (unique, indexed)
- `name`
- `description`
- `category` (FK → Category)
- `manufacturer`
- `unitOfMeasure` (each, box, set, liter…)
- `costPrice`
- `sellPrice`
- `quantityOnHand` (derived/maintained)
- `reorderPoint` (low-stock threshold)
- `reorderQuantity`
- `locationId` (FK → Location)
- `barcode` (optional)
- `createdAt`, `updatedAt`

**Category** — `id`, `name`, `parentId` (self-ref for sub-categories)

**Supplier** — `id`, `name`, `contactName`, `phone`, `email`, `address`, `notes`

**Location** — `id`, `name` (e.g. "Aisle 3 / Bin B2"), `description`

**SupplierPart** (many-to-many Part↔Supplier) — `partId`, `supplierId`,
`supplierSku`, `cost`, `leadTimeDays`, `isPreferred`

**StockMovement** (the audit log — never edit Part qty directly)
- `id`, `partId`, `type` (`RECEIVE` | `SELL` | `ADJUST` | `RETURN`)
- `quantity` (+/-), `unitCost`, `reference` (invoice/job #), `note`
- `userId`, `createdAt`

**VehicleFitment** (optional but valuable for trucks)
- `id`, `partId`, `make`, `model`, `yearFrom`, `yearTo`, `engine`, `notes`

### Key rule
`quantityOnHand` is recalculated from the sum of `StockMovement.quantity`.
Store it on `Part` for speed, but the movements are the source of truth.

---

## 4. Application Features (by priority)

### MVP (build first)
1. CRUD for Parts.
2. CRUD for Categories, Suppliers, Locations.
3. Receive stock (creates a `RECEIVE` movement, increments qty).
4. Sell/issue stock (creates a `SELL` movement, decrements qty).
5. Search & filter parts (by part number, name, category, location).
6. Low-stock dashboard (parts where `quantityOnHand <= reorderPoint`).

### Phase 2
7. Stock adjustment with reason (damaged, count correction).
8. Supplier-part linking and "best price" view.
9. Vehicle fitment lookup ("what fits a 2018 Freightliner Cascadia").
10. Movement history per part (audit trail).
11. CSV import/export.

### Phase 3
12. Barcode scanning (USB scanner acts as keyboard → search field).
13. Reports: inventory valuation, slow movers, reorder list (printable/PDF).
14. Basic auth + roles (if going multi-user).
15. Electron packaging into a Windows installer.

---

## 5. Phased Build Plan for Claude Code

Work through these in order. Each phase is a self-contained prompt session.
**Commit to git after every phase.**

### Phase 0 — Scaffold
- Initialize repo, Node project, Vite React app, Tailwind, Prisma + SQLite.
- Set up folder structure (see §6).
- Add `.gitignore`, `README.md`, npm scripts (`dev`, `build`, `db:migrate`).
- **Done when:** `npm run dev` serves a blank styled page and the DB file is created.

### Phase 1 — Database & API
- Write the Prisma schema from §3.
- Run first migration.
- Build Express REST endpoints for Parts (GET list, GET one, POST, PUT, DELETE).
- Seed the DB with ~20 sample truck parts.
- **Done when:** you can hit `/api/parts` and get JSON back.

### Phase 2 — Parts UI
- Parts list page (table: part #, name, qty, location, sell price; sortable).
- Search bar + category/location filters.
- Add/Edit part form (modal or page) with validation.
- Delete with confirmation.
- **Done when:** full CRUD works in the browser.

### Phase 3 — Stock Movements
- "Receive" and "Sell" actions on each part.
- Movement is logged; `quantityOnHand` updates atomically (DB transaction).
- Movement history view per part.
- **Done when:** receiving/selling correctly changes quantities and the log is accurate.

### Phase 4 — Dashboard & Supporting Entities
- Dashboard: total parts, total inventory value, low-stock count, recent movements.
- Low-stock list with one-click "add to reorder list".
- CRUD pages for Categories, Suppliers, Locations.
- **Done when:** dashboard reflects live data.

### Phase 5 — Suppliers, Fitment, Import/Export
- SupplierPart linking UI; show cheapest supplier per part.
- Vehicle fitment table + lookup page.
- CSV import (map columns → fields, validate, preview, commit).
- CSV/Excel export of current inventory.
- **Done when:** you can bulk-load your real parts list.

### Phase 6 — Reports & Polish
- Reorder report, valuation report, slow-mover report → printable / PDF.
- Empty states, loading states, error toasts.
- Keyboard-first counter workflow (scan → result).
- **Done when:** it's pleasant to use daily.

### Phase 7 (optional) — Package & Harden
- Electron wrapper → Windows `.exe` installer.
- OR deploy Track B to the web with auth + Postgres.
- Automated backups of the SQLite file.

---

## 6. Suggested Folder Structure

```
TruckPartsInventory/
├─ prisma/
│  ├─ schema.prisma
│  ├─ seed.ts
│  └─ migrations/
├─ server/
│  ├─ index.ts            # Express bootstrap
│  ├─ db.ts               # Prisma client
│  ├─ routes/
│  │  ├─ parts.ts
│  │  ├─ movements.ts
│  │  ├─ suppliers.ts
│  │  ├─ categories.ts
│  │  └─ reports.ts
│  └─ services/
│     └─ inventory.ts     # qty math, transactions
├─ src/                   # React frontend
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ api/                # fetch wrappers
│  ├─ components/         # Table, Modal, Form fields…
│  ├─ pages/
│  │  ├─ Dashboard.tsx
│  │  ├─ Parts.tsx
│  │  ├─ PartDetail.tsx
│  │  ├─ Suppliers.tsx
│  │  └─ Reports.tsx
│  └─ lib/
├─ data/
│  └─ inventory.db        # SQLite (gitignored)
├─ .env
├─ .gitignore
├─ package.json
├─ README.md
└─ CLAUDE.md              # the skill file below
```

---

## 7. CLAUDE.md — Skill File for Claude Code

Save the block below as **`CLAUDE.md`** in your project root. Claude Code reads
it automatically and treats it as standing instructions for the project.

````markdown
# CLAUDE.md — Truck Parts Inventory

## What this project is
A local-first truck parts inventory app. Node + Express + SQLite (Prisma) on the
backend, React + Vite + Tailwind on the frontend. Single-user desktop use to
start; may grow into multi-user later.

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
````

---

## 8. How to Drive Claude Code Through This

Open Claude Code in the project directory and feed it prompts like:

1. *"Read `CLAUDE.md` and `TruckPartsInventory-Plan.md`. Do Phase 0: scaffold
   the project exactly per §6. Stop and show me the file tree."*
2. *"Phase 1: implement the Prisma schema from §3, run the migration, build the
   Parts API, and seed 20 sample truck parts. Show me a sample API response."*
3. *"Phase 2: build the Parts list and add/edit form per the plan."*
4. …continue phase by phase.

Tips:
- Do **one phase per session** so context stays focused.
- After each phase: `git add -A && git commit -m "Phase N: ..."`.
- If Claude drifts from the plan, paste the relevant section back in.
- Ask it to run the app and report errors before you do.

---

## 9. Sample Seed Data (truck parts)

Use these to verify the app early:

| Part # | Name | Category | Reorder Pt | Cost | Sell |
|--------|------|----------|-----------|------|------|
| BRK-1042 | Brake Pad Set (front) | Brakes | 4 | 45.00 | 89.99 |
| FLT-OIL-22 | Oil Filter | Filters | 10 | 6.50 | 14.99 |
| FLT-AIR-08 | Air Filter | Filters | 6 | 18.00 | 39.99 |
| BLT-SERP-3 | Serpentine Belt | Engine | 3 | 22.00 | 49.99 |
| LGT-LED-H7 | LED Headlight H7 | Electrical | 8 | 12.00 | 29.99 |
| TIR-295-75 | Drive Tire 295/75R22.5 | Tires | 4 | 280.00 | 459.99 |
| BAT-31-950 | Group 31 Battery 950CCA | Electrical | 2 | 110.00 | 199.99 |
| FLU-DEF-25 | DEF Fluid 2.5 gal | Fluids | 12 | 7.00 | 16.99 |

---

## 10. Risks & Gotchas

- **Quantity drift:** if movements and `quantityOnHand` disagree, trust the
  movement sum. Add a "recalculate" admin button.
- **Concurrent edits:** SQLite is single-writer; wrap stock changes in
  transactions. Fine for one user; revisit for Track B.
- **Backups:** the whole DB is one file (`data/inventory.db`). Schedule a daily
  copy. Losing it loses everything.
- **CSV import quality:** real-world parts lists are messy. Always preview and
  validate before committing an import.
- **Scope creep:** ship the MVP (§4) before fitment/reports/barcodes.

---

*End of plan.*
