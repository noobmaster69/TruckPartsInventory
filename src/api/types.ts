// DTOs mirroring the JSON the API returns. Money fields are integer CENTS.

export type Category = {
  id: number
  name: string
  parentId: number | null
  parent?: { id: number; name: string } | null
  _count?: { parts: number }
  createdAt: string
  updatedAt: string
}

export type Location = {
  id: number
  name: string
  description: string | null
  _count?: { parts: number }
}

export type Supplier = {
  id: number
  name: string
  contactName: string | null
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
  _count?: { parts: number }
}

export type Part = {
  id: number
  partNumber: string
  name: string
  description: string | null
  categoryId: number | null
  locationId: number | null
  manufacturer: string | null
  unitOfMeasure: string
  costPrice: number
  sellPrice: number
  quantityOnHand: number
  reorderPoint: number
  reorderQuantity: number
  barcode: string | null
  category?: Category | null
  location?: Location | null
  createdAt: string
  updatedAt: string
}

export type MovementType = 'RECEIVE' | 'SELL' | 'ADJUST' | 'RETURN'

export type Movement = {
  id: number
  partId: number
  type: MovementType
  quantity: number
  unitCost: number | null
  reference: string | null
  note: string | null
  createdAt: string
  part?: { id: number; partNumber: string; name: string }
}

export type SupplierPart = {
  id: number
  supplierId: number
  supplierSku: string | null
  cost: number
  leadTimeDays: number | null
  isPreferred: boolean
  supplier?: Supplier
}

export type VehicleFitment = {
  id: number
  make: string
  model: string | null
  yearFrom: number | null
  yearTo: number | null
  engine: string | null
  notes: string | null
}

export type PartDetail = Part & {
  suppliers: SupplierPart[]
  fitments: VehicleFitment[]
  movements: Movement[]
}

export type Dashboard = {
  totalParts: number
  categoryCount: number
  supplierCount: number
  inventoryValueCents: number
  retailValueCents: number
  lowStockCount: number
  outOfStockCount: number
  lowStockParts: Part[]
  recentMovements: Movement[]
}
