import { useState, type CSSProperties } from 'react'
import { useContent } from '../../lib/content'
import { categoryIcon, fallbackIcon, skillIcon } from '../../lib/skillIcons'

const ROW = 132 // tinggi satu baris kategori pada peta (px)

// Peta keahlian: "Keahlian" di tengah, jalur mengalir ke kelompok di kiri-kanan.
// Isi kelompok baru muncul saat kelompoknya diklik, jadi halaman tetap ringkas berapa pun keahlian yang ditambah.
export function Skills() {
  const { skills } = useContent()
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  if (skills.length === 0) return null

  const leftCount = Math.ceil(skills.length / 2)
  const rightCount = skills.length - leftCount
  const H = Math.max(leftCount, rightCount, 2) * ROW
  const cur = skills[Math.min(active, skills.length - 1)]

  const place = (i: number) => {
    const left = i < leftCount
    const idx = left ? i : i - leftCount
    const count = left ? leftCount : rightCount
    return { left, y: ((idx + 0.5) / count) * H }
  }
  const path = (i: number) => {
    const { left, y } = place(i)
    return `M500 ${H / 2} C ${left ? '390' : '610'} ${H / 2}, ${left ? '330' : '670'} ${y}, ${left ? 250 : 750} ${y}`
  }
  const pick = (i: number) => {
    if (open && active === i) return setOpen(false)
    setActive(i)
    setOpen(true)
  }

  return (
    <section id="keahlian">
      <div className="wrap">
        <div className="skills-panel" data-reveal>
          <p className="eyebrow">Keahlian</p>
          <h2>Yang saya <em>kuasai</em></h2>

          <div className="sk-map" style={{ '--h': `${H}px` } as CSSProperties}>
            <svg className="sk-lines" viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" aria-hidden>
              {skills.map((s, i) => (
                <path key={s.title} d={path(i)} className={open && active === i ? 'on' : ''} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>

            <div className="sk-hub">
              <b>Keahlian</b>
              <small>{open ? 'Klik lagi untuk menutup' : 'Pilih satu kelompok'}</small>
            </div>

            {skills.map((s, i) => {
              const { left, y } = place(i)
              return (
                <button
                  key={s.title}
                  className={`sk-node ${left ? 'l' : 'r'}${open && active === i ? ' on' : ''}`}
                  style={{ '--y': `${y}px` } as CSSProperties}
                  aria-expanded={open && active === i}
                  aria-controls="sk-detail"
                  onClick={() => pick(i)}
                >
                  <span className="sk-ico">{categoryIcon(s.title)}</span>
                  <span className="sk-name">
                    <b>{s.title}</b>
                    <small>{s.chips.length} keahlian</small>
                  </span>
                </button>
              )
            })}
          </div>

          <div id="sk-detail" className={`fold${open ? ' open' : ''}`} inert={!open}>
            <div className="fold-inner">
              <div className="sk-detail" key={active}>
                <p>{cur.text}</p>
                <div className="sk-grid">
                  {cur.chips.map((c, n) => (
                    <div className="sk-tile" key={c} style={{ '--i': n } as CSSProperties}>
                      <span className="sk-ico">{skillIcon(c) ?? fallbackIcon}</span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
