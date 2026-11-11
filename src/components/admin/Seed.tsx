import { useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { staticContent as c } from '../../lib/content'

// Isi awal database dari konten bawaan situs. Hanya mengisi tabel yang masih kosong, jadi aman ditekan berulang.
const rows: Record<string, Record<string, unknown>[]> = {
  projects: c.projects.map((p, sort) => ({ title: p.title, role: p.role, text: p.text, image_url: p.image, tags: p.tags, sort })),
  certificates: c.certificates.map((x, sort) => ({ title: x.title, issuer: x.by, issued_on: x.when, text: x.text, image_url: x.image, sort })),
  skills: c.skills.map((s, sort) => ({ title: s.title, text: s.text, chips: s.chips, sort })),
  experiences: c.jobs.map((j, sort) => ({ year: j.year, period: j.when, title: j.title, place: j.at, text: j.text, sort })),
  activities: c.activities.map((a, sort) => ({ title: a.title, meta: a.meta, text: a.text, sort })),
}

export function Seed({ db }: { db: SupabaseClient }) {
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const run = async () => {
    setBusy(true)
    const out: string[] = []
    const { count: pc } = await db.from('profile').select('*', { count: 'exact', head: true })
    if (!pc) {
      const { error } = await db.from('profile').insert({ id: 1, intro: c.hero.intro, fact: c.hero.fact, photo_url: c.hero.photo, linkedin_url: c.hero.linkedin })
      out.push(error ? `profile: gagal (${error.message})` : 'profile: terisi')
    } else out.push('profile: dilewati (sudah ada isi)')
    for (const [table, data] of Object.entries(rows)) {
      const { count } = await db.from(table).select('*', { count: 'exact', head: true })
      if (count) {
        out.push(`${table}: dilewati (sudah ada ${count} baris)`)
        continue
      }
      const { error } = await db.from(table).insert(data)
      out.push(error ? `${table}: gagal (${error.message})` : `${table}: ${data.length} baris terisi`)
    }
    setLog(out)
    setBusy(false)
  }

  return (
    <div>
      <h2>Impor data awal</h2>
      <p className="adm-muted">Menyalin konten yang sekarang tampil di situs ke database, supaya bisa Anda ubah dari dashboard. Tabel yang sudah berisi tidak disentuh.</p>
      <div className="adm-actions">
        <button className="adm-btn solid" onClick={run} disabled={busy}>{busy ? 'Mengimpor…' : 'Impor sekarang'}</button>
      </div>
      {log.length > 0 && (
        <ul className="adm-log">
          {log.map((l) => <li key={l}>{l}</li>)}
        </ul>
      )}
    </div>
  )
}
