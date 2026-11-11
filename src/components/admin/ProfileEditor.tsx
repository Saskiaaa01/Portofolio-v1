import { useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { FieldInput, toPayload, type Values } from './Form'
import { profileFields } from './resources'

export function ProfileEditor({ db }: { db: SupabaseClient }) {
  const [values, setValues] = useState<Values>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    db.from('profile').select('*').eq('id', 1).maybeSingle().then(({ data, error: err }) => {
      if (err) setError(err.message)
      setValues(data ?? {})
      setLoading(false)
    })
  }, [db])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setDone(false)
    const { error: err } = await db.from('profile').upsert({ id: 1, ...toPayload(profileFields, values) })
    setSaving(false)
    if (err) return setError(err.message)
    setDone(true)
  }

  if (loading) return <p className="adm-muted">Memuat…</p>
  return (
    <form className="adm-form" onSubmit={save}>
      <h2>Profil</h2>
      <p className="adm-muted">Kolom yang dikosongkan memakai teks bawaan situs.</p>
      {profileFields.map((f) => (
        <FieldInput key={f.key} db={db} field={f} value={values[f.key]} onChange={(v) => setValues({ ...values, [f.key]: v })} />
      ))}
      {error && <p className="adm-error">{error}</p>}
      {done && <p className="adm-ok">Tersimpan. Refresh situs untuk melihat hasilnya.</p>}
      <div className="adm-actions">
        <button className="adm-btn solid" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
      </div>
    </form>
  )
}
