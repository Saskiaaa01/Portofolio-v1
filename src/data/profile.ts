import { asset } from '../lib/asset'

export const profile = {
  name: 'Saskia Syabani',
  role: 'QA dan Web Developer',
  intro: 'Mahasiswa Sistem Informasi yang berfokus pada quality assurance, basis data, dan pengembangan web.',
  fact: 'Saat ini magang di Diskominfo Kota Tasikmalaya.',
  photo: asset('images/portrait.jpg'),
  linkedin: 'https://www.linkedin.com/in/saskia-syabani',
  linkedinLabel: 'linkedin.com/in/saskia-syabani',
  stats: [
    { to: 3.89, decimals: 2, label: 'IPK dari 4,00' },
    { to: 3, decimals: 0, label: 'sistem dikerjakan' },
    { to: 3, decimals: 0, label: 'sertifikat' },
    { to: 2, decimals: 0, label: 'pengalaman kerja' },
  ],
  idCard: { id: 'ID #SS2024', tag: 'QA · Database · Web' },
}

export const navLinks = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Karya', href: '#proyek' },
  { label: 'Pengalaman', href: '#pengalaman' },
  { label: 'Kontak', href: '#kontak' },
]

export const focusAreas = [
  { title: 'Quality assurance', text: 'Pengujian fungsional, mencari dan mencatat kesalahan, memastikan fitur sesuai kebutuhan pengguna.' },
  { title: 'Basis data', text: 'Merancang struktur tabel dan menulis SQL. Bersertifikat Database System dari PT Netkrom Solusindo.' },
  { title: 'Pengembangan web', text: 'Membangun aplikasi dengan Laravel dan PHP, dari rancangan sampai bisa dipakai.' },
  { title: 'Dokumentasi sistem', text: 'Menulis BRD, SRS, FSD, dan buku panduan pengguna.' },
]

