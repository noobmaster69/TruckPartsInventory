import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../db'
import { asyncHandler } from '../http'
import { movementSchema } from '../validation'
import { recordMovement } from '../services/inventory'

const router = Router()

// GET /api/movements?partId=&limit=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const where: Prisma.StockMovementWhereInput = {}
    if (req.query.partId) where.partId = Number(req.query.partId)
    const limit = Math.min(Number(req.query.limit) || 100, 500)

    const movements = await prisma.stockMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { part: { select: { id: true, partNumber: true, name: true } } },
    })
    res.json(movements)
  }),
)

// POST /api/movements — receive/sell/adjust/return (updates quantity atomically)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = movementSchema.parse(req.body)
    const result = await recordMovement(data)
    res.status(201).json(result)
  }),
)

export default router
