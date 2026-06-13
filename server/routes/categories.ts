import { Router } from 'express'
import { prisma } from '../db'
import { asyncHandler, parseId } from '../http'
import { categorySchema } from '../validation'

const router = Router()

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { parent: { select: { id: true, name: true } }, _count: { select: { parts: true } } },
    })
    res.json(categories)
  }),
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = categorySchema.parse(req.body)
    const category = await prisma.category.create({ data })
    res.status(201).json(category)
  }),
)

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    const data = categorySchema.partial().parse(req.body)
    const category = await prisma.category.update({ where: { id }, data })
    res.json(category)
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    await prisma.category.delete({ where: { id } })
    res.status(204).end()
  }),
)

export default router
