import type { Category, Dashboard, Location, Movement, MovementType, Part, PartDetail, Supplier, SupplierPart, VehicleFitment } from './types'

const STORAGE_KEY = 'truck-parts-inventory-demo-v1'

type CategoryRecord = {
  id: number
  name: string
  parentId: number | null
  createdAt: string
  updatedAt: string
}

type LocationRecord = {
  id: number
  name: string
  description: string | null
}

type SupplierRecord = {
  id: number
  name: string
  contactName: string | null
  phone: string | null
  email: string | null
  address: string | null
  notes: string | null
}

type PartRecord = {
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
  createdAt: string
  updatedAt: string
}

type SupplierPartRecord = {
  id: number
  partId: number
  supplierId: number
  supplierSku: string | null
  cost: number
  leadTimeDays: number | null
  isPreferred: boolean
}

type FitmentRecord = {
  id: number
  partId: number
  make: string
  model: string | null
  yearFrom: number | null
  yearTo: number | null
  engine: string | null
  notes: string | null
}

type MovementRecord = {
  id: number
  partId: number
  type: MovementType
  quantity: number
  unitCost: number | null
  reference: string | null
  note: string | null
  createdAt: string
}

type DemoState = {
  nextIds: {
    category: number
    location: number
    supplier: number
    part: number
    supplierPart: number
    fitment: number
    movement: number
  }
  categories: CategoryRecord[]
  locations: LocationRecord[]
  suppliers: SupplierRecord[]
  parts: PartRecord[]
  supplierParts: SupplierPartRecord[]
  fitments: FitmentRecord[]
  movements: MovementRecord[]
}

type PartInput = {
  partNumber: string
  name: string
  description?: string | null
  categoryId?: number | null
  manufacturer?: string | null
  unitOfMeasure?: string | null
  costPrice?: number | null
  sellPrice?: number | null
  reorderPoint?: number | null
  reorderQuantity?: number | null
  locationId?: number | null
  barcode?: string | null
}

type PartUpdateInput = Partial<PartInput>

type SeedPart = {
  partNumber: string
  name: string
  category: string
  location: string
  manufacturer?: string
  unitOfMeasure?: string
  costPrice: number
  sellPrice: number
  reorderPoint: number
  reorderQuantity: number
  initialQty: number
  barcode?: string
}

