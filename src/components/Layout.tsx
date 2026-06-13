import { NavLink, Outlet } from 'react-router-dom'

const demoMode = import.meta.env.PROD && import.meta.env.BASE_URL !== '/'

const nav = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/parts', label: 'Parts', icon: '🔧', end: false },
  { to: '/categories', label: 'Categories', icon: '🗂️', end: false },
  { to: '/locations', label: 'Locations', icon: '📍', end: false },
  { to: '/suppliers', label: 'Suppliers', icon: '🏷️', end: false },
  { to: '/reports', label: 'Reports', icon: '📈', end: false },
]

export function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2 px-5 py-4 text-lg font-bold">
          <span aria-hidden>🚚</span>
          <span>Truck Parts</span>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span aria-hidden>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 px-5 py-4 text-xs text-slate-400">
          <div>Local inventory · SQLite</div>
          {demoMode && <div className="text-amber-600">GitHub Pages demo data</div>}
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
