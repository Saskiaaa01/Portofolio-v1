import { useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Field } from './resources'

export type Values = Record<string, any>

// Nama file aman untuk URL: huruf kecil, tanpa spasi atau karakter aneh
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')

function ImageInput({ db, value, onChange }: { db: SupabaseClient; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file: File) => {
    setBusy(true)
    setError('')
    const path = `${Date.now()}-${slug(file.name)}`
    const { error: err } = await db.storage.from('portfolio').upload(path, file, { contentType: file.type })
    setBusy(false)
    if (err) return setError(`Gagal mengunggah: ${err.message}`)
    onChange(db.storage.from('portfolio').getPublicUrl(path).data.publicUrl)
  }

  return (
    <div className="adm-image">
      {value && <img src={value} alt="Pratinjau" />}
      <label className="adm-btn">
        {busy ? 'Mengunggah…' : value ? 'Ganti gambar' : 'Pilih gambar'}
        <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
      {error && <p className="adm-error">{error}</p>}
    </div>
  )
}

export function FieldInput({ db, field, value, onChange }: { db: SupabaseClient; field: Field; value: any; onChange: (v: any) => void }) {
  const id = `f-${field.key}`
  return (
    <div className="adm-field">
      <label htmlFor={id}>
        {field.label}
        {field.required && <b> *</b>}
      </label>
      {field.type === 'textarea' ? (
        <textarea id={id} rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === 'image' ? (
        <ImageInput db={db} value={value ?? ''} onChange={onChange} />
      ) : field.type === 'tags' ? (
        <input id={id} value={Array.isArray(value) ? value.join(', ') : (value ?? '')} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === 'number' ? (
        <input id={id} type="number" value={value ?? 0} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} value={value ?? ''} required={field.required} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.hint && <small>{field.hint}</small>}
    </div>
  )
}

// Ubah nilai form menjadi isi kolom: tag jadi array, urutan jadi angka, teks kosong jadi null
export function toPayload(fields: Field[], values: Values): Values {
  const out: Values = {}
  for (const f of fields) {
    const v = values[f.key]
    if (f.type === 'tags') out[f.key] = (Array.isArray(v) ? v : String(v ?? '').split(',')).map((t: string) => t.trim()).filter(Boolean)
    else if (f.type === 'number') out[f.key] = Number(v) || 0
    else out[f.key] = typeof v === 'string' && v.trim() === '' ? null : v
  }
  return out
}
