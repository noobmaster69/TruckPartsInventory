import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../db'
import { asyncHandler, parseId } from '../http'
import { partCreateSchema, partUpdateSchema } from '../validation'
import { recalcQuantity } from '../services/inventory'

const router = Router()

const SORTABLE = new Set([
  'partNumber',
  'name',
  'quantityOnHand',
  'sellPrice',
  'costPrice',
  'reorderPoint',
  'updatedAt',
])

// GET /api/parts?search=&categoryId=&locationId=&lowStock=true&sort=name&dir=asc
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search, categoryId, locationId, lowStock, sort, dir } = req.query
    const where: Prisma.PartWhereInput = {}

    if (typeof search === 'string' && search.trim()) {
      const q = search.trim()
      where.OR = [
        { partNumber: { contains: q } },
        { name: { contains: q } },
        { manufacturer: { contains: q } },
        { barcode: { contains: q } },
      ]
    }
    if (categoryId) where.categoryId = Number(categoryId)
    if (locationId) where.locationId = Number(locationId)

    const orderField = typeof sort === 'string' && SORTABLE.has(sort) ? sort : 'name'
    const orderDir = dir === 'desc' ? 'desc' : 'asc'

    let parts = await prisma.part.findMany({
      where,
      include: { category: true, location: true },
      orderBy: { [orderField]: orderDir } as Prisma.PartOrderByWithRelationInput,
    })

    // quantityOnHand <= reorderPoint can't be expressed column-to-column in a
    // Prisma where, so filter low-stock in memory (fine for a single shop).
    if (lowStock === 'true') {
      parts = parts.filter((p) => p.quantityOnHand <= p.reorderPoint)
    }

    res.json(parts)
  }),
)

// GET /api/parts/:id — full detail with relations + recent movements
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        category: true,
        location: true,
        suppliers: { include: { supplier: true } },
        fitments: true,
        movements: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    })
    if (!part) return res.status(404).json({ error: 'Part not found' })
    res.json(part)
  }),
)

// POST /api/parts
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = partCreateSchema.parse(req.body)
    const part = await prisma.part.create({ data })
    res.status(201).json(part)
  }),
)

// PUT /api/parts/:id
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    const data = partUpdateSchema.parse(req.body)
    const part = await prisma.part.update({ where: { id }, data })
    res.json(part)
  }),
)

// DELETE /api/parts/:id (cascades to movements, supplier links, fitments)
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    await prisma.part.delete({ where: { id } })
    res.status(204).end()
  }),
)

// POST /api/parts/:id/recalc — rebuild quantityOnHand from the movement ledger
router.post(
  '/:id/recalc',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    const part = await recalcQuantity(id)
    res.json(part)
  }),
)

export default router
