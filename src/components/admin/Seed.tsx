import { DatabaseZap } from 'lucide-react'
import { useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { staticContent as c } from '../../lib/content'
import { useToast } from './Toast'

// Isi awal database dari konten bawaan situs. Hanya mengisi tabel yang masih kosong, jadi aman ditekan berulang.
const rows: Record<string, Record<string, unknown>[]> = {
  projects: c.projects.map((p, sort) => ({ title: p.title, role: p.role, text: p.text, image_url: p.image, tags: p.tags, sort })),
  certificates: c.certificates.map((x, sort) => ({ title: x.title, issuer: x.by, issued_on: x.when, text: x.text, image_url: x.image, sort })),
  skills: c.skills.map((s, sort) => ({ title: s.title, text: s.text, chips: s.chips, sort })),
  experiences: c.jobs.map((j, sort) => ({ year: j.year, period: j.when, title: j.title, place: j.at, text: j.text, sort })),
  activities: c.activities.map((a, sort) => ({ title: a.title, meta: a.meta, text: a.text, sort })),
}

export function Seed({ db, onChanged }: { db: SupabaseClient; onChanged: () => void }) {
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState<[string, 'ok' | 'skip' | 'error'][]>([])

  const run = async () => {
    setBusy(true)
    const out: [string, 'ok' | 'skip' | 'error'][] = []
    const { count: pc } = await db.from('profile').select('*', { count: 'exact', head: true })
    if (!pc) {
      const { error } = await db.from('profile').insert({ id: 1, intro: c.hero.intro, fact: c.hero.fact, photo_url: c.hero.photo, linkedin_url: c.hero.linkedin })
      out.push(error ? [`profile: gagal (${error.message})`, 'error'] : ['profile: terisi', 'ok'])
    } else out.push(['profile: dilewati (sudah ada isi)', 'skip'])
    for (const [table, data] of Object.entries(rows)) {
      const { count } = await db.from(table).select('*', { count: 'exact', head: true })
      if (count) {
        out.push([`${table}: dilewati (sudah ada ${count} baris)`, 'skip'])
        continue
      }
      const { error } = await db.from(table).insert(data)
      out.push(error ? [`${table}: gagal (${error.message})`, 'error'] : [`${table}: ${data.length} baris terisi`, 'ok'])
    }
    setLog(out)
    setBusy(false)
    onChanged()
    toast(out.some(([, k]) => k === 'error') ? 'Sebagian gagal, lihat daftar.' : 'Impor selesai.', out.some(([, k]) => k === 'error') ? 'error' : 'ok')
  }

  return (
    <div>
      <div className="adm-head">
        <div>
          <h2>Impor data awal</h2>
          <p className="adm-muted">Menyalin konten yang sekarang tampil di situs ke database, supaya bisa Anda ubah dari dashboard. Tabel yang sudah berisi tidak disentuh.</p>
        </div>
      </div>
      <div className="adm-panel adm-seed">
        <DatabaseZap size={32} aria-hidden />
        <button className="adm-btn solid" onClick={run} disabled={busy}>{busy ? 'Mengimpor…' : 'Impor sekarang'}</button>
        {log.length > 0 && (
          <ul className="adm-log">
            {log.map(([text, kind]) => <li key={text} className={kind}>{text}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}
