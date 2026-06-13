import { useEffect, useState, type FormEvent } from 'react'
import { useFetch } from '../lib/useFetch'
import { apiPost, apiPut, apiDelete } from '../api/client'
import { Spinner, ErrorState, EmptyState } from '../components/states'
import { Button, Field, Input, Select } from '../components/ui'
import { Modal } from '../components/Modal'
import { useToast } from '../components/Toast'
import type { Category } from '../api/types'

export default function Categories() {
  const { data, loading, error, refetch } = useFetch<Category[]>('/categories')
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '')
      setParentId(editing?.parentId ? String(editing.parentId) : '')
    }
  }, [open, editing])

  async function save(e?: FormEvent) {
    e?.preventDefault()
    setSaving(true)
    try {
      const payload = { name: name.trim(), parentId: parentId ? Number(parentId) : null }
      if (editing) await apiPut(`/categories/${editing.id}`, payload)
      else await apiPost('/categories', payload)
      toast.push('Saved', 'success')
      setOpen(false)
      refetch()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  async function del(c: Category) {
    if (!confirm(`Delete category "${c.name}"? Parts keep existing but lose this category.`)) return
    try {
      await apiDelete(`/categories/${c.id}`)
      toast.push('Deleted', 'success')
      refetch()
    } catch (err) {
      toast.push(err instanceof Error ? err.message : String(err), 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Categories</h1>
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
        <EmptyState>No categories yet.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Parent</th>
                <th className="px-4 py-2 text-right">Parts</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2 text-slate-500">{c.parent?.name ?? '—'}</td>
                  <td className="px-4 py-2 text-right text-slate-500">{c._count?.parts ?? 0}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        className="px-2 py-1"
                        onClick={() => {
                          setEditing(c)
                          setOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="ghost" className="px-2 py-1 text-red-600" onClick={() => del(c)}>
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
        title={editing ? 'Edit category' : 'Add category'}
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
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Parent category">
            <Select value={parentId} onChange={(e) => setParentId(e.target.value)}>
              <option value="">— none —</option>
              {data
                ?.filter((c) => c.id !== editing?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </Field>
          <button type="submit" className="hidden" aria-hidden />
        </form>
      </Modal>
    </div>
  )
}
