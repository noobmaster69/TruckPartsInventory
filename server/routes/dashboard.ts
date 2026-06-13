import { Router } from 'express'
import { prisma } from '../db'
import { asyncHandler } from '../http'

const router = Router()

// GET /api/dashboard — headline stats + low-stock list + recent activity
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [parts, totalParts, categoryCount, supplierCount, recentMovements] = await Promise.all([
      prisma.part.findMany({
        select: {
          id: true,
          partNumber: true,
          name: true,
          quantityOnHand: true,
          reorderPoint: true,
          reorderQuantity: true,
          costPrice: true,
          sellPrice: true,
          category: { select: { name: true } },
          location: { select: { name: true } },
        },
      }),
      prisma.part.count(),
      prisma.category.count(),
      prisma.supplier.count(),
      prisma.stockMovement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { part: { select: { id: true, partNumber: true, name: true } } },
      }),
    ])

    const inventoryValueCents = parts.reduce((sum, p) => sum + p.quantityOnHand * p.costPrice, 0)
    const retailValueCents = parts.reduce((sum, p) => sum + p.quantityOnHand * p.sellPrice, 0)
    const lowStock = parts
      .filter((p) => p.quantityOnHand <= p.reorderPoint)
      .sort((a, b) => a.quantityOnHand - a.reorderPoint - (b.quantityOnHand - b.reorderPoint))
    const outOfStock = parts.filter((p) => p.quantityOnHand <= 0).length

    res.json({
      totalParts,
      categoryCount,
      supplierCount,
      inventoryValueCents,
      retailValueCents,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock,
      lowStockParts: lowStock,
      recentMovements,
    })
  }),
)

export default router
