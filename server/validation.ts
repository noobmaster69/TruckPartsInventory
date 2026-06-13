import { z } from 'zod'
import { MOVEMENT_TYPES } from './services/inventory'

const optionalText = z.string().trim().max(1000).nullish()
const optionalInt = z.number().int().nullish()

export const partCreateSchema = z.object({
  partNumber: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(200),
  description: optionalText,
  categoryId: optionalInt,
  manufacturer: z.string().trim().max(160).nullish(),
  unitOfMeasure: z.string().trim().min(1).max(50).default('each'),
  costPrice: z.number().int().min(0).default(0), // cents
  sellPrice: z.number().int().min(0).default(0), // cents
  reorderPoint: z.number().int().min(0).default(0),
  reorderQuantity: z.number().int().min(0).default(0),
  locationId: optionalInt,
  barcode: z.string().trim().max(160).nullish(),
})

export const partUpdateSchema = partCreateSchema.partial()

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  parentId: optionalInt,
})

export const locationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: optionalText,
})

export const supplierSchema = z.object({
  name: z.string().trim().min(1).max(160),
  contactName: z.string().trim().max(160).nullish(),
  phone: z.string().trim().max(60).nullish(),
  email: z.union([z.string().trim().email().max(160), z.literal('')]).nullish(),
  address: z.string().trim().max(300).nullish(),
  notes: optionalText,
})

export const movementSchema = z
  .object({
    partId: z.number().int().positive(),
    type: z.enum(MOVEMENT_TYPES),
    quantity: z.number().int(),
    unitCost: optionalInt,
    reference: z.string().trim().max(160).nullish(),
    note: optionalText,
  })
  .refine((m) => m.quantity !== 0, { message: 'Quantity cannot be zero', path: ['quantity'] })
  .refine((m) => m.type === 'ADJUST' || m.quantity > 0, {
    message: 'Quantity must be a positive number',
    path: ['quantity'],
  })