const PARTS: SeedPart[] = [
  { partNumber: 'BRK-1042', name: 'Brake Pad Set (front)', category: 'Brakes', location: 'Aisle 1 / Bin A1', costPrice: 4500, sellPrice: 8999, reorderPoint: 4, reorderQuantity: 8, initialQty: 2 },
  { partNumber: 'BRK-ROT-19', name: 'Brake Rotor (front)', category: 'Brakes', location: 'Aisle 1 / Bin A2', costPrice: 6500, sellPrice: 12999, reorderPoint: 4, reorderQuantity: 6, initialQty: 3 },
  { partNumber: 'BRK-SHOE-7', name: 'Brake Shoe Set (rear)', category: 'Brakes', location: 'Aisle 1 / Bin A3', costPrice: 5200, sellPrice: 10999, reorderPoint: 4, reorderQuantity: 6, initialQty: 6 },
  { partNumber: 'FLT-OIL-22', name: 'Oil Filter', category: 'Filters', location: 'Aisle 2 / Bin B1', costPrice: 650, sellPrice: 1499, reorderPoint: 10, reorderQuantity: 24, initialQty: 36 },
  { partNumber: 'FLT-AIR-08', name: 'Air Filter', category: 'Filters', location: 'Aisle 2 / Bin B2', costPrice: 1800, sellPrice: 3999, reorderPoint: 6, reorderQuantity: 12, initialQty: 8 },
  { partNumber: 'FLT-FUEL-14', name: 'Fuel Filter', category: 'Filters', location: 'Aisle 2 / Bin B3', costPrice: 1400, sellPrice: 2999, reorderPoint: 8, reorderQuantity: 12, initialQty: 20 },
  { partNumber: 'FLT-CAB-05', name: 'Cabin Air Filter', category: 'Filters', location: 'Aisle 2 / Bin B4', costPrice: 900, sellPrice: 2199, reorderPoint: 6, reorderQuantity: 12, initialQty: 0 },
  { partNumber: 'BLT-SERP-3', name: 'Serpentine Belt', category: 'Engine', location: 'Aisle 3 / Bin C1', costPrice: 2200, sellPrice: 4999, reorderPoint: 3, reorderQuantity: 6, initialQty: 1 },
  { partNumber: 'BLT-VEE-2', name: 'V-Belt', category: 'Engine', location: 'Aisle 3 / Bin C2', costPrice: 1100, sellPrice: 2599, reorderPoint: 5, reorderQuantity: 10, initialQty: 9 },
  { partNumber: 'HOSE-RAD-UP', name: 'Radiator Hose (upper)', category: 'Engine', location: 'Aisle 3 / Bin C3', costPrice: 2400, sellPrice: 5499, reorderPoint: 3, reorderQuantity: 6, initialQty: 2 },
  { partNumber: 'LGT-LED-H7', name: 'LED Headlight H7', category: 'Electrical', location: 'Aisle 4 / Bin D1', costPrice: 1200, sellPrice: 2999, reorderPoint: 8, reorderQuantity: 16, initialQty: 14 },
  { partNumber: 'LGT-MARK-AMB', name: 'Marker Light (amber)', category: 'Electrical', location: 'Aisle 4 / Bin D2', costPrice: 300, sellPrice: 899, reorderPoint: 20, reorderQuantity: 50, initialQty: 48 },
  { partNumber: 'BAT-31-950', name: 'Group 31 Battery 950CCA', category: 'Electrical', location: 'Aisle 4 / Bin D3', costPrice: 11000, sellPrice: 19999, reorderPoint: 2, reorderQuantity: 4, initialQty: 5 },
  { partNumber: 'ALT-160A', name: 'Alternator 160A', category: 'Electrical', location: 'Aisle 4 / Bin D4', costPrice: 18000, sellPrice: 32999, reorderPoint: 2, reorderQuantity: 3, initialQty: 3 },
  { partNumber: 'TIR-295-75', name: 'Drive Tire 295/75R22.5', category: 'Tires', location: 'Tire Rack 1', costPrice: 28000, sellPrice: 45999, reorderPoint: 4, reorderQuantity: 8, initialQty: 4 },
  { partNumber: 'FLU-DEF-25', name: 'DEF Fluid 2.5 gal', category: 'Fluids', location: 'Aisle 5 / Bin E1', costPrice: 700, sellPrice: 1699, reorderPoint: 12, reorderQuantity: 24, initialQty: 30 },
  { partNumber: 'OIL-15W40-1G', name: 'Engine Oil 15W-40 (1 gal)', category: 'Fluids', location: 'Aisle 5 / Bin E2', costPrice: 1500, sellPrice: 3299, reorderPoint: 24, reorderQuantity: 48, initialQty: 60 },
  { partNumber: 'COOL-5050-1G', name: 'Coolant 50/50 (1 gal)', category: 'Fluids', location: 'Aisle 5 / Bin E3', costPrice: 1000, sellPrice: 2299, reorderPoint: 12, reorderQuantity: 24, initialQty: 18 },
  { partNumber: 'WPR-24', name: 'Wiper Blade 24"', category: 'Accessories', location: 'Front Counter', costPrice: 600, sellPrice: 1499, reorderPoint: 10, reorderQuantity: 20, initialQty: 25 },
  { partNumber: 'MIR-PWR-L', name: 'Power Mirror (left)', category: 'Body', location: 'Aisle 6 / Bin F1', costPrice: 9500, sellPrice: 18999, reorderPoint: 2, reorderQuantity: 3, initialQty: 1 },
]

const SUPPLIERS = [
  { name: 'FleetPro Parts', contactName: 'Dana Reyes', phone: '555-0142', email: 'sales@fleetpro.example', address: '1200 Industrial Pkwy' },
  { name: 'HeavyHaul Supply', contactName: 'Marcus Lee', phone: '555-0188', email: 'orders@heavyhaul.example', address: '88 Depot Rd' },
  { name: 'RoadKing Distributors', contactName: 'Priya Singh', phone: '555-0203', email: 'service@roadking.example', address: '4500 Commerce Blvd' },
]

