import { useEffect, useState, type FormEvent } from 'react'
import { apiPost } from '../api/client'
import { Modal } from '../components/Modal'
import { Button, Field, Input, Select, Textarea } from '../components/ui'
import { useToast } from '../components/Toast'
import { parseMoney } from '../lib/format'
import type { MovementType, Part } from '../api/types'

const TYPES: { value: MovementType; label: string }[] = [
  { value: 'RECEIVE', label: 'Receive (add stock)' },
  { value: 'SELL', label: 'Sell / Issue (remove stock)' },
  { value: 'RETURN', label: 'Return (add stock)' },
  { value: 'ADJUST', label: 'Adjust (set +/-)' },
]

type Props = {
  open: boolean
  part: Part
  defaultType?: MovementType
  onClose: () => void
  onSaved: () => void
}

export function MovementModal({ open, part, defaultType = 'RECEIVE', onClose, onSaved }: Props) {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [type, setType] = useState<MovementType>(defaultType)
  const [qty, setQty] = useState('1')
  const [unitCost, setUnitCost] = useState('')
  const [reference, setReference] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (open) {
      setType(defaultType)
      setQty('1')
      setUnitCost('')
      setReference('')
      setNote('')
    }
  }, [open, defaultType])

  async function submit(e?: FormEvent) {
    e?.preventDefault()
    setSaving(true)
    try {
      await apiPost('/movements', {
        partId: part.id,
        type,
        quantity: Number(qty),
        unitCost: unitCost ? parseMoney(unitCost) : null,
        reference: reference.trim() || null,
        note: note.trim() || null,
      })
      toast.push('Stock updated', 'success')
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
      title={`Stock movement — ${part.partNumber}`}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => submit()} disabled={saving}>
            {saving ? 'Saving…' : 'Record'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          On hand now: <span className="font-semibold">{part.quantityOnHand}</span> {part.unitOfMeasure}
        </div>
        <Field label="Type">
          <Select value={type} onChange={(e) => setType(e.target.value as MovementType)}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label={type === 'ADJUST' ? 'Quantity (+/-)' : 'Quantity'}
          hint={type === 'ADJUST' ? 'Use a negative number to reduce stock' : undefined}
        >
          <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
        </Field>
        <Field label="Unit cost ($, optional)">
          <Input type="number" step="0.01" min="0" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
        </Field>
        <Field label="Reference (invoice / job #)">
          <Input value={reference} onChange={(e) => setReference(e.target.value)} />
        </Field>
        <Field label="Note">
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <button type="submit" className="hidden" aria-hidden />
      </form>
    </Modal>
  )
}
