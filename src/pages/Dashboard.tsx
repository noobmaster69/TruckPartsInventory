import { Link } from 'react-router-dom'
import { useFetch } from '../lib/useFetch'
import { formatMoney, formatDate } from '../lib/format'
import { Spinner, ErrorState } from '../components/states'
import { Badge } from '../components/ui'
import type { Dashboard as DashboardData } from '../api/types'

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${accent ?? 'text-slate-800'}`}>{value}</div>
    </div>
  )
}

export default function Dashboard() {
  const { data, loading, error, refetch } = useFetch<DashboardData>('/dashboard')
  if (loading) return <Spinner />
  if (error || !data) return <ErrorState message={error ?? 'No data'} onRetry={refetch} />

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total Parts" value={String(data.totalParts)} />
        <Stat label="Inventory Value" value={formatMoney(data.inventoryValueCents)} />
        <Stat label="Low Stock" value={String(data.lowStockCount)} accent={data.lowStockCount > 0 ? 'text-amber-600' : undefined} />
        <Stat label="Out of Stock" value={String(data.outOfStockCount)} accent={data.outOfStockCount > 0 ? 'text-red-600' : undefined} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold">Low stock — reorder soon</h2>
            <Link to="/parts?lowStock=true" className="text-xs text-slate-500 underline">
              View all
            </Link>
          </header>
          <div className="divide-y divide-slate-100">
            {data.lowStockParts.length === 0 && <div className="p-4 text-sm text-slate-400">Nothing low. 🎉</div>}
            {data.lowStockParts.slice(0, 8).map((p) => (
              <Link key={p.id} to={`/parts/${p.id}`} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.partNumber}</div>
                </div>
                <Badge color={p.quantityOnHand <= 0 ? 'red' : 'amber'}>
                  {p.quantityOnHand} / {p.reorderPoint}
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <header className="border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold">Recent movements</h2>
          </header>
          <div className="divide-y divide-slate-100">
            {data.recentMovements.length === 0 && <div className="p-4 text-sm text-slate-400">No movements yet.</div>}
            {data.recentMovements.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <div>
                  <div className="font-medium">{m.part?.name}</div>
                  <div className="text-xs text-slate-400">
                    {formatDate(m.createdAt)}
                    {m.reference ? ` · ${m.reference}` : ''}
                  </div>
                </div>
                <Badge color={m.quantity >= 0 ? 'green' : 'slate'}>
                  {m.quantity >= 0 ? '+' : ''}
                  {m.quantity} {m.type}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