const FITMENTS = [
  { partNumber: 'BRK-1042', make: 'Freightliner', model: 'Cascadia', yearFrom: 2016, yearTo: 2022, engine: 'DD15' },
  { partNumber: 'FLT-OIL-22', make: 'Freightliner', model: 'Cascadia', yearFrom: 2014, yearTo: 2024 },
  { partNumber: 'BAT-31-950', make: 'Peterbilt', model: '579', yearFrom: 2015, yearTo: 2023 },
]

const hasStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
const isDemoMode = import.meta.env.PROD && import.meta.env.BASE_URL !== '/'

function nowIso() {
  return new Date().toISOString()
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function createInitialState(): DemoState {
  const categories = [...new Set(PARTS.map((part) => part.category))].map((name, index) => ({
    id: index + 1,
    name,
    parentId: null,
    createdAt: daysAgo(30 - index),
    updatedAt: daysAgo(30 - index),
  }))

  const locations = [...new Set(PARTS.map((part) => part.location))].map((name, index) => ({
    id: index + 1,
    name,
    description: null,
  }))

  const suppliers = SUPPLIERS.map((supplier, index) => ({
    id: index + 1,
    ...supplier,
    notes: null,
  }))

  const categoryByName = new Map(categories.map((category) => [category.name, category.id]))
  const locationByName = new Map(locations.map((location) => [location.name, location.id]))
  const supplierByName = new Map(suppliers.map((supplier) => [supplier.name, supplier.id]))

  const parts: PartRecord[] = []
  const movements: MovementRecord[] = []
  let nextPartId = 1
  let nextMovementId = 1

  for (const [index, seed] of PARTS.entries()) {
    const createdAt = daysAgo(25 - index)
    const part: PartRecord = {
      id: nextPartId++,
      partNumber: seed.partNumber,
      name: seed.name,
      description: null,
      categoryId: categoryByName.get(seed.category) ?? null,
      locationId: locationByName.get(seed.location) ?? null,
      manufacturer: seed.manufacturer ?? null,
      unitOfMeasure: seed.unitOfMeasure ?? 'each',
      costPrice: seed.costPrice,
      sellPrice: seed.sellPrice,
      quantityOnHand: seed.initialQty,
      reorderPoint: seed.reorderPoint,
      reorderQuantity: seed.reorderQuantity,
      barcode: seed.barcode ?? null,
      createdAt,
      updatedAt: createdAt,
    }
    parts.push(part)

    if (seed.initialQty > 0) {
      movements.push({
        id: nextMovementId++,
        partId: part.id,
        type: 'RECEIVE',
        quantity: seed.initialQty,
        unitCost: seed.costPrice,
        reference: 'OPENING',
        note: 'Opening stock count',
        createdAt,
      })
    }
  }

  const partsByNumber = new Map(parts.map((part) => [part.partNumber, part]))
  const supplierParts: SupplierPartRecord[] = []
  let nextSupplierPartId = 1

  const link = (partNumber: string, supplierName: string, cost: number, options: { sku?: string; lead?: number; preferred?: boolean } = {}) => {
    const part = partsByNumber.get(partNumber)
    const supplierId = supplierByName.get(supplierName)
    if (!part || !supplierId) return
    supplierParts.push({
      id: nextSupplierPartId++,
      partId: part.id,
      supplierId,
      supplierSku: options.sku ?? null,
      cost,
      leadTimeDays: options.lead ?? null,
      isPreferred: options.preferred ?? false,
    })
  }

  link('BRK-1042', 'FleetPro Parts', 4500, { sku: 'FP-BP-1042', lead: 2, preferred: true })
  link('BRK-1042', 'HeavyHaul Supply', 4700, { sku: 'HH-1042', lead: 4 })
  link('FLT-OIL-22', 'FleetPro Parts', 650, { sku: 'FP-OF-22', lead: 1, preferred: true })
  link('FLT-OIL-22', 'RoadKing Distributors', 620, { sku: 'RK-OIL-22', lead: 5 })
  link('TIR-295-75', 'RoadKing Distributors', 28000, { sku: 'RK-DRV-29575', lead: 7, preferred: true })
  link('BAT-31-950', 'HeavyHaul Supply', 11000, { sku: 'HH-BAT31', lead: 3, preferred: true })

  const fitments: FitmentRecord[] = FITMENTS.map((fitment, index) => ({
    id: index + 1,
    partId: partsByNumber.get(fitment.partNumber)?.id ?? 0,
    make: fitment.make,
    model: fitment.model ?? null,
    yearFrom: fitment.yearFrom ?? null,
    yearTo: fitment.yearTo ?? null,
    engine: fitment.engine ?? null,
    notes: null,
  })).filter((fitment) => fitment.partId > 0)

  const recordSale = (partNumber: string, qty: number, reference: string, days = 3) => {
    const part = partsByNumber.get(partNumber)
    if (!part) return
    part.quantityOnHand -= qty
    part.updatedAt = daysAgo(days)
    movements.push({
      id: nextMovementId++,
      partId: part.id,
      type: 'SELL',
      quantity: -qty,
      unitCost: null,
      reference,
      note: null,
      createdAt: daysAgo(days),
    })
  }

  const recordReceive = (partNumber: string, qty: number, reference: string, days = 2) => {
    const part = partsByNumber.get(partNumber)
    if (!part) return
    part.quantityOnHand += qty
    part.updatedAt = daysAgo(days)
    movements.push({
      id: nextMovementId++,
      partId: part.id,
      type: 'RECEIVE',
      quantity: qty,
      unitCost: null,
      reference,
      note: null,
      createdAt: daysAgo(days),
    })
  }

  recordSale('FLT-OIL-22', 4, 'INV-1001')
  recordSale('LGT-LED-H7', 2, 'INV-1002')
  recordReceive('BLT-VEE-2', 3, 'PO-501')

  return {
    nextIds: {
      category: categories.length + 1,
      location: locations.length + 1,
      supplier: suppliers.length + 1,
      part: parts.length + 1,
      supplierPart: supplierParts.length + 1,
      fitment: fitments.length + 1,
      movement: movements.length + 1,
    },
    categories,
    locations,
    suppliers,
    parts,
    supplierParts,
    fitments,
    movements,
  }
}

function loadState(): DemoState {
  if (!hasStorage) return createInitialState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    return JSON.parse(raw) as DemoState
  } catch {
    return createInitialState()
  }
}

