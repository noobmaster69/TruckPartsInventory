import { prisma } from '../db'
import { HttpError } from '../http'

export const MOVEMENT_TYPES = ['RECEIVE', 'SELL', 'ADJUST', 'RETURN'] as const
export type MovementType = (typeof MOVEMENT_TYPES)[number]

// Convert a movement type + magnitude into a signed change to quantityOnHand.
// RECEIVE/RETURN add stock, SELL removes it, ADJUST is taken as already signed.
export function signedDelta(type: MovementType, quantity: number): number {
  switch (type) {
    case 'RECEIVE':
    case 'RETURN':
      return Math.abs(quantity)
    case 'SELL':
      return -Math.abs(quantity)
    case 'ADJUST':
      return quantity
  }
}

export type RecordMovementInput = {
  partId: number
  type: MovementType
  quantity: number
  unitCost?: number | null
  reference?: string | null
  note?: string | null
  userId?: string | null
}

// The ONLY way stock quantity changes. Writes a StockMovement and recomputes
// Part.quantityOnHand atomically in one transaction (see CLAUDE.md golden rule).
export async function recordMovement(input: RecordMovementInput) {
  const delta = signedDelta(input.type, input.quantity)
  return prisma.$transaction(async (tx) => {
    const part = await tx.part.findUnique({ where: { id: input.partId } })
    if (!part) throw new HttpError(404, `Part ${input.partId} not found`)

    const newQty = part.quantityOnHand + delta
    if (newQty < 0) {
      throw new HttpError(
        400,
        `Insufficient stock for ${part.partNumber}: on hand ${part.quantityOnHand}, change ${delta}`,
      )
    }

    const movement = await tx.stockMovement.create({
      data: {
        partId: input.partId,
        type: input.type,
        quantity: delta,
        unitCost: input.unitCost ?? null,
        reference: input.reference ?? null,
        note: input.note ?? null,
        userId: input.userId ?? null,
      },
    })
    const updated = await tx.part.update({
      where: { id: input.partId },
      data: { quantityOnHand: newQty },
    })
    return { movement, part: updated }
  })
}

// Admin "recalculate" — trust the movement ledger and rewrite quantityOnHand.
export async function recalcQuantity(partId: number) {
  return prisma.$transaction(async (tx) => {
    const agg = await tx.stockMovement.aggregate({
      where: { partId },
      _sum: { quantity: true },
    })
    const qty = agg._sum.quantity ?? 0
    return tx.part.update({ where: { id: partId }, data: { quantityOnHand: qty } })
  })
}
