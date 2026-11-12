import { useState } from 'react'
import { useContent } from '../../lib/content'
import { MoreButton } from '../ui/MoreButton'

const LIMIT = 3

export function Experience() {
  const { jobs } = useContent()
  const [all, setAll] = useState(false)
  const shown = all ? jobs : jobs.slice(0, LIMIT)

  return (
    <section id="pengalaman">
      <div className="wrap xp-split">
        <div>
          <p className="eyebrow">Pengalaman</p>
          <h2>Dari meja admin ke <em>tim pengembang</em></h2>
        </div>
        <div>
          {shown.map((j) => (
            <div className="xp-row" key={j.title + j.when} data-reveal>
              <div className="yr">{j.year}<small>{j.when}</small></div>
              <div>
                <h3>{j.title}</h3>
                <div className="at">{j.at}</div>
                <p>{j.text}</p>
                {j.image && <img className="photo" src={j.image} alt={`Foto ${j.title}`} loading="lazy" />}
              </div>
            </div>
          ))}
          <MoreButton total={jobs.length} limit={LIMIT} open={all} label="pengalaman" onClick={() => setAll((v) => !v)} />
        </div>
      </div>
    </section>
  )
}
