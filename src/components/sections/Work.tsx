import { useEffect, useState } from 'react'
import { useContent } from '../../lib/content'
import { reminders, sslguard } from '../../data/work'

function ReminderSim() {
  const [i, setI] = useState(0)
  const cur = reminders[i]
  return (
    <div className="sim" aria-label="Contoh pengingat SSLGuard">
      <h4>Coba lihat pengingatnya</h4>
      <p>Pilih salah satu titik untuk melihat pesan yang dikirim SSLGuard.</p>
      <div className="track">
        <div className="fill" style={{ width: `${cur.pos}%` }} />
        {reminders.map((r, n) => (
          <button
            key={r.days}
            className={`pin${r.pos <= cur.pos ? ' on' : ''}`}
            style={{ left: `${r.pos}%` }}
            aria-label={`Pengingat H-${r.days}`}
            aria-pressed={n === i}
            onClick={() => setI(n)}
          >
            <span>H-{r.days}</span>
          </button>
        ))}
      </div>
      <div className="ends"><span>30 hari lagi</span><span>Kedaluwarsa</span></div>
      <div className="bubble" aria-live="polite">
        <span dangerouslySetInnerHTML={{ __html: cur.text }} />
        <small>WhatsApp · dikirim otomatis</small>
      </div>
    </div>
  )
}

// Tampil 3 item (sebaris); sisanya muncul lewat tombol "Lihat semua" supaya halaman tidak memanjang saat item bertambah
const LIMIT = 3

function MoreButton({ total, open, label, onClick }: { total: number; open: boolean; label: string; onClick: () => void }) {
  if (total <= LIMIT) return null
  return (
    <div className="more">
      <button onClick={onClick} aria-expanded={open}>
        {open ? 'Tampilkan lebih sedikit' : `Lihat semua ${label} (${total})`}
      </button>
    </div>
  )
}

export function Work() {
  const { projects, certificates } = useContent()
  const [zoom, setZoom] = useState<{ src: string; alt: string }>()
  const [allProjects, setAllProjects] = useState(false)
  const [allCerts, setAllCerts] = useState(false)
  const shownProjects = allProjects ? projects : projects.slice(0, LIMIT)
  const shownCerts = allCerts ? certificates : certificates.slice(0, LIMIT)

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(undefined)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [zoom])

  return (
    <>
      <section id="proyek">
        <div className="wrap">
          <div className="head" data-reveal>
            <div>
              <p className="eyebrow">Proyek pilihan</p>
              <h2>Sistem yang saya <em>kerjakan</em></h2>
            </div>
            <p>Satu dibangun sendiri, dua lainnya bersama tim dengan peran perancangan dan QA.</p>
          </div>
          <div className="projects">
            {shownProjects.map((p, n) => (
              <article className="pcard glass" key={p.title} data-reveal>
                <figure className="shot">
                  <img src={p.image} alt={p.alt} />
                  <b>0{n + 1}</b>
                </figure>
                <h3>{p.title}</h3>
                <div className="role">{p.role}</div>
                <p>{p.text}</p>
                <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              </article>
            ))}
          </div>

          <MoreButton total={projects.length} open={allProjects} label="proyek" onClick={() => setAllProjects((v) => !v)} />

          <div className="case glass" data-reveal>
            <div>
              <p className="eyebrow">Studi kasus · {sslguard.title}</p>
              <h2>Dari masalah <em>ke solusi</em></h2>
              <dl className="story">
                {sslguard.story.map(([dt, dd]) => (
                  <div key={dt}>
                    <dt>{dt}</dt>
                    <dd>{dd}</dd>
                  </div>
                ))}
              </dl>
              <p className="stack"><b>Dibuat dengan</b>{sslguard.stack}</p>
            </div>
            <ReminderSim />
          </div>
        </div>
      </section>

      <section id="sertifikat">
        <div className="wrap">
          <div className="head" data-reveal>
            <div>
              <p className="eyebrow">Sertifikat</p>
              <h2>Bukti <em>belajar</em></h2>
            </div>
            <p>Klik gambar untuk memperbesar.</p>
          </div>
          <div className="certs">
            {shownCerts.map((c) => (
              <div className="cert glass" key={c.title} data-reveal>
                <button className="thumb" aria-label={c.zoom} onClick={() => setZoom({ src: c.image, alt: c.alt })}>
                  <img src={c.image} alt={c.alt} style={c.position ? { objectPosition: c.position } : undefined} />
                </button>
                <div className="when">{c.when}</div>
                <h3>{c.title}</h3>
                <div className="by">{c.by}</div>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
          <MoreButton total={certificates.length} open={allCerts} label="sertifikat" onClick={() => setAllCerts((v) => !v)} />
        </div>
      </section>

      <div className="lb" hidden={!zoom} onClick={(e) => e.target === e.currentTarget && setZoom(undefined)}>
        <button className="lb-x" aria-label="Tutup" onClick={() => setZoom(undefined)}>Tutup</button>
        {zoom && <img src={zoom.src} alt={zoom.alt} />}
      </div>
    </>
  )
}