let state = loadState()

function persist() {
  if (!hasStorage) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function resetState() {
  state = createInitialState()
  persist()
}

function parseUrl(path: string) {
  return new URL(path, 'https://demo.local')
}

function segmentId(value: string) {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) throw new Error(`Invalid id: ${value}`)
  return id
}

function categoryView(category: CategoryRecord): Category {
  const parent = category.parentId ? state.categories.find((candidate) => candidate.id === category.parentId) : undefined
  return {
    id: category.id,
    name: category.name,
    parentId: category.parentId,
    parent: parent ? { id: parent.id, name: parent.name } : null,
    _count: { parts: state.parts.filter((part) => part.categoryId === category.id).length },
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }
}

function locationView(location: LocationRecord): Location {
  return {
    id: location.id,
    name: location.name,
    description: location.description,
    _count: { parts: state.parts.filter((part) => part.locationId === location.id).length },
  }
}

function supplierView(supplier: SupplierRecord): Supplier {
  return {
    id: supplier.id,
    name: supplier.name,
    contactName: supplier.contactName,
    phone: supplier.phone,
    email: supplier.email,
    address: supplier.address,
    notes: supplier.notes,
    _count: { parts: state.supplierParts.filter((link) => link.supplierId === supplier.id).length },
  }
}

function partView(part: PartRecord): Part {
  const category = part.categoryId ? state.categories.find((candidate) => candidate.id === part.categoryId) : undefined
  const location = part.locationId ? state.locations.find((candidate) => candidate.id === part.locationId) : undefined
  return {
    id: part.id,
    partNumber: part.partNumber,
    name: part.name,
    description: part.description,
    categoryId: part.categoryId,
    locationId: part.locationId,
    manufacturer: part.manufacturer,
    unitOfMeasure: part.unitOfMeasure,
    costPrice: part.costPrice,
    sellPrice: part.sellPrice,
    quantityOnHand: part.quantityOnHand,
    reorderPoint: part.reorderPoint,
    reorderQuantity: part.reorderQuantity,
    barcode: part.barcode,
    category: category ? categoryView(category) : null,
    location: location ? locationView(location) : null,
    createdAt: part.createdAt,
    updatedAt: part.updatedAt,
  }
}

