import { useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { profile } from '../../data/profile'
import { staticContent } from '../../lib/content'
import { FieldInput, toPayload, type Values } from './Form'
import { profileFields } from './resources'
import { useToast } from './Toast'

export function ProfileEditor({ db }: { db: SupabaseClient }) {
  const toast = useToast()
  const [values, setValues] = useState<Values>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    db.from('profile').select('*').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (error) toast(error.message, 'error')
      setValues(data ?? {})
      setLoading(false)
    })
  }, [db, toast])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await db.from('profile').upsert({ id: 1, ...toPayload(profileFields, values) })
    setSaving(false)
    toast(error ? error.message : 'Profil tersimpan. Refresh situs untuk melihat hasilnya.', error ? 'error' : 'ok')
  }

  if (loading) return <div className="adm-skeleton tall" />

  const hero = staticContent.hero
  const [first, last] = profile.name.split(' ')
  return (
    <div>
      <div className="adm-head">
        <div>
          <h2>Profil</h2>
          <p className="adm-muted">Kolom yang dikosongkan memakai teks bawaan situs. Pratinjau di kanan ikut berubah saat Anda mengetik.</p>
        </div>
      </div>
      <div className="adm-profile">
        <form className="adm-panel" onSubmit={save}>
          {profileFields.map((f) => (
            <FieldInput key={f.key} db={db} field={f} value={values[f.key]} onChange={(v) => setValues({ ...values, [f.key]: v })} />
          ))}
          <div className="adm-actions">
            <button className="adm-btn solid" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan profil'}</button>
          </div>
        </form>

        <div className="adm-preview" aria-label="Pratinjau hero">
          <small>Pratinjau hero</small>
          <img src={values.photo_url || hero.photo} alt="" />
          <h3>{first} <em>{last}</em></h3>
          <p>{values.intro || hero.intro}</p>
        </div>
      </div>
    </div>
  )
}
