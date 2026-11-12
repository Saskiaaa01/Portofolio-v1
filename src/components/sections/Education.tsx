import { useEffect, useState } from 'react'
import { profile } from '../../data/profile'
import { useContent, type Certificate } from '../../lib/content'
import { CountUp } from '../ui/CountUp'
import { MoreButton } from '../ui/MoreButton'

const ACT_LIMIT = 3
const CERT_LIMIT = 4

export function Education() {
  const { activities, certificates } = useContent()
  const [allActs, setAllActs] = useState(false)
  const [allCerts, setAllCerts] = useState(false)
  const [zoom, setZoom] = useState<Certificate>()
  const acts = allActs ? activities : activities.slice(0, ACT_LIMIT)
  const certs = allCerts ? certificates : certificates.slice(0, CERT_LIMIT)

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(undefined)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [zoom])

  return (
    <>
      <section id="pendidikan">
        <div className="wrap edu-split">
          <div className="gpa-card" data-reveal>
            <p className="eyebrow">Indeks prestasi</p>
            <div>
              <b><CountUp to={profile.gpa} decimals={2} /></b>
              <span>dari 4,00 · S1 Sistem Informasi, 2024–2028</span>
            </div>
          </div>
          <div className="edu-copy glass" data-reveal>
            <p className="eyebrow">Pendidikan</p>
            <h3>Universitas Bina Sarana Informatika</h3>
            <p className="meta">Sebelumnya di SMAN 1 Manonjaya, 2020–2023.</p>
            <ul className="acts">
              {acts.map((a) => (
                <li key={a.title + a.meta}>
                  <b>{a.title}</b>
                  <span>{a.meta}</span>
                  <p>{a.text}</p>
                  {a.image && <img className="photo" src={a.image} alt={`Foto ${a.title}`} loading="lazy" />}
                </li>
              ))}
            </ul>
            <MoreButton total={activities.length} limit={ACT_LIMIT} open={allActs} label="kegiatan" onClick={() => setAllActs((v) => !v)} />
          </div>
        </div>
      </section>

      <section id="sertifikat">
        <div className="wrap">
          <div className="head" data-reveal>
            <div>
              <p className="eyebrow">Kredensial</p>
              <h2>Sertifikat dan <em>pelatihan</em></h2>
            </div>
            <p>Klik untuk melihat sertifikatnya.</p>
          </div>
          <div className="certlist">
            {certs.map((c) => (
              <button className="cert-row glass" key={c.title} aria-label={c.zoom} onClick={() => setZoom(c)}>
                <img src={c.image} alt="" loading="lazy" decoding="async" style={c.position ? { objectPosition: c.position } : undefined} />
                <span>
                  <em>{c.when}</em>
                  <b>{c.title}</b>
                  <small>{c.by}</small>
                </span>
              </button>
            ))}
          </div>
          <MoreButton total={certificates.length} limit={CERT_LIMIT} open={allCerts} label="sertifikat" onClick={() => setAllCerts((v) => !v)} />
        </div>
      </section>

      <div className="lb" hidden={!zoom} onClick={(e) => e.target === e.currentTarget && setZoom(undefined)}>
        <button className="lb-x" aria-label="Tutup" onClick={() => setZoom(undefined)}>Tutup</button>
        {zoom && (
          <figure>
            <img src={zoom.image} alt={zoom.alt} />
            <figcaption>
              <b>{zoom.title}</b>
              <span>{zoom.by} · {zoom.when}</span>
              <p>{zoom.text}</p>
            </figcaption>
          </figure>
        )}
      </div>
    </>
  )
}