function movementView(movement: MovementRecord): Movement {
  const part = state.parts.find((candidate) => candidate.id === movement.partId)
  return {
    id: movement.id,
    partId: movement.partId,
    type: movement.type,
    quantity: movement.quantity,
    unitCost: movement.unitCost,
    reference: movement.reference,
    note: movement.note,
    createdAt: movement.createdAt,
    part: part ? { id: part.id, partNumber: part.partNumber, name: part.name } : undefined,
  }
}

function partDetailView(part: PartRecord): PartDetail {
  const base = partView(part)
  const suppliers = state.supplierParts
    .filter((link) => link.partId === part.id)
    .map((link) => {
      const supplier = state.suppliers.find((candidate) => candidate.id === link.supplierId)
      return {
        id: link.id,
        supplierId: link.supplierId,
        supplierSku: link.supplierSku,
        cost: link.cost,
        leadTimeDays: link.leadTimeDays,
        isPreferred: link.isPreferred,
        supplier: supplier ? supplierView(supplier) : undefined,
      } satisfies SupplierPart
    })

  const fitments = state.fitments
    .filter((fitment) => fitment.partId === part.id)
    .map((fitment) => ({
      id: fitment.id,
      make: fitment.make,
      model: fitment.model,
      yearFrom: fitment.yearFrom,
      yearTo: fitment.yearTo,
      engine: fitment.engine,
      notes: fitment.notes,
    }) satisfies VehicleFitment)

  const movements = state.movements
    .filter((movement) => movement.partId === part.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(movementView)

  return {
    ...base,
    suppliers,
    fitments,
    movements,
  }
}

function dashboardView(): Dashboard {
  const parts = state.parts.map(partView)
  const lowStock = parts.filter((part) => part.quantityOnHand <= part.reorderPoint).sort((a, b) => a.quantityOnHand - a.reorderPoint - (b.quantityOnHand - b.reorderPoint))
  const recentMovements = state.movements
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10)
    .map(movementView)

  return {
    totalParts: parts.length,
    categoryCount: state.categories.length,
    supplierCount: state.suppliers.length,
    inventoryValueCents: parts.reduce((sum, part) => sum + part.quantityOnHand * part.costPrice, 0),
    retailValueCents: parts.reduce((sum, part) => sum + part.quantityOnHand * part.sellPrice, 0),
    lowStockCount: lowStock.length,
    outOfStockCount: parts.filter((part) => part.quantityOnHand <= 0).length,
    lowStockParts: lowStock,
    recentMovements,
  }
}

function recalcPartQuantity(partId: number) {
  const part = state.parts.find((candidate) => candidate.id === partId)
  if (!part) throw new Error(`Part ${partId} not found`)
  part.quantityOnHand = state.movements.filter((movement) => movement.partId === partId).reduce((sum, movement) => sum + movement.quantity, 0)
  part.updatedAt = nowIso()
  persist()
  return partView(part)
}

