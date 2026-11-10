import { asset } from '../lib/asset'

export const profile = {
  name: 'Saskia Syabani',
  role: 'QA dan Web Developer',
  intro: 'Saya senang menemukan kesalahan di sebuah sistem sebelum penggunanya yang menemukan.',
  fact: 'Mahasiswa Sistem Informasi di UBSI, angkatan 2024. Sehari-hari saya menguji aplikasi, merancang database, dan membangun web dengan Laravel.',
  photo: asset('images/portrait.jpg'),
  linkedin: 'https://www.linkedin.com/in/saskia-syabani',
  linkedinLabel: 'linkedin.com/in/saskia-syabani',
  stats: [
    { value: '3,89', label: 'IPK dari 4,00' },
    { value: '3', label: 'sistem dikerjakan' },
    { value: '3', label: 'sertifikat' },
    { value: '2', label: 'pengalaman kerja' },
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

export const tools = ['Laravel', 'PHP', 'SQL', 'ERD', 'Git dan GitHub', 'WhatsApp API', 'Pengujian fungsional', 'BRD, SRS, FSD', 'Microsoft Excel']
