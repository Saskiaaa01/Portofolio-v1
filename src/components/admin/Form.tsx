import { ImagePlus, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Field } from './resources'
import { useToast } from './Toast'

export type Values = Record<string, any>

// Nama file aman untuk URL: huruf kecil, tanpa spasi atau karakter aneh
const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')

function ImageInput({ db, value, onChange }: { db: SupabaseClient; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)
  const toast = useToast()

  const upload = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return toast('Pilih berkas gambar (JPG, PNG, WebP).', 'error')
    setBusy(true)
    const path = `${Date.now()}-${slug(file.name)}`
    const { error } = await db.storage.from('portfolio').upload(path, file, { contentType: file.type })
    setBusy(false)
    if (error) return toast(`Gagal mengunggah: ${error.message}`, 'error')
    onChange(db.storage.from('portfolio').getPublicUrl(path).data.publicUrl)
    toast('Gambar terunggah.')
  }

  return (
    <label
      className={`adm-drop${over ? ' over' : ''}${value ? ' has' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); upload(e.dataTransfer.files[0]) }}
    >
      {value && <img src={value} alt="Pratinjau" />}
      <span>
        {busy ? <LoaderCircle className="spin" size={20} aria-hidden /> : <ImagePlus size={20} aria-hidden />}
        {busy ? 'Mengunggah…' : value ? 'Seret gambar baru atau klik untuk mengganti' : 'Seret gambar ke sini atau klik untuk memilih'}
      </span>
      <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
    </label>
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
        <>
          <input id={id} value={Array.isArray(value) ? value.join(', ') : (value ?? '')} onChange={(e) => onChange(e.target.value)} />
          <div className="adm-chips">
            {(Array.isArray(value) ? value : String(value ?? '').split(',')).map((t: string) => t.trim()).filter(Boolean).map((t: string, i: number) => <span key={i}>{t}</span>)}
          </div>
        </>
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
