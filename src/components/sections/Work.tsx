import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { reminders, sslguard } from '../../data/work'
import { useContent } from '../../lib/content'
import { MoreButton } from '../ui/MoreButton'

const LIMIT = 3

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

export function Work() {
  const { projects } = useContent()
  const [all, setAll] = useState(false)
  const [openCase, setOpenCase] = useState(false)
  const shown = all ? projects : projects.slice(0, LIMIT)

  return (
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
          {shown.map((p, n) => (
            <article className="pcard glass" key={p.title} data-reveal>
              <figure className="shot">
                <img src={p.image} alt={p.alt} loading="lazy" decoding="async" />
                <b>0{n + 1}</b>
              </figure>
              <h3>{p.title}</h3>
              <div className="role">{p.role}</div>
              <p>{p.text}</p>
              <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </article>
          ))}
        </div>
        <MoreButton total={projects.length} limit={LIMIT} open={all} label="proyek" onClick={() => setAll((v) => !v)} />

        {/* studi kasus dilipat supaya halaman tetap ringkas; dibuka kalau pengunjung ingin detail */}
        <div className="case-wrap">
          <button className="case-toggle" aria-expanded={openCase} aria-controls="studi-kasus" onClick={() => setOpenCase((v) => !v)}>
            {openCase ? 'Tutup studi kasus' : `Lihat studi kasus ${sslguard.title}`}
            <ChevronDown size={18} aria-hidden />
          </button>
          <div id="studi-kasus" className={`fold${openCase ? ' open' : ''}`} inert={!openCase}>
            <div className="fold-inner">
              <div className="case glass">
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
          </div>
        </div>
      </div>
    </section>
  )
}
