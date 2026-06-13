import { Router } from 'express'
import { prisma } from '../db'
import { asyncHandler, parseId } from '../http'
import { supplierSchema } from '../validation'

const router = Router()

// Normalize an empty email string to null before persisting.
function clean<T extends { email?: string | null }>(data: T): T {
  if (data.email === '') data.email = null
  return data
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { parts: true } } },
    })
    res.json(suppliers)
  }),
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = clean(supplierSchema.parse(req.body))
    const supplier = await prisma.supplier.create({ data })
    res.status(201).json(supplier)
  }),
)

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    const data = clean(supplierSchema.partial().parse(req.body))
    const supplier = await prisma.supplier.update({ where: { id }, data })
    res.json(supplier)
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    await prisma.supplier.delete({ where: { id } })
    res.status(204).end()
  }),
)

export default router
