import { ArrowUpRight, Award, Briefcase, DatabaseZap, FolderKanban, LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen, Sparkles, UserRound, Users } from 'lucide-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import '../../styles/admin.css'
import { CountUp } from '../ui/CountUp'
import { ProfileEditor } from './ProfileEditor'
import { ResourceEditor } from './ResourceEditor'
import { Seed } from './Seed'
import { ToastProvider } from './Toast'
import { resources } from './resources'

const siteUrl = () => location.pathname + location.search

const resourceIcons: Record<string, ReactNode> = {
  proyek: <FolderKanban size={18} aria-hidden />,
  sertifikat: <Award size={18} aria-hidden />,
  keahlian: <Sparkles size={18} aria-hidden />,
  pengalaman: <Briefcase size={18} aria-hidden />,
  kegiatan: <Users size={18} aria-hidden />,
}

function Setup() {
  return (
    <main className="adm-center">
      <div className="adm-panel">
        <h1>Dashboard belum tersambung</h1>
        <p className="adm-muted">Situs ini membutuhkan proyek Supabase untuk login dan penyimpanan data. Ikuti langkah di README.md, lalu isi <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>.</p>
        <a className="adm-btn" href={siteUrl()}>Kembali ke situs</a>
      </div>
    </main>
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
    <main className="adm-auth">
      <section className="adm-auth-art">
        <span className="adm-orb a" />
        <span className="adm-orb b" />
        <p>Dashboard</p>
        <h1>Kelola portofolio <em>dengan tenang.</em></h1>
        <small>Ubah proyek, sertifikat, dan keahlian tanpa menyentuh kode.</small>
      </section>
      <form className="adm-auth-form" onSubmit={submit}>
        <h2>Masuk</h2>
        <p className="adm-muted">Khusus pemilik portofolio.</p>
        <div className="adm-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="adm-field">
          <label htmlFor="password">Kata sandi</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="adm-error" role="alert">{error}</p>}
        <button className="adm-btn solid wide" disabled={busy}>{busy ? 'Masuk…' : 'Masuk'}</button>
        <a className="adm-back" href={siteUrl()}>← Kembali ke situs</a>
      </form>
    </main>
  )
}

type Tab = 'ringkasan' | 'profil' | 'impor' | string

const greeting = () => {
  const h = new Date().getHours()
  return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam'
}

function Overview({ counts, go }: { counts: Record<string, number>; go: (t: Tab) => void }) {
  return (
    <div>
      <div className="adm-hello">
        <p>{greeting()},</p>
        <h1>Saskia <em>Syabani</em></h1>
        <span>Pilih bagian yang ingin Anda ubah. Perubahan langsung tampil di situs setelah di-refresh.</span>
      </div>
      <div className="adm-stats">
        {resources.map((r, i) => (
          <button key={r.id} className="adm-stat" style={{ '--i': i } as React.CSSProperties} onClick={() => go(r.id)}>
            <span className="ic">{resourceIcons[r.id]}</span>
            <b><CountUp to={counts[r.id] ?? 0} /></b>
            <span>{r.label}</span>
            <ArrowUpRight className="go" size={18} aria-hidden />
          </button>
        ))}
      </div>
      <div className="adm-quick">
        <h3>Aksi cepat</h3>
        <div className="adm-actions">
          <button className="adm-btn" onClick={() => go('profil')}><UserRound size={16} aria-hidden /> Ubah profil</button>
          <button className="adm-btn" onClick={() => go('proyek')}><FolderKanban size={16} aria-hidden /> Kelola proyek</button>
          <button className="adm-btn" onClick={() => go('sertifikat')}><Award size={16} aria-hidden /> Kelola sertifikat</button>
          <button className="adm-btn" onClick={() => go('impor')}><DatabaseZap size={16} aria-hidden /> Impor data awal</button>
        </div>
        <p className="adm-muted">Bagian yang masih kosong memakai konten bawaan situs, jadi tidak ada yang rusak sebelum Anda mengisinya.</p>
      </div>
    </div>
  )
}

