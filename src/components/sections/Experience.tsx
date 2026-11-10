import { activities, jobs } from '../../data/journey'
import { skills } from '../../data/work'

export function Experience() {
  return (
    <section id="pengalaman">
      <div className="wrap trio">
        <div className="panel glass">
          <p className="eyebrow">Keahlian</p>
          {skills.map((s) => (
            <div className="sk" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
            </div>
          ))}
        </div>

        <div className="panel glass">
          <p className="eyebrow">Pengalaman</p>
          <ol className="timeline">
            {jobs.map((j) => (
              <li key={j.title}>
                <div className="when">{j.when}</div>
                <h3>{j.title}</h3>
                <div className="at">{j.at}</div>
                <p>{j.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="panel glass">
          <p className="eyebrow">Pendidikan</p>
          <div className="edu">
            <h3>Universitas Bina Sarana Informatika</h3>
            <p>S1 Sistem Informasi, 2024–2028</p>
            <span className="gpa">IPK 3,89 dari 4,00</span>
            <p>Sebelumnya di SMAN 1 Manonjaya, 2020–2023.</p>
          </div>
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
  )
}
