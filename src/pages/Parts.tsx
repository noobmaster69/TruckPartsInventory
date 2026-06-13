import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useFetch } from '../lib/useFetch'
import { apiDelete } from '../api/client'
import { formatMoney } from '../lib/format'
import { Spinner, ErrorState, EmptyState } from '../components/states'
import { Button, Input, Select, Badge } from '../components/ui'
import { useToast } from '../components/Toast'
import { PartFormModal } from './PartFormModal'
import { MovementModal } from './MovementModal'
import type { Category, Location, MovementType, Part } from '../api/types'

export default function Parts() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const categoryId = params.get('categoryId') ?? ''
  const locationId = params.get('locationId') ?? ''
  const lowStock = params.get('lowStock') === 'true'
  const sort = params.get('sort') ?? 'name'
  const dir = params.get('dir') ?? 'asc'

  const toast = useToast()
  const { data: categories } = useFetch<Category[]>('/categories')
  const { data: locations } = useFetch<Location[]>('/locations')

  const query = useMemo(() => {
    const q = new URLSearchParams()
    if (search) q.set('search', search)
    if (categoryId) q.set('categoryId', categoryId)
    if (locationId) q.set('locationId', locationId)
    if (lowStock) q.set('lowStock', 'true')
    q.set('sort', sort)
    q.set('dir', dir)
    return q.toString()
  }, [search, categoryId, locationId, lowStock, sort, dir])

  const { data: parts, loading, error, refetch } = useFetch<Part[]>(`/parts?${query}`)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Part | null>(null)
  const [moveCtx, setMoveCtx] = useState<{ part: Part; type: MovementType } | null>(null)

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  function toggleSort(field: string) {
    const next = new URLSearchParams(params)
    if (sort === field) {
      next.set('dir', dir === 'asc' ? 'desc' : 'asc')
    } else {
      next.set('sort', field)
      next.set('dir', 'asc')
    }
    setParams(next, { replace: true })
  }

  async function onDelete(p: Part) {
    if (!confirm(`Delete ${p.partNumber} — ${p.name}? This also removes its movement history.`)) return
    try {
      await apiDelete(`/parts/${p.id}`)
      toast.push(`Deleted ${p.partNumber}`, 'success')
      refetch()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    }
  }

  const arrow = (f: string) => (sort === f ? (dir === 'asc' ? ' ▲' : ' ▼') : '')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Parts</h1>
        <Button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          + Add Part
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search part #, name, manufacturer…"
          value={search}
          onChange={(e) => setParam('search', e.target.value)}
          className="max-w-xs"
        />
        <Select value={categoryId} onChange={(e) => setParam('categoryId', e.target.value)} className="max-w-[12rem]">
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select value={locationId} onChange={(e) => setParam('locationId', e.target.value)} className="max-w-[12rem]">
          <option value="">All locations</option>
          {locations?.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
        <label className="flex items-center gap-1.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => setParam('lowStock', e.target.checked ? 'true' : '')}
          />
          Low stock only
        </label>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !parts?.length ? (
        <EmptyState>No parts match your filters.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="cursor-pointer px-4 py-2.5" onClick={() => toggleSort('partNumber')}>
                  Part #{arrow('partNumber')}
                </th>
                <th className="cursor-pointer px-4 py-2.5" onClick={() => toggleSort('name')}>
                  Name{arrow('name')}
                </th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Location</th>
                <th className="cursor-pointer px-4 py-2.5 text-right" onClick={() => toggleSort('quantityOnHand')}>
                  Qty{arrow('quantityOnHand')}
                </th>
                <th className="cursor-pointer px-4 py-2.5 text-right" onClick={() => toggleSort('sellPrice')}>
                  Sell{arrow('sellPrice')}
                </th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parts.map((p) => {
                const low = p.quantityOnHand <= p.reorderPoint
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono text-xs">
                      <Link to={`/parts/${p.id}`} className="text-slate-700 hover:underline">
                        {p.partNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">
                      <Link to={`/parts/${p.id}`} className="font-medium hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{p.category?.name ?? '—'}</td>
                    <td className="px-4 py-2.5 text-slate-500">{p.location?.name ?? '—'}</td>
                    <td className="px-4 py-2.5 text-right">
                      {low ? <Badge color={p.quantityOnHand <= 0 ? 'red' : 'amber'}>{p.quantityOnHand}</Badge> : p.quantityOnHand}
                    </td>
                    <td className="px-4 py-2.5 text-right">{formatMoney(p.sellPrice)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-1">
                        <Button variant="secondary" className="px-2 py-1" onClick={() => setMoveCtx({ part: p, type: 'RECEIVE' })}>
                          Receive
                        </Button>
                        <Button variant="secondary" className="px-2 py-1" onClick={() => setMoveCtx({ part: p, type: 'SELL' })}>
                          Sell
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2 py-1"
                          onClick={() => {
                            setEditing(p)
                            setFormOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="ghost" className="px-2 py-1 text-red-600" onClick={() => onDelete(p)}>
                          Del
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <PartFormModal
        open={formOpen}
        part={editing}
        categories={categories ?? []}
        locations={locations ?? []}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false)
          refetch()
        }}
      />
      {moveCtx && (
        <MovementModal
          open
          part={moveCtx.part}
          defaultType={moveCtx.type}
          onClose={() => setMoveCtx(null)}
          onSaved={() => {
            setMoveCtx(null)
            refetch()
          }}
        />
      )}
    </div>
  )
}