function signedDelta(type: MovementType, quantity: number) {
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

function applyMovement(input: { partId: number; type: MovementType; quantity: number; unitCost?: number | null; reference?: string | null; note?: string | null }) {
  const part = state.parts.find((candidate) => candidate.id === input.partId)
  if (!part) throw new Error(`Part ${input.partId} not found`)

  const delta = signedDelta(input.type, input.quantity)
  const nextQty = part.quantityOnHand + delta
  if (nextQty < 0) throw new Error(`Insufficient stock for ${part.partNumber}: on hand ${part.quantityOnHand}, change ${delta}`)

  const movement: MovementRecord = {
    id: state.nextIds.movement++,
    partId: input.partId,
    type: input.type,
    quantity: delta,
    unitCost: input.unitCost ?? null,
    reference: input.reference ?? null,
    note: input.note ?? null,
    createdAt: nowIso(),
  }
  state.movements.unshift(movement)
  part.quantityOnHand = nextQty
  part.updatedAt = movement.createdAt
  persist()
  return { movement: movementView(movement), part: partView(part) }
}

function createPart(input: PartInput) {
  const now = nowIso()
  const part: PartRecord = {
    id: state.nextIds.part++,
    partNumber: input.partNumber,
    name: input.name,
    description: input.description ?? null,
    categoryId: input.categoryId ?? null,
    locationId: input.locationId ?? null,
    manufacturer: input.manufacturer ?? null,
    unitOfMeasure: input.unitOfMeasure ?? 'each',
    costPrice: input.costPrice ?? 0,
    sellPrice: input.sellPrice ?? 0,
    quantityOnHand: 0,
    reorderPoint: input.reorderPoint ?? 0,
    reorderQuantity: input.reorderQuantity ?? 0,
    barcode: input.barcode ?? null,
    createdAt: now,
    updatedAt: now,
  }
  state.parts.push(part)
  persist()
  return partView(part)
}

function updatePart(partId: number, input: PartUpdateInput) {
  const part = state.parts.find((candidate) => candidate.id === partId)
  if (!part) throw new Error(`Part ${partId} not found`)
  if (input.partNumber != null) part.partNumber = input.partNumber
  if (input.name != null) part.name = input.name
  if (input.description !== undefined) part.description = input.description ?? null
  if (input.categoryId !== undefined) part.categoryId = input.categoryId ?? null
  if (input.locationId !== undefined) part.locationId = input.locationId ?? null
  if (input.manufacturer !== undefined) part.manufacturer = input.manufacturer ?? null
  if (input.unitOfMeasure != null) part.unitOfMeasure = input.unitOfMeasure
  if (input.costPrice != null) part.costPrice = input.costPrice
  if (input.sellPrice != null) part.sellPrice = input.sellPrice
  if (input.reorderPoint != null) part.reorderPoint = input.reorderPoint
  if (input.reorderQuantity != null) part.reorderQuantity = input.reorderQuantity
  if (input.barcode !== undefined) part.barcode = input.barcode ?? null
  part.updatedAt = nowIso()
  persist()
  return partView(part)
}

function deletePart(partId: number) {
  state.parts = state.parts.filter((part) => part.id !== partId)
  state.supplierParts = state.supplierParts.filter((link) => link.partId !== partId)
  state.fitments = state.fitments.filter((fitment) => fitment.partId !== partId)
  state.movements = state.movements.filter((movement) => movement.partId !== partId)
  persist()
}

function createCategory(input: { name: string; parentId?: number | null }) {
  const now = nowIso()
  const category: CategoryRecord = {
    id: state.nextIds.category++,
    name: input.name,
    parentId: input.parentId ?? null,
    createdAt: now,
    updatedAt: now,
  }
  state.categories.push(category)
  persist()
  return categoryView(category)
}

function updateCategory(categoryId: number, input: { name?: string; parentId?: number | null }) {
  const category = state.categories.find((candidate) => candidate.id === categoryId)
  if (!category) throw new Error(`Category ${categoryId} not found`)
  if (input.name != null) category.name = input.name
  if (input.parentId !== undefined) category.parentId = input.parentId ?? null
  category.updatedAt = nowIso()
  persist()
  return categoryView(category)
}

function deleteCategory(categoryId: number) {
  state.categories = state.categories.filter((category) => category.id !== categoryId)
  state.parts = state.parts.map((part) => (part.categoryId === categoryId ? { ...part, categoryId: null, updatedAt: nowIso() } : part))
  persist()
}

function createLocation(input: { name: string; description?: string | null }) {
  const location: LocationRecord = {
    id: state.nextIds.location++,
    name: input.name,
    description: input.description ?? null,
  }
  state.locations.push(location)
  persist()
  return locationView(location)
}

function updateLocation(locationId: number, input: { name?: string; description?: string | null }) {
  const location = state.locations.find((candidate) => candidate.id === locationId)
  if (!location) throw new Error(`Location ${locationId} not found`)
  if (input.name != null) location.name = input.name
  if (input.description !== undefined) location.description = input.description ?? null
  persist()
  return locationView(location)
}

function deleteLocation(locationId: number) {
  state.locations = state.locations.filter((location) => location.id !== locationId)
  state.parts = state.parts.map((part) => (part.locationId === locationId ? { ...part, locationId: null, updatedAt: nowIso() } : part))
  persist()
}

function createSupplier(input: { name: string; contactName?: string | null; phone?: string | null; email?: string | null; address?: string | null; notes?: string | null }) {
  const supplier: SupplierRecord = {
    id: state.nextIds.supplier++,
    name: input.name,
    contactName: input.contactName ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    address: input.address ?? null,
    notes: input.notes ?? null,
  }
  state.suppliers.push(supplier)
  persist()
  return supplierView(supplier)
}

function updateSupplier(supplierId: number, input: { name?: string; contactName?: string | null; phone?: string | null; email?: string | null; address?: string | null; notes?: string | null }) {
  const supplier = state.suppliers.find((candidate) => candidate.id === supplierId)
  if (!supplier) throw new Error(`Supplier ${supplierId} not found`)
  if (input.name != null) supplier.name = input.name
  if (input.contactName !== undefined) supplier.contactName = input.contactName ?? null
  if (input.phone !== undefined) supplier.phone = input.phone ?? null
  if (input.email !== undefined) supplier.email = input.email ?? null
  if (input.address !== undefined) supplier.address = input.address ?? null
  if (input.notes !== undefined) supplier.notes = input.notes ?? null
  persist()
  return supplierView(supplier)
}

function deleteSupplier(supplierId: number) {
  state.suppliers = state.suppliers.filter((supplier) => supplier.id !== supplierId)
  state.supplierParts = state.supplierParts.filter((link) => link.supplierId !== supplierId)
  persist()
}

function listParts(url: URL) {
  const search = url.searchParams.get('search')?.trim().toLowerCase() ?? ''
  const categoryId = url.searchParams.get('categoryId') ? Number(url.searchParams.get('categoryId')) : null
  const locationId = url.searchParams.get('locationId') ? Number(url.searchParams.get('locationId')) : null
  const lowStock = url.searchParams.get('lowStock') === 'true'
  const sort = url.searchParams.get('sort') ?? 'name'
  const dir = url.searchParams.get('dir') === 'desc' ? 'desc' : 'asc'

  const allowed = new Set(['partNumber', 'name', 'quantityOnHand', 'sellPrice', 'costPrice', 'reorderPoint', 'updatedAt'])
  const orderField = allowed.has(sort) ? sort : 'name'

  let parts = state.parts.map(partView)
  if (search) {
    parts = parts.filter((part) => [part.partNumber, part.name, part.manufacturer, part.barcode].some((field) => field?.toLowerCase().includes(search)))
  }
  if (categoryId) parts = parts.filter((part) => part.categoryId === categoryId)
  if (locationId) parts = parts.filter((part) => part.locationId === locationId)
  if (lowStock) parts = parts.filter((part) => part.quantityOnHand <= part.reorderPoint)

  parts.sort((a, b) => {
    const left = a[orderField as keyof Part]
    const right = b[orderField as keyof Part]
    if (typeof left === 'number' && typeof right === 'number') return dir === 'asc' ? left - right : right - left
    const compare = String(left ?? '').localeCompare(String(right ?? ''))
    return dir === 'asc' ? compare : -compare
  })

  return parts
}

function getMovements(url: URL) {
  const partId = url.searchParams.get('partId') ? Number(url.searchParams.get('partId')) : null
  const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 500)
  return state.movements
    .filter((movement) => (partId ? movement.partId === partId : true))
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map(movementView)
}

