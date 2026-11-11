import { useEffect, useState } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import '../../styles/admin.css'
import { ProfileEditor } from './ProfileEditor'
import { ResourceEditor } from './ResourceEditor'
import { Seed } from './Seed'
import { resources } from './resources'

const siteUrl = () => location.pathname + location.search

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="adm"><div className="adm-wrap">{children}</div></main>
}

function Setup() {
  return (
    <Shell>
      <div className="adm-card">
        <h1>Dashboard belum tersambung</h1>
        <p className="adm-muted">Situs ini membutuhkan proyek Supabase untuk login dan penyimpanan data. Ikuti langkah di README.md, lalu isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>.</p>
        <a className="adm-btn" href={siteUrl()}>Kembali ke situs</a>
      </div>
    </Shell>
  )
}

function Login({ db }: { db: SupabaseClient }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await db.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) setError(err.message === 'Invalid login credentials' ? 'Email atau kata sandi salah.' : err.message)
  }

  return (
    <Shell>
      <form className="adm-card adm-login" onSubmit={submit}>
        <h1>Masuk dashboard</h1>
        <p className="adm-muted">Khusus pemilik portofolio.</p>
        <div className="adm-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="password">Kata sandi</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="adm-error">{error}</p>}
        <button className="adm-btn solid" disabled={busy}>{busy ? 'Masuk…' : 'Masuk'}</button>
        <a className="adm-back" href={siteUrl()}>← Kembali ke situs</a>
      </form>
    </Shell>
  )
}

type Tab = 'profil' | 'impor' | (typeof resources)[number]['id']

function Dashboard({ db, session }: { db: SupabaseClient; session: Session }) {
  const [tab, setTab] = useState<Tab>('profil')
  const [admin, setAdmin] = useState<boolean | undefined>()

  useEffect(() => {
    db.rpc('is_admin').then(({ data }) => setAdmin(Boolean(data)))
  }, [db])

  const logout = () => db.auth.signOut()

  if (admin === undefined) return <Shell><p className="adm-muted">Memeriksa akses…</p></Shell>
  if (!admin) {
    return (
      <Shell>
        <div className="adm-card">
          <h1>Akun ini bukan admin</h1>
          <p className="adm-muted">Email {session.user.email} belum didaftarkan di tabel <code>admins</code>. Lihat README.md langkah 3.</p>
          <button className="adm-btn" onClick={logout}>Keluar</button>
        </div>
      </Shell>
    )
  }

  const tabs: [Tab, string][] = [['profil', 'Profil'], ...resources.map((r): [Tab, string] => [r.id, r.label]), ['impor', 'Impor data awal']]
  const current = resources.find((r) => r.id === tab)

  return (
    <Shell>
      <header className="adm-top">
        <div>
          <b>Dashboard</b>
          <span>{session.user.email}</span>
        </div>
        <div className="adm-actions">
          <a className="adm-btn" href={siteUrl()}>Lihat situs ↗</a>
          <button className="adm-btn" onClick={logout}>Keluar</button>
        </div>
      </header>
      <div className="adm-body">
        <nav className="adm-tabs" aria-label="Bagian konten">
          {tabs.map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} aria-current={tab === id} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>
        <section className="adm-card">
          {tab === 'profil' && <ProfileEditor db={db} />}
          {tab === 'impor' && <Seed db={db} />}
          {current && <ResourceEditor key={current.id} db={db} resource={current} />}
        </section>
      </div>
    </Shell>
  )
}

function Gate({ db }: { db: SupabaseClient }) {
  const [session, setSession] = useState<Session | null | undefined>()

  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [db])

  if (session === undefined) return <Shell><p className="adm-muted">Memuat…</p></Shell>
  return session ? <Dashboard db={db} session={session} /> : <Login db={db} />
}

export default function Admin() {
  return supabase ? <Gate db={supabase} /> : <Setup />
}