function Dashboard({ db, session }: { db: SupabaseClient; session: Session }) {
  const [tab, setTab] = useState<Tab>('ringkasan')
  const [admin, setAdmin] = useState<boolean | undefined>()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [mini, setMini] = useState(() => localStorage.getItem('adm-mini') === '1')
  const toggleMini = () => setMini((v) => (localStorage.setItem('adm-mini', v ? '0' : '1'), !v))

  const loadCounts = useCallback(async () => {
    const res = await Promise.all(resources.map((r) => db.from(r.table).select('*', { count: 'exact', head: true })))
    setCounts(Object.fromEntries(resources.map((r, i) => [r.id, res[i].count ?? 0])))
  }, [db])

  useEffect(() => {
    db.rpc('is_admin').then(({ data }) => setAdmin(Boolean(data)))
  }, [db])
  useEffect(() => {
    if (admin) loadCounts()
  }, [admin, loadCounts])

  const logout = () => db.auth.signOut()

  if (admin === undefined) return <main className="adm-center"><p className="adm-muted">Memeriksa akses…</p></main>
  if (!admin) {
    return (
      <main className="adm-center">
        <div className="adm-panel">
          <h1>Akun ini bukan admin</h1>
          <p className="adm-muted">Email {session.user.email} belum didaftarkan di tabel <code>admins</code>. Lihat README.md langkah 3.</p>
          <button className="adm-btn" onClick={logout}>Keluar</button>
        </div>
      </main>
    )
  }

  const nav: { id: Tab; label: string; icon: ReactNode; count?: number }[] = [
    { id: 'ringkasan', label: 'Ringkasan', icon: <LayoutDashboard size={18} aria-hidden /> },
    { id: 'profil', label: 'Profil', icon: <UserRound size={18} aria-hidden /> },
    ...resources.map((r) => ({ id: r.id, label: r.label, icon: resourceIcons[r.id], count: counts[r.id] })),
    { id: 'impor', label: 'Impor data awal', icon: <DatabaseZap size={18} aria-hidden /> },
  ]
  const current = resources.find((r) => r.id === tab)

  return (
    <ToastProvider>
      <div className={`adm-app${mini ? ' mini' : ''}`}>
        <aside className="adm-side">
          <div className="adm-brand">
            <i>S</i>
            <div>
              <b>Saskia</b>
              <span>Dashboard</span>
            </div>
          </div>
          <nav aria-label="Bagian dashboard">
            {nav.map((n, i) => (
              <button key={n.id} title={n.label} aria-label={n.label} style={{ '--i': i } as React.CSSProperties} className={tab === n.id ? 'on' : ''} aria-current={tab === n.id ? 'page' : undefined} onClick={() => setTab(n.id)}>
                {n.icon}
                <span>{n.label}</span>
                {n.count !== undefined && <em>{n.count}</em>}
              </button>
            ))}
          </nav>
          <div className="adm-user">
            <span title={session.user.email ?? ''}>{session.user.email}</span>
            <button onClick={logout} title="Keluar" aria-label="Keluar"><LogOut size={16} aria-hidden /> <span>Keluar</span></button>
          </div>
        </aside>

        <main className="adm-main">
          <div className="adm-bar">
            <div className="adm-crumb">
              <button className="adm-icon mini-toggle" onClick={toggleMini} aria-label={mini ? 'Perbesar sidebar' : 'Kecilkan sidebar'} title={mini ? 'Perbesar sidebar' : 'Kecilkan sidebar'}>
                {mini ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
              <span>{nav.find((n) => n.id === tab)?.label}</span>
            </div>
            <a className="adm-btn" href={siteUrl()} target="_blank" rel="noopener noreferrer">Lihat situs <ArrowUpRight size={16} aria-hidden /></a>
          </div>
          <div className="adm-view" key={tab}>
            {tab === 'ringkasan' && <Overview counts={counts} go={setTab} />}
            {tab === 'profil' && <ProfileEditor db={db} />}
            {tab === 'impor' && <Seed db={db} onChanged={loadCounts} />}
            {current && <ResourceEditor key={current.id} db={db} resource={current} icon={resourceIcons[current.id]} onChanged={loadCounts} />}
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}

function Gate({ db }: { db: SupabaseClient }) {
  const [session, setSession] = useState<Session | null | undefined>()

  useEffect(() => {
    db.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = db.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [db])

  if (session === undefined) return <main className="adm-center"><p className="adm-muted">Memuat…</p></main>
  return session ? <Dashboard db={db} session={session} /> : <Login db={db} />
}

export default function Admin() {
  return supabase ? <Gate db={supabase} /> : <Setup />
}
