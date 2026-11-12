import { useEffect, useState } from 'react'
import { profile } from '../../data/profile'
import { useContent } from '../../lib/content'

const MIN_MS = 1600 // waktu tampil minimal supaya animasinya terbaca
const MAX_MS = 5000 // batas akhir kalau font atau foto lambat

// Layar pembuka: nama masuk huruf per huruf, progres naik mengikuti font dan foto hero yang benar-benar termuat, lalu tirai terangkat.
// onLeave dipanggil saat tirai mulai naik (situs mulai dipasang di baliknya), onDone setelah tirai hilang.
export function Loader({ onLeave, onDone }: { onLeave: () => void; onDone: () => void }) {
  const { hero } = useContent()
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    let ready = false
    let raf = 0
    let finished = false
    const start = performance.now()

    const photo = new Promise<void>((ok) => {
      const img = new Image()
      img.onload = img.onerror = () => ok()
      img.src = hero.photo
    })
    Promise.all([document.fonts.ready, photo]).then(() => (ready = true))

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      setPct(100)
      setLeaving(true)
      onLeave()
      setTimeout(() => {
        document.documentElement.style.overflow = ''
        onDone()
      }, 900)
    }

    const tick = (t: number) => {
      const p = Math.min((t - start) / MIN_MS, 1)
      // progres naik bersama waktu, tapi tertahan di 90% sampai font dan foto selesai
      setPct((cur) => Math.max(cur, Math.round((ready ? p : Math.min(p, 0.9)) * 100)))
      if (ready && p >= 1) finish()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const guard = setTimeout(finish, MAX_MS) // jaring pengaman, mis. tab di latar sehingga rAF tertahan

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(guard)
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [first, last] = profile.name.split(' ')
  const letters = (word: string, offset: number) =>
    [...word].map((ch, i) => (
      <span key={i} className="ld-ch" style={{ animationDelay: `${(offset + i) * 55}ms` }}>
        {ch}
      </span>
    ))

  return (
    <div className={`loader${leaving ? ' out' : ''}`} role="status" aria-live="polite" aria-label="Memuat portofolio">
      <div className="ld-orb a" />
      <div className="ld-orb b" />
      <div className="ld-center">
        <p className="ld-role">{profile.role}</p>
        <h1 className="ld-name" aria-hidden>
          <span>{letters(first, 0)}</span>
          <em>{letters(last, first.length)}</em>
        </h1>
      </div>
      <div className="ld-foot">
        <span>Memuat portofolio</span>
        <b>{pct}<small>%</small></b>
      </div>
      <i className="ld-bar" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  )
}
