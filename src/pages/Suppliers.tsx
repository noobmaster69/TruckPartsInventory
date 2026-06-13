import { useEffect, useState, type FormEvent } from 'react'
import { useFetch } from '../lib/useFetch'
import { apiPost, apiPut, apiDelete } from '../api/client'
import { Spinner, ErrorState, EmptyState } from '../components/states'
import { Button, Field, Input, Textarea } from '../components/ui'
import { Modal } from '../components/Modal'
import { useToast } from '../components/Toast'
import type { Supplier } from '../api/types'

type SForm = { name: string; contactName: string; phone: string; email: string; address: string; notes: string }
const empty: SForm = { name: '', contactName: '', phone: '', email: '', address: '', notes: '' }

export default function Suppliers() {
  const { data, loading, error, refetch } = useFetch<Supplier[]>('/suppliers')
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState<SForm>(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open)
      setForm(
        editing
          ? {
              name: editing.name,
              contactName: editing.contactName ?? '',
              phone: editing.phone ?? '',
              email: editing.email ?? '',
              address: editing.address ?? '',
              notes: editing.notes ?? '',
            }
          : empty,
      )
  }, [open, editing])

  function set<K extends keyof SForm>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function save(e?: FormEvent) {
    e?.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        contactName: form.contactName.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        notes: form.notes.trim() || null,
      }
      if (editing) await apiPut(`/suppliers/${editing.id}`, payload)
      else await apiPost('/suppliers', payload)
      toast.push('Saved', 'success')
      setOpen(false)
      refetch()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function del(s: Supplier) {
    if (!confirm(`Delete supplier "${s.name}"? This also removes its part links.`)) return
    try {
      await apiDelete(`/suppliers/${s.id}`)
      toast.push('Deleted', 'success')
      refetch()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Suppliers</h1>
        <Button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          + Add
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState>No suppliers yet.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2 text-right">Parts</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium">{s.name}</td>
                  <td className="px-4 py-2 text-slate-500">{s.contactName ?? '—'}</td>
                  <td className="px-4 py-2 text-slate-500">{s.phone ?? '—'}</td>
                  <td className="px-4 py-2 text-slate-500">{s.email ?? '—'}</td>
                  <td className="px-4 py-2 text-right text-slate-500">{s._count?.parts ?? 0}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        className="px-2 py-1"
                        onClick={() => {
                          setEditing(s)
                          setOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="ghost" className="px-2 py-1 text-red-600" onClick={() => del(s)}>
                        Del
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        wide
        title={editing ? 'Edit supplier' : 'Add supplier'}
        footer={
          <>
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => save()} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      >
        <form onSubmit={save} className="grid grid-cols-2 gap-3">
          <Field label="Name *">
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </Field>
          <Field label="Contact">
            <Input value={form.contactName} onChange={(e) => set('contactName', e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <div className="col-span-2">
            <Field label="Address">
              <Input value={form.address} onChange={(e) => set('address', e.target.value)} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Notes">
              <Textarea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </Field>
          </div>
          <button type="submit" className="hidden" aria-hidden />
        </form>
      </Modal>
    </div>
  )
}
