import { useFetch } from '../lib/useFetch'
import { formatMoney } from '../lib/format'
import { Spinner, ErrorState } from '../components/states'
import { Button } from '../components/ui'
import type { Dashboard, Part } from '../api/types'

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-800">{value}</div>
    </div>
  )
}

export default function Reports() {
  const { data, loading, error, refetch } = useFetch<Dashboard>('/dashboard')
  const { data: parts } = useFetch<Part[]>('/parts?sort=name&dir=asc')

  if (loading) return <Spinner />
  if (error || !data) return <ErrorState message={error ?? 'No data'} onRetry={refetch} />

  const costValue = data.inventoryValueCents
  const retailValue = data.retailValueCents

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Reports</h1>
        <Button variant="secondary" onClick={() => window.print()}>
          Print
        </Button>
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card label="Inventory at cost" value={formatMoney(costValue)} />
        <Card label="Inventory at retail" value={formatMoney(retailValue)} />
        <Card label="Potential margin" value={formatMoney(retailValue - costValue)} />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Reorder list ({data.lowStockParts.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Part #</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 text-right">On hand</th>
                <th className="px-4 py-2 text-right">Reorder pt</th>
                <th className="px-4 py-2 text-right">Order qty</th>
                <th className="px-4 py-2 text-right">Est. cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.lowStockParts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-slate-400">
                    Nothing to reorder. 🎉
                  </td>
                </tr>
              )}
              {data.lowStockParts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2 font-mono text-xs">{p.partNumber}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2 text-right">{p.quantityOnHand}</td>
                  <td className="px-4 py-2 text-right">{p.reorderPoint}</td>
                  <td className="px-4 py-2 text-right font-medium">{p.reorderQuantity || '—'}</td>
                  <td className="px-4 py-2 text-right">{formatMoney((p.reorderQuantity || 0) * p.costPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Valuation by part</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Part #</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Unit cost</th>
                <th className="px-4 py-2 text-right">Ext. cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parts?.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2 font-mono text-xs">{p.partNumber}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2 text-right">{p.quantityOnHand}</td>
                  <td className="px-4 py-2 text-right">{formatMoney(p.costPrice)}</td>
                  <td className="px-4 py-2 text-right">{formatMoney(p.quantityOnHand * p.costPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
