# Truck Parts Inventory

A local-first desktop web app to track truck parts inventory — stock levels,
part details, suppliers, locations, stock movements, low-stock alerts, and
reporting.

**Stack:** Node + Express + SQLite (Prisma) backend · React + Vite + Tailwind
frontend · TypeScript throughout.

See [`TruckPartsInventory-Plan.md`](./TruckPartsInventory-Plan.md) for the full
build plan and [`CLAUDE.md`](./CLAUDE.md) for project conventions.

## Prerequisites

- [Node.js](https://nodejs.org/) LTS (v20+; built with v22)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create the database and apply migrations
npm run db:migrate

# 3. (Optional) Load sample data
npm run db:seed

# 4. Run backend + frontend together
npm run dev
```

Then open the URL Vite prints (default <http://localhost:5173>). The Express API
runs on <http://localhost:3001> and Vite proxies `/api/*` to it.

## GitHub Pages

The frontend is configured to deploy to GitHub Pages from this repository.
The published site uses hash-based routing so deep links and refreshes work on
Pages.

Deployed site:

- <https://noobmaster69.github.io/TruckPartsInventory/>

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Run the Express API and the Vite dev server together |
| `npm run build` | Production build of the frontend |
| `npm run typecheck` | Type-check frontend and backend |
| `npm run db:migrate` | Create/apply a Prisma migration |
| `npm run db:seed` | Load sample data |
| `npm run db:studio` | Open Prisma Studio to inspect the database |
| `npm run db:generate` | Regenerate the Prisma client |

## Project layout

```
prisma/    Prisma schema, migrations, and seed script
server/    Express API (routes, services, Prisma client)
src/       React frontend (pages, components, api client)
data/      SQLite database file (git-ignored — back it up!)
```

## Backups

The entire database is the single file `data/inventory.db`. **Back it up
regularly** — losing it loses everything.
