import { useEffect, useState, type FormEvent } from 'react'
import { apiPost, apiPut } from '../api/client'
import { Modal } from '../components/Modal'
import { Button, Field, Input, Select, Textarea } from '../components/ui'
import { useToast } from '../components/Toast'
import { parseMoney } from '../lib/format'
import type { Category, Location, Part } from '../api/types'

type Props = {
  open: boolean
  part: Part | null
  categories: Category[]
  locations: Location[]
  onClose: () => void
  onSaved: () => void
}

type FormState = {
  partNumber: string
  name: string
  description: string
  manufacturer: string
  barcode: string
  unitOfMeasure: string
  categoryId: string
  locationId: string
  costPrice: string
  sellPrice: string
  reorderPoint: string
  reorderQuantity: string
}

function blank(): FormState {
  return {
    partNumber: '',
    name: '',
    description: '',
    manufacturer: '',
    barcode: '',
    unitOfMeasure: 'each',
    categoryId: '',
    locationId: '',
    costPrice: '',
    sellPrice: '',
    reorderPoint: '0',
    reorderQuantity: '0',
  }
}

function fromPart(p: Part): FormState {
  return {
    partNumber: p.partNumber,
    name: p.name,
    description: p.description ?? '',
    manufacturer: p.manufacturer ?? '',
    barcode: p.barcode ?? '',
    unitOfMeasure: p.unitOfMeasure,
    categoryId: p.categoryId ? String(p.categoryId) : '',
    locationId: p.locationId ? String(p.locationId) : '',
    costPrice: (p.costPrice / 100).toFixed(2),
    sellPrice: (p.sellPrice / 100).toFixed(2),
    reorderPoint: String(p.reorderPoint),
    reorderQuantity: String(p.reorderQuantity),
  }
}

export function PartFormModal({ open, part, categories, locations, onClose, onSaved }: Props) {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(blank)

  useEffect(() => {
    if (open) setForm(part ? fromPart(part) : blank())
  }, [open, part])

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function submit(e?: FormEvent) {
    e?.preventDefault()
    setSaving(true)
    try {
      const payload = {
        partNumber: form.partNumber.trim(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        manufacturer: form.manufacturer.trim() || null,
        barcode: form.barcode.trim() || null,
        unitOfMeasure: form.unitOfMeasure.trim() || 'each',
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        locationId: form.locationId ? Number(form.locationId) : null,
        costPrice: parseMoney(form.costPrice),
        sellPrice: parseMoney(form.sellPrice),
        reorderPoint: Number(form.reorderPoint) || 0,
        reorderQuantity: Number(form.reorderQuantity) || 0,
      }
      if (part) await apiPut(`/parts/${part.id}`, payload)
      else await apiPost('/parts', payload)
      toast.push(part ? 'Part updated' : 'Part created', 'success')
      onSaved()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title={part ? `Edit ${part.partNumber}` : 'Add Part'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => submit()} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <Field label="Part Number *">
          <Input value={form.partNumber} onChange={(e) => set('partNumber', e.target.value)} required />
        </Field>
        <Field label="Name *">
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </Field>
        <div className="col-span-2">
          <Field label="Description">
            <Textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
        </div>
        <Field label="Category">
          <Select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Location">
          <Select value={form.locationId} onChange={(e) => set('locationId', e.target.value)}>
            <option value="">—</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Manufacturer">
          <Input value={form.manufacturer} onChange={(e) => set('manufacturer', e.target.value)} />
        </Field>
        <Field label="Unit of Measure">
          <Input value={form.unitOfMeasure} onChange={(e) => set('unitOfMeasure', e.target.value)} placeholder="each" />
        </Field>
        <Field label="Cost Price ($)">
          <Input type="number" step="0.01" min="0" value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} />
        </Field>
        <Field label="Sell Price ($)">
          <Input type="number" step="0.01" min="0" value={form.sellPrice} onChange={(e) => set('sellPrice', e.target.value)} />
        </Field>
        <Field label="Reorder Point">
          <Input type="number" min="0" value={form.reorderPoint} onChange={(e) => set('reorderPoint', e.target.value)} />
        </Field>
        <Field label="Reorder Quantity">
          <Input type="number" min="0" value={form.reorderQuantity} onChange={(e) => set('reorderQuantity', e.target.value)} />
        </Field>
        <div className="col-span-2">
          <Field label="Barcode">
            <Input value={form.barcode} onChange={(e) => set('barcode', e.target.value)} />
          </Field>
        </div>
        <button type="submit" className="hidden" aria-hidden />
      </form>
    </Modal>
  )
}
