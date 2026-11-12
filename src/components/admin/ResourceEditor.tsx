import { GripVertical, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { FieldInput, toPayload, type Values } from './Form'
import type { Resource } from './resources'
import { useToast } from './Toast'

type Props = { db: SupabaseClient; resource: Resource; icon: React.ReactNode; onChanged: () => void }

export function ResourceEditor({ db, resource, icon, onChanged }: Props) {
  const toast = useToast()
  const [rows, setRows] = useState<Values[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Values | null>(null)
  const [saving, setSaving] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const { data, error } = await db.from(resource.table).select('*').order('sort', { ascending: true })
    if (error) toast(error.message, 'error')
    setRows(data ?? [])
    setLoading(false)
  }, [db, resource.table, toast])

  useEffect(() => {
    setLoading(true)
    reload()
  }, [reload])

  useEffect(() => {
    if (!editing) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setEditing(null)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [editing])

  const startNew = () => setEditing({ sort: rows.length ? Math.max(...rows.map((r) => r.sort ?? 0)) + 1 : 0 })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    const payload = toPayload(resource.fields, editing)
    const { error } = editing.id ? await db.from(resource.table).update(payload).eq('id', editing.id) : await db.from(resource.table).insert(payload)
    setSaving(false)
    if (error) return toast(error.message, 'error')
    toast(editing.id ? 'Perubahan tersimpan.' : 'Item ditambahkan.')
    setEditing(null)
    reload()
    onChanged()
  }

  const remove = async (row: Values) => {
    if (!confirm(`Hapus "${row[resource.titleKey]}"? Tindakan ini tidak bisa dibatalkan.`)) return
    const { error } = await db.from(resource.table).delete().eq('id', row.id)
    if (error) return toast(error.message, 'error')
    toast('Item dihapus.')
    reload()
    onChanged()
  }

  // Seret kartu untuk mengubah urutan; kolom sort ditulis ulang 0..n-1
  const drop = async (targetId: string) => {
    const from = rows.findIndex((r) => r.id === dragId)
    const to = rows.findIndex((r) => r.id === targetId)
    setDragId(null)
    setOverId(null)
    if (from < 0 || to < 0 || from === to) return
    const next = [...rows]
    next.splice(to, 0, next.splice(from, 1)[0])
    setRows(next)
    const changed = next.map((r, sort) => ({ r, sort })).filter(({ r, sort }) => r.sort !== sort)
    const results = await Promise.all(changed.map(({ r, sort }) => db.from(resource.table).update({ sort }).eq('id', r.id)))
    if (results.some((x) => x.error)) toast('Gagal menyimpan urutan.', 'error')
    else toast('Urutan disimpan.')
    reload()
  }

  const q = query.trim().toLowerCase()
  const shown = q ? rows.filter((r) => [r[resource.titleKey], resource.subKey && r[resource.subKey]].some((v) => String(v ?? '').toLowerCase().includes(q))) : rows
  const tagsOf = (r: Values): string[] => (r.tags ?? r.chips ?? []).slice(0, 3)

  return (
    <div>
      <div className="adm-head">
        <div>
          <h2>{resource.label}</h2>
          <p className="adm-muted">{rows.length} item{rows.length > 0 && !query && ' · seret kartu untuk mengubah urutan'}</p>
        </div>
        <div className="adm-tools">
          <label className="adm-search">
            <Search size={16} aria-hidden />
            <input placeholder="Cari…" aria-label="Cari" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <button className="adm-btn solid" onClick={startNew}><Plus size={16} aria-hidden /> Tambah</button>
        </div>
      </div>

      {loading ? (
        <div className="adm-grid">{[0, 1, 2].map((i) => <div key={i} className="adm-skeleton" />)}</div>
      ) : shown.length === 0 ? (
        <div className="adm-empty">
          <div>{icon}</div>
          <b>{query ? 'Tidak ada yang cocok' : `Belum ada ${resource.label.toLowerCase()}`}</b>
          <p>{query ? 'Coba kata kunci lain.' : 'Situs menampilkan konten bawaan sampai item pertama ditambahkan. Atau pakai "Impor data awal".'}</p>
        </div>
      ) : (
        <div className="adm-grid">
          {shown.map((r, i) => (
            <article
              key={r.id}
              className={`adm-item${dragId === r.id ? ' dragging' : ''}${overId === r.id && dragId !== r.id ? ' over' : ''}`}
              style={{ '--i': i } as React.CSSProperties}
              draggable={!q}
              onDragStart={() => setDragId(r.id)}
              onDragEnd={() => { setDragId(null); setOverId(null) }}
              onDragOver={(e) => { if (dragId) { e.preventDefault(); setOverId(r.id) } }}
              onDrop={(e) => { e.preventDefault(); drop(r.id) }}
            >
              <div className="adm-thumb">
                {r.image_url ? <img src={r.image_url} alt="" /> : <span>{icon}</span>}
                {!q && <i className="adm-grip" aria-hidden><GripVertical size={16} /></i>}
                <b className="adm-no">{String(i + 1).padStart(2, '0')}</b>
              </div>
              <div className="adm-item-body">
                <h3>{r[resource.titleKey]}</h3>
                {resource.subKey && r[resource.subKey] && <p>{r[resource.subKey]}</p>}
                {tagsOf(r).length > 0 && <div className="adm-chips">{tagsOf(r).map((t) => <span key={t}>{t}</span>)}</div>}
              </div>
              <div className="adm-item-actions">
                <button className="adm-icon" aria-label="Ubah" onClick={() => setEditing(r)}><Pencil size={16} /></button>
                <button className="adm-icon danger" aria-label="Hapus" onClick={() => remove(r)}><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <>
          <div className="adm-scrim" onClick={() => setEditing(null)} />
          <aside className="adm-drawer" role="dialog" aria-label={editing.id ? 'Ubah item' : 'Tambah item'}>
            <form onSubmit={save}>
              <header>
                <h2>{editing.id ? `Ubah ${resource.label.toLowerCase()}` : `Tambah ${resource.label.toLowerCase()}`}</h2>
                <button type="button" className="adm-icon" aria-label="Tutup" onClick={() => setEditing(null)}><X size={18} /></button>
              </header>
              <div className="adm-drawer-body">
                {resource.fields.map((f) => (
                  <FieldInput key={f.key} db={db} field={f} value={editing[f.key]} onChange={(v) => setEditing({ ...editing, [f.key]: v })} />
                ))}
              </div>
              <footer>
                <button type="button" className="adm-btn" onClick={() => setEditing(null)}>Batal</button>
                <button className="adm-btn solid" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
              </footer>
            </form>
          </aside>
        </>
      )}
    </div>
  )
}
