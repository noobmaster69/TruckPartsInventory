import { Router } from 'express'
import { prisma } from '../db'
import { asyncHandler, parseId } from '../http'
import { locationSchema } from '../validation'

const router = Router()

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { parts: true } } },
    })
    res.json(locations)
  }),
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = locationSchema.parse(req.body)
    const location = await prisma.location.create({ data })
    res.status(201).json(location)
  }),
)

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    const data = locationSchema.partial().parse(req.body)
    const location = await prisma.location.update({ where: { id }, data })
    res.json(location)
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = parseId(req.params.id)
    await prisma.location.delete({ where: { id } })
    res.status(204).end()
  }),
)

export default router
