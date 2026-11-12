import { asset } from '../lib/asset'

export const profile = {
  name: 'Saskia Syabani',
  role: 'QA dan Web Developer',
  intro: 'Mahasiswa Sistem Informasi yang berfokus pada quality assurance, basis data, dan pengembangan web.',
  photo: asset('images/portrait.jpg'),
  linkedin: 'https://www.linkedin.com/in/saskia-syabani',
  linkedinLabel: 'linkedin.com/in/saskia-syabani',
  gpa: 3.89,
  idCard: { id: 'ID #SS2024', tag: 'QA · Database · Web' },
}

export const navLinks = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Keahlian', href: '#keahlian' },
  { label: 'Proyek', href: '#proyek' },
  { label: 'Pengalaman', href: '#pengalaman' },
  { label: 'Kontak', href: '#kontak' },
]

export const focus = ['Quality assurance', 'Basis data', 'Pengembangan web', 'Dokumentasi sistem']

