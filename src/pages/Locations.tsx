import { useEffect, useState, type FormEvent } from 'react'
import { useFetch } from '../lib/useFetch'
import { apiPost, apiPut, apiDelete } from '../api/client'
import { Spinner, ErrorState, EmptyState } from '../components/states'
import { Button, Field, Input, Textarea } from '../components/ui'
import { Modal } from '../components/Modal'
import { useToast } from '../components/Toast'
import type { Location } from '../api/types'

export default function Locations() {
  const { data, loading, error, refetch } = useFetch<Location[]>('/locations')
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Location | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '')
      setDescription(editing?.description ?? '')
    }
  }, [open, editing])

  async function save(e?: FormEvent) {
    e?.preventDefault()
    setSaving(true)
    try {
      const payload = { name: name.trim(), description: description.trim() || null }
      if (editing) await apiPut(`/locations/${editing.id}`, payload)
      else await apiPost('/locations', payload)
      toast.push('Saved', 'success')
      setOpen(false)
      refetch()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function del(l: Location) {
    if (!confirm(`Delete location "${l.name}"? Parts keep existing but lose this location.`)) return
    try {
      await apiDelete(`/locations/${l.id}`)
      toast.push('Deleted', 'success')
      refetch()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Locations</h1>
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
        <EmptyState>No locations yet.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2 text-right">Parts</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium">{l.name}</td>
                  <td className="px-4 py-2 text-slate-500">{l.description ?? '—'}</td>
                  <td className="px-4 py-2 text-right text-slate-500">{l._count?.parts ?? 0}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        className="px-2 py-1"
                        onClick={() => {
                          setEditing(l)
                          setOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="ghost" className="px-2 py-1 text-red-600" onClick={() => del(l)}>
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
        title={editing ? 'Edit location' : 'Add location'}
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
        <form onSubmit={save} className="space-y-3">
          <Field label="Name *">
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Aisle 3 / Bin B2" />
          </Field>
          <Field label="Description">
            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <button type="submit" className="hidden" aria-hidden />
        </form>
      </Modal>
    </div>
  )
}
