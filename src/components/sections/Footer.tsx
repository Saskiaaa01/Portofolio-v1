import { navLinks, profile } from '../../data/profile'

export function Footer() {
  return (
    <footer className="wrap foot">
      <span>© 2026 {profile.name}. Semua hak dilindungi.</span>
      <nav>
        {navLinks.map((l) => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
      </nav>
    </footer>
  )
}
