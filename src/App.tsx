import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Parts from './pages/Parts'
import PartDetail from './pages/PartDetail'
import Categories from './pages/Categories'
import Locations from './pages/Locations'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="parts" element={<Parts />} />
          <Route path="parts/:id" element={<PartDetail />} />
          <Route path="categories" element={<Categories />} />
          <Route path="locations" element={<Locations />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<div className="text-slate-500">Page not found.</div>} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
