import './env'
import express from 'express'
import cors from 'cors'
import { prisma } from './db'
import { asyncHandler, errorMiddleware } from './http'
import partsRouter from './routes/parts'
import categoriesRouter from './routes/categories'
import locationsRouter from './routes/locations'
import suppliersRouter from './routes/suppliers'
import movementsRouter from './routes/movements'
import dashboardRouter from './routes/dashboard'

const app = express()
app.use(cors())
app.use(express.json())

// Health check — also verifies real DB connectivity.
app.get(
  '/api/health',
  asyncHandler(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, db: 'connected', time: new Date().toISOString() })
  }),
)

app.use('/api/parts', partsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/movements', movementsRouter)
app.use('/api/dashboard', dashboardRouter)

// JSON 404 for unknown API routes.
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use(errorMiddleware)

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
