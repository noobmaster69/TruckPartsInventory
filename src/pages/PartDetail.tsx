import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../lib/useFetch'
import { apiPost } from '../api/client'
import { formatMoney, formatDate } from '../lib/format'
import { Spinner, ErrorState } from '../components/states'
import { Button, Badge } from '../components/ui'
import { useToast } from '../components/Toast'
import { MovementModal } from './MovementModal'
import type { MovementType, PartDetail as PartDetailType } from '../api/types'

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-slate-700">{children}</div>
    </div>
  )
}

export default function PartDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { data: part, loading, error, refetch } = useFetch<PartDetailType>(id ? `/parts/${id}` : null)
  const [move, setMove] = useState<MovementType | null>(null)

  if (loading) return <Spinner />
  if (error || !part) return <ErrorState message={error ?? 'Not found'} onRetry={refetch} />

  const low = part.quantityOnHand <= part.reorderPoint

  async function recalc() {
    if (!part) return
    try {
      await apiPost(`/parts/${part.id}/recalc`, {})
      toast.push('Quantity recalculated from ledger', 'success')
      refetch()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-sm text-slate-400">
        <Link to="/parts" className="hover:underline">
          ← Parts
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">{part.name}</h1>
          <div className="font-mono text-sm text-slate-500">{part.partNumber}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setMove('RECEIVE')}>
            Receive
          </Button>
          <Button variant="secondary" onClick={() => setMove('SELL')}>
            Sell
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Info label="On hand">
          {low ? (
            <Badge color={part.quantityOnHand <= 0 ? 'red' : 'amber'}>
              {part.quantityOnHand} {part.unitOfMeasure}
            </Badge>
          ) : (
            `${part.quantityOnHand} ${part.unitOfMeasure}`
          )}
        </Info>
        <Info label="Reorder point">
          {part.reorderPoint} (order {part.reorderQuantity})
        </Info>
        <Info label="Location">{part.location?.name ?? '—'}</Info>
        <Info label="Category">{part.category?.name ?? '—'}</Info>
        <Info label="Cost / Sell">
          {formatMoney(part.costPrice)} / {formatMoney(part.sellPrice)}
        </Info>
        <Info label="Manufacturer">{part.manufacturer ?? '—'}</Info>
      </div>
      {part.description && <p className="text-sm text-slate-600">{part.description}</p>}

      {part.suppliers.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Suppliers</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">Supplier</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2 text-right">Cost</th>
                  <th className="px-4 py-2">Lead</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {part.suppliers.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2">{s.supplier?.name}</td>
                    <td className="px-4 py-2 text-slate-500">{s.supplierSku ?? '—'}</td>
                    <td className="px-4 py-2 text-right">{formatMoney(s.cost)}</td>
                    <td className="px-4 py-2 text-slate-500">{s.leadTimeDays != null ? `${s.leadTimeDays}d` : '—'}</td>
                    <td className="px-4 py-2">{s.isPreferred && <Badge color="green">preferred</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {part.fitments.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Vehicle fitment</h2>
          <div className="flex flex-wrap gap-2">
            {part.fitments.map((f) => (
              <Badge key={f.id} color="slate">
                {[f.make, f.model, f.yearFrom || f.yearTo ? `${f.yearFrom ?? ''}–${f.yearTo ?? ''}` : '', f.engine]
                  .filter(Boolean)
                  .join(' ')}
              </Badge>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Movement history</h2>
          <Button variant="ghost" className="text-xs" onClick={recalc}>
            Recalculate qty
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">When</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2">Ref</th>
                <th className="px-4 py-2">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {part.movements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-slate-400">
                    No movements.
                  </td>
                </tr>
              )}
              {part.movements.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-2 text-slate-500">{formatDate(m.createdAt)}</td>
                  <td className="px-4 py-2">{m.type}</td>
                  <td className={`px-4 py-2 text-right font-medium ${m.quantity >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {m.quantity >= 0 ? '+' : ''}
                    {m.quantity}
                  </td>
                  <td className="px-4 py-2 text-slate-500">{m.reference ?? '—'}</td>
                  <td className="px-4 py-2 text-slate-500">{m.note ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {move && (
        <MovementModal
          open
          part={part}
          defaultType={move}
          onClose={() => setMove(null)}
          onSaved={() => {
            setMove(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}
