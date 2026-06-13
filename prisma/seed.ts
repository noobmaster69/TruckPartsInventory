import '../server/env'
import type { Supplier } from '@prisma/client'
import { prisma } from '../server/db'

// All money values are in CENTS. See CLAUDE.md.
// Reseeding wipes and rebuilds sample data, so `npm run db:seed` is repeatable.

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

async function main() {
  // Wipe in FK-safe order.
  await prisma.stockMovement.deleteMany()
  await prisma.vehicleFitment.deleteMany()
  await prisma.supplierPart.deleteMany()
  await prisma.part.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.location.deleteMany()
  await prisma.category.deleteMany()

  // Categories & locations (derived from the parts list).
  const categoryNames = [...new Set(PARTS.map((p) => p.category))]
  const locationNames = [...new Set(PARTS.map((p) => p.location))]

  const categories = new Map<string, number>()
  for (const name of categoryNames) {
    const c = await prisma.category.create({ data: { name } })
    categories.set(name, c.id)
  }

  const locations = new Map<string, number>()
  for (const name of locationNames) {
    const l = await prisma.location.create({ data: { name } })
    locations.set(name, l.id)
  }

  const suppliers: Supplier[] = []
  for (const s of SUPPLIERS) {
    suppliers.push(await prisma.supplier.create({ data: s }))
  }

  // Parts + an initial RECEIVE movement so quantityOnHand matches the ledger.
  const partsByNumber = new Map<string, number>()
  for (const p of PARTS) {
    const part = await prisma.part.create({
      data: {
        partNumber: p.partNumber,
        name: p.name,
        category: { connect: { id: categories.get(p.category)! } },
        location: { connect: { id: locations.get(p.location)! } },
        manufacturer: p.manufacturer ?? null,
        unitOfMeasure: p.unitOfMeasure ?? 'each',
        costPrice: p.costPrice,
        sellPrice: p.sellPrice,
        reorderPoint: p.reorderPoint,
        reorderQuantity: p.reorderQuantity,
        barcode: p.barcode ?? null,
        quantityOnHand: p.initialQty,
      },
    })
    partsByNumber.set(p.partNumber, part.id)

    if (p.initialQty > 0) {
      await prisma.stockMovement.create({
        data: {
          partId: part.id,
          type: 'RECEIVE',
          quantity: p.initialQty,
          unitCost: p.costPrice,
          reference: 'OPENING',
          note: 'Opening stock count',
        },
      })
    }
  }

  // A few supplier links (with a preferred supplier per part).
  const link = (partNumber: string, supplierIdx: number, cost: number, opts: { sku?: string; lead?: number; preferred?: boolean } = {}) =>
    prisma.supplierPart.create({
      data: {
        partId: partsByNumber.get(partNumber)!,
        supplierId: suppliers[supplierIdx].id,
        supplierSku: opts.sku ?? null,
        cost,
        leadTimeDays: opts.lead ?? null,
        isPreferred: opts.preferred ?? false,
      },
    })

  await link('BRK-1042', 0, 4500, { sku: 'FP-BP-1042', lead: 2, preferred: true })
  await link('BRK-1042', 1, 4700, { sku: 'HH-1042', lead: 4 })
  await link('FLT-OIL-22', 0, 650, { sku: 'FP-OF-22', lead: 1, preferred: true })
  await link('FLT-OIL-22', 2, 620, { sku: 'RK-OIL-22', lead: 5 })
  await link('TIR-295-75', 2, 28000, { sku: 'RK-DRV-29575', lead: 7, preferred: true })
  await link('BAT-31-950', 1, 11000, { sku: 'HH-BAT31', lead: 3, preferred: true })

  // A couple of recent sales/receipts so the dashboard "recent movements" is alive.
  await recordSale('FLT-OIL-22', 4, 'INV-1001')
  await recordSale('LGT-LED-H7', 2, 'INV-1002')
  await recordReceive('BLT-VEE-2', 3, 'PO-501')

  // Vehicle fitment examples.
  await prisma.vehicleFitment.create({ data: { partId: partsByNumber.get('BRK-1042')!, make: 'Freightliner', model: 'Cascadia', yearFrom: 2016, yearTo: 2022, engine: 'DD15' } })
  await prisma.vehicleFitment.create({ data: { partId: partsByNumber.get('FLT-OIL-22')!, make: 'Freightliner', model: 'Cascadia', yearFrom: 2014, yearTo: 2024 } })
  await prisma.vehicleFitment.create({ data: { partId: partsByNumber.get('BAT-31-950')!, make: 'Peterbilt', model: '579', yearFrom: 2015, yearTo: 2023 } })

  const counts = {
    categories: await prisma.category.count(),
    locations: await prisma.location.count(),
    suppliers: await prisma.supplier.count(),
    parts: await prisma.part.count(),
    movements: await prisma.stockMovement.count(),
  }
  console.log('Seed complete:', counts)

  async function recordSale(partNumber: string, qty: number, reference: string) {
    const partId = partsByNumber.get(partNumber)!
    await prisma.$transaction(async (tx) => {
      const part = await tx.part.findUniqueOrThrow({ where: { id: partId } })
      await tx.stockMovement.create({ data: { partId, type: 'SELL', quantity: -qty, reference } })
      await tx.part.update({ where: { id: partId }, data: { quantityOnHand: part.quantityOnHand - qty } })
    })
  }

  async function recordReceive(partNumber: string, qty: number, reference: string) {
    const partId = partsByNumber.get(partNumber)!
    await prisma.$transaction(async (tx) => {
      const part = await tx.part.findUniqueOrThrow({ where: { id: partId } })
      await tx.stockMovement.create({ data: { partId, type: 'RECEIVE', quantity: qty, reference } })
      await tx.part.update({ where: { id: partId }, data: { quantityOnHand: part.quantityOnHand + qty } })
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