function listCategories() {
  return state.categories.slice().sort((a, b) => a.name.localeCompare(b.name)).map(categoryView)
}

function listLocations() {
  return state.locations.slice().sort((a, b) => a.name.localeCompare(b.name)).map(locationView)
}

function listSuppliers() {
  return state.suppliers.slice().sort((a, b) => a.name.localeCompare(b.name)).map(supplierView)
}

export function useDemoApi() {
  return isDemoMode
}

export async function demoRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = parseUrl(path)
  const parts = url.pathname.split('/').filter(Boolean)

  if (method === 'GET' && url.pathname === '/dashboard') return dashboardView() as T
  if (method === 'GET' && url.pathname === '/categories') return listCategories() as T
  if (method === 'GET' && url.pathname === '/locations') return listLocations() as T
  if (method === 'GET' && url.pathname === '/suppliers') return listSuppliers() as T
  if (method === 'GET' && url.pathname === '/parts') return listParts(url) as T
  if (method === 'GET' && url.pathname === '/movements') return getMovements(url) as T

  if (parts[0] === 'parts' && parts[1] && parts.length === 2 && method === 'GET') {
    const part = state.parts.find((candidate) => candidate.id === segmentId(parts[1]))
    if (!part) throw new Error(`Part ${parts[1]} not found`)
    return partDetailView(part) as T
  }

  if (parts[0] === 'categories' && method === 'POST') return createCategory(body as { name: string; parentId?: number | null }) as T
  if (parts[0] === 'locations' && method === 'POST') return createLocation(body as { name: string; description?: string | null }) as T
  if (parts[0] === 'suppliers' && method === 'POST') return createSupplier(body as { name: string; contactName?: string | null; phone?: string | null; email?: string | null; address?: string | null; notes?: string | null }) as T
  if (parts[0] === 'parts' && parts.length === 3 && parts[2] === 'recalc' && method === 'POST') {
    const part = recalcPartQuantity(segmentId(parts[1]))
    return part as T
  }

  if (parts[0] === 'parts' && parts.length === 1 && method === 'POST') return createPart(body as PartInput) as T
  if (parts[0] === 'movements' && method === 'POST') return applyMovement(body as { partId: number; type: MovementType; quantity: number; unitCost?: number | null; reference?: string | null; note?: string | null }) as T

  if (parts[0] === 'categories' && parts[1] && method === 'PUT') return updateCategory(segmentId(parts[1]), body as { name?: string; parentId?: number | null }) as T
  if (parts[0] === 'locations' && parts[1] && method === 'PUT') return updateLocation(segmentId(parts[1]), body as { name?: string; description?: string | null }) as T
  if (parts[0] === 'suppliers' && parts[1] && method === 'PUT') return updateSupplier(segmentId(parts[1]), body as { name?: string; contactName?: string | null; phone?: string | null; email?: string | null; address?: string | null; notes?: string | null }) as T
  if (parts[0] === 'parts' && parts[1] && method === 'PUT' && parts.length === 2) return updatePart(segmentId(parts[1]), body as PartUpdateInput) as T

  if (parts[0] === 'categories' && parts[1] && method === 'DELETE') {
    deleteCategory(segmentId(parts[1]))
    return undefined as T
  }
  if (parts[0] === 'locations' && parts[1] && method === 'DELETE') {
    deleteLocation(segmentId(parts[1]))
    return undefined as T
  }
  if (parts[0] === 'suppliers' && parts[1] && method === 'DELETE') {
    deleteSupplier(segmentId(parts[1]))
    return undefined as T
  }
  if (parts[0] === 'parts' && parts[1] && method === 'DELETE' && parts.length === 2) {
    deletePart(segmentId(parts[1]))
    return undefined as T
  }

  throw new Error(`Demo API does not handle ${method} ${path}`)
}

export function resetDemoApi() {
  resetState()
}