import { existsSync } from 'node:fs'

// Load .env into process.env using Node's built-in loader (Node 20.12+).
// IMPORTANT: import this module *before* anything that reads process.env
// (e.g. the Prisma client), so DATABASE_URL is populated in time.
if (existsSync('.env')) {
  process.loadEnvFile('.env')
}
