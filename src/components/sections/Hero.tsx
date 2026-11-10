import { navLinks, profile } from '../../data/profile'
import SplitText from '../reactbits/SplitText'
import StaggeredMenu from '../reactbits/StaggeredMenu'

function Navbar() {
  return (
    <div className="wrap">
      <header className="nav glass">
        <a className="brand" href="#top" aria-label={profile.name}>
          <i>SS</i>
          <span>{profile.name}</span>
        </a>
        <nav>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a className="btn solid" href="#kontak">Hubungi saya ↗</a>
      </header>

      {/* di HP: menu geser dari samping (React Bits StaggeredMenu) */}
      <div className="hidden max-[860px]:block">
        <StaggeredMenu
          isFixed
          displayItemNumbering={false}
          logoText={profile.name}
          items={navLinks.map((l) => ({ label: l.label, link: l.href, ariaLabel: `Ke bagian ${l.label}` }))}
          socialItems={[{ label: 'LinkedIn', link: profile.linkedin }]}
          colors={['#0d1626', '#2f7bf5']}
          accentColor="#2f7bf5"
          menuButtonColor="#0d1626"
          openMenuButtonColor="#ffffff"
        />
      </div>
    </div>
  )
}

export function Hero() {
  const [first, last] = profile.name.split(' ')
  return (
    <header id="top">
      <Navbar />
      <div className="wrap hero">
        <div>
          <p className="eyebrow">{profile.role}</p>
          <h1 aria-label={profile.name}>
            <SplitText text={first} tag="span" textAlign="left" effect="rise" trigger="load" />
            <SplitText text={last} tag="span" textAlign="left" effect="rise" trigger="load" delay={0.35} />
          </h1>
          <p className="lede">{profile.intro}</p>
          <p className="fact">{profile.fact}</p>
          <div className="actions">
            <a className="btn solid" href="#proyek">Lihat proyek ↗</a>
            <a className="btn line" href={profile.linkedin} target="_blank" rel="noopener noreferrer">Buka LinkedIn</a>
          </div>
          <div className="statbar glass">
            {profile.stats.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-photo">
          <img src={profile.photo} alt={`Foto ${profile.name}`} />
          <div className="chip chip-top glass"><i />Terbuka untuk<br />posisi QA &amp; web</div>
          <div className="chip glass"><i />Teliti dulu,<br />baru cepat</div>
        </div>
      </div>
    </header>
  )
}
