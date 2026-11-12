import { useEffect, useState } from 'react'
import { navLinks, profile } from '../../data/profile'
import { useContent } from '../../lib/content'
import { CountUp } from '../ui/CountUp'
import SplitText from '../reactbits/SplitText'
import StaggeredMenu from '../reactbits/StaggeredMenu'

function Navbar() {
  const { hero } = useContent()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(scrollY > 16)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <div className="wrap">
      <header className="nav glass">
        <a className="brand" href="#top" aria-label={profile.name}>
          {profile.name}
        </a>
        <nav>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a className="btn solid" href="#kontak">Hubungi saya ↗</a>
      </header>

      {/* di HP: bar latar di belakang menu agar teks yang di-scroll tidak bertabrakan dengan logo; muncul setelah scroll */}
      <div className={`mbar${scrolled ? ' on' : ''}`} aria-hidden />

      {/* di HP: menu geser dari samping (React Bits StaggeredMenu) */}
      <div className="hidden max-[860px]:block">
        <StaggeredMenu
          isFixed
          displayItemNumbering={false}
          logoText={profile.name}
          items={navLinks.map((l) => ({ label: l.label, link: l.href, ariaLabel: `Ke bagian ${l.label}` }))}
          socialItems={[{ label: 'LinkedIn', link: hero.linkedin }]}
          colors={['#0d1626', '#2f7bf5']}
          accentColor="#2f7bf5"
          menuButtonColor="#0d1626"
          openMenuButtonColor="#0d1626"
        />
      </div>
    </div>
  )
}

export function Hero() {
  const { hero, projects, certificates, jobs } = useContent()
  const stats = [
    { to: profile.gpa, decimals: 2, label: 'IPK dari 4,00' },
    { to: projects.length, decimals: 0, label: 'sistem dikerjakan' },
    { to: certificates.length, decimals: 0, label: 'sertifikat' },
    { to: jobs.length, decimals: 0, label: 'pengalaman kerja' },
  ]
  const [first, last] = profile.name.split(' ')
  return (
    <header id="top">
      <Navbar />
      <div className="wrap hero">
        <div>
          <p className="eyebrow" data-reveal>{profile.role}</p>
          <h1 aria-label={profile.name}>
            <SplitText text={first} tag="span" textAlign="left" effect="rise" trigger="load" />
            <SplitText text={last} tag="span" textAlign="left" effect="rise" trigger="load" delay={0.35} />
          </h1>
          <p className="lede" data-reveal>{hero.intro}</p>
          <div className="actions" data-reveal>
            <a className="btn solid" href="#proyek">Lihat proyek ↗</a>
            <a className="btn line" href={hero.linkedin} target="_blank" rel="noopener noreferrer">Buka LinkedIn</a>
          </div>
          <div className="statbar glass" data-reveal>
            {stats.map((s) => (
              <div key={s.label}>
                <b><CountUp to={s.to} decimals={s.decimals} /></b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-photo">
          <img src={hero.photo} alt={`Foto ${profile.name}`} fetchPriority="high" decoding="async" />
          <div className="chip chip-top glass">Terbuka untuk<br />posisi QA &amp; web</div>
          <div className="chip glass">Teliti dulu,<br />baru cepat</div>
        </div>
      </div>
    </header>
  )
}
