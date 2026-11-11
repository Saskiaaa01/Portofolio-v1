import { useContent } from '../../lib/content'
import { skillIcon } from '../../lib/skillIcons'
import { CountUp } from '../ui/CountUp'

export function Experience() {
  const { skills, jobs, activities } = useContent()
  return (
    <>
      <section id="keahlian">
        <div className="wrap">
          <div className="skills-panel" data-reveal>
            <p className="eyebrow">Keahlian</p>
            <h2>Yang saya <em>kuasai</em></h2>
            <div className="skgrid">
              {skills.map((s, i) => (
                <div className="sk" key={s.title} data-reveal>
                  <span className="no">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="chips">{s.chips.map((c) => <span key={c}>{skillIcon(c)}{c}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pengalaman">
        <div className="wrap xp-split">
          <div>
            <p className="eyebrow">Pengalaman</p>
            <h2>Dari meja admin ke <em>tim pengembang</em></h2>
          </div>
          <div>
            {jobs.map((j) => (
              <div className="xp-row" key={j.title} data-reveal>
                <div className="yr">{j.year}<small>{j.when}</small></div>
                <div>
                  <h3>{j.title}</h3>
                  <div className="at">{j.at}</div>
                  <p>{j.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pendidikan">
        <div className="wrap edu-split">
          <div className="gpa-card" data-reveal>
            <p className="eyebrow">Indeks prestasi</p>
            <div>
              <b><CountUp to={3.89} decimals={2} /></b>
              <span>dari 4,00 · S1 Sistem Informasi, 2024–2028</span>
            </div>
          </div>
          <div className="edu-copy glass" data-reveal>
            <p className="eyebrow">Pendidikan</p>
            <h3>Universitas Bina Sarana Informatika</h3>
            <p className="meta">Sebelumnya di SMAN 1 Manonjaya, 2020–2023.</p>
            <ul className="acts">
              {activities.map((a) => (
                <li key={a.title}>
                  <b>{a.title}</b>
                  <span>{a.meta}</span>
                  <p>{a.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
