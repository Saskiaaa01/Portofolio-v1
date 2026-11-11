import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { FieldInput, toPayload, type Values } from './Form'
import type { Resource } from './resources'

export function ResourceEditor({ db, resource }: { db: SupabaseClient; resource: Resource }) {
  const [rows, setRows] = useState<Values[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Values | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await db.from(resource.table).select('*').order('sort', { ascending: true })
    if (err) setError(err.message)
    setRows(data ?? [])
    setLoading(false)
  }, [db, resource.table])

  useEffect(() => {
    setEditing(null)
    setError('')
    reload()
  }, [reload])

  const startNew = () => setEditing({ sort: rows.length ? Math.max(...rows.map((r) => r.sort ?? 0)) + 1 : 0 })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setError('')
    const payload = toPayload(resource.fields, editing)
    const { error: err } = editing.id ? await db.from(resource.table).update(payload).eq('id', editing.id) : await db.from(resource.table).insert(payload)
    setSaving(false)
    if (err) return setError(err.message)
    setEditing(null)
    reload()
  }

  const remove = async (row: Values) => {
    if (!confirm(`Hapus "${row[resource.titleKey]}"? Tindakan ini tidak bisa dibatalkan.`)) return
    const { error: err } = await db.from(resource.table).delete().eq('id', row.id)
    if (err) return setError(err.message)
    reload()
  }

  if (editing) {
    return (
      <form className="adm-form" onSubmit={save}>
        <h2>{editing.id ? `Ubah ${resource.label.toLowerCase()}` : `Tambah ${resource.label.toLowerCase()}`}</h2>
        {resource.fields.map((f) => (
          <FieldInput key={f.key} db={db} field={f} value={editing[f.key]} onChange={(v) => setEditing({ ...editing, [f.key]: v })} />
        ))}
        {error && <p className="adm-error">{error}</p>}
        <div className="adm-actions">
          <button className="adm-btn solid" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
          <button type="button" className="adm-btn" onClick={() => setEditing(null)}>Batal</button>
        </div>
      </form>
    )
  }

  return (
    <div>
      <div className="adm-head">
        <h2>{resource.label}</h2>
        <button className="adm-btn solid" onClick={startNew}>+ Tambah</button>
      </div>
      {error && <p className="adm-error">{error}</p>}
      {loading ? (
        <p className="adm-muted">Memuat…</p>
      ) : rows.length === 0 ? (
        <p className="adm-muted">Belum ada data. Situs menampilkan konten bawaan sampai Anda menambah item pertama (atau pakai "Impor data awal").</p>
      ) : (
        <ul className="adm-list">
          {rows.map((r) => (
            <li key={r.id}>
              {r.image_url && <img src={r.image_url} alt="" />}
              <div>
                <b>{r[resource.titleKey]}</b>
                {resource.subKey && <span>{r[resource.subKey]}</span>}
              </div>
              <div className="adm-actions">
                <button className="adm-btn" onClick={() => setEditing(r)}>Ubah</button>
                <button className="adm-btn danger" onClick={() => remove(r)}>Hapus</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
