// Daftar bagian konten yang bisa diubah di dashboard. Nama tabel dan kolom harus sama dengan supabase/schema.sql.
export type Field = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'tags' | 'image' | 'number'
  required?: boolean
  hint?: string
}

export type Resource = {
  id: string
  label: string
  table: string
  titleKey: string
  subKey?: string
  fields: Field[]
}

const sort: Field = { key: 'sort', label: 'Urutan', type: 'number', hint: 'Angka kecil tampil lebih dulu' }

export const resources: Resource[] = [
  {
    id: 'proyek',
    label: 'Proyek',
    table: 'projects',
    titleKey: 'title',
    subKey: 'role',
    fields: [
      { key: 'title', label: 'Nama proyek', type: 'text', required: true },
      { key: 'role', label: 'Peran', type: 'text', hint: 'Contoh: Perancangan dan QA' },
      { key: 'text', label: 'Deskripsi', type: 'textarea' },
      { key: 'image_url', label: 'Gambar', type: 'image' },
      { key: 'tags', label: 'Tag', type: 'tags', hint: 'Pisahkan dengan koma: Laravel, PHP' },
      sort,
    ],
  },
  {
    id: 'sertifikat',
    label: 'Sertifikat',
    table: 'certificates',
    titleKey: 'title',
    subKey: 'issued_on',
    fields: [
      { key: 'title', label: 'Nama sertifikat', type: 'text', required: true },
      { key: 'issuer', label: 'Penerbit', type: 'text' },
      { key: 'issued_on', label: 'Tanggal', type: 'text', hint: 'Contoh: 30 September 2026' },
      { key: 'text', label: 'Deskripsi', type: 'textarea' },
      { key: 'image_url', label: 'Gambar sertifikat', type: 'image' },
      sort,
    ],
  },
  {
    id: 'keahlian',
    label: 'Keahlian',
    table: 'skills',
    titleKey: 'title',
    fields: [
      { key: 'title', label: 'Kelompok keahlian', type: 'text', required: true },
      { key: 'text', label: 'Keterangan', type: 'textarea' },
      { key: 'chips', label: 'Daftar keahlian', type: 'tags', hint: 'Pisahkan dengan koma. Ikon otomatis muncul untuk SQL, Laravel, PHP, Git, dll.' },
      sort,
    ],
  },
  {
    id: 'pengalaman',
    label: 'Pengalaman',
    table: 'experiences',
    titleKey: 'title',
    subKey: 'place',
    fields: [
      { key: 'title', label: 'Posisi', type: 'text', required: true },
      { key: 'place', label: 'Tempat', type: 'text' },
      { key: 'year', label: 'Tahun (tampil besar)', type: 'text', hint: 'Contoh: 2026' },
      { key: 'period', label: 'Periode', type: 'text', hint: 'Contoh: Agustus–November 2026' },
      { key: 'text', label: 'Tugas dan hasil', type: 'textarea' },
      sort,
    ],
  },
  {
    id: 'kegiatan',
    label: 'Kegiatan',
    table: 'activities',
    titleKey: 'title',
    subKey: 'meta',
    fields: [
      { key: 'title', label: 'Peran kegiatan', type: 'text', required: true },
      { key: 'meta', label: 'Acara dan waktu', type: 'text', hint: 'Contoh: BSI Flash, Juni 2025' },
      { key: 'text', label: 'Deskripsi', type: 'textarea' },
      sort,
    ],
  },
]

export const profileFields: Field[] = [
  { key: 'intro', label: 'Kalimat pembuka (hero)', type: 'textarea', hint: 'Satu kalimat singkat di bawah nama' },
  { key: 'fact', label: 'Keterangan singkat (hero)', type: 'textarea' },
  { key: 'photo_url', label: 'Foto profil', type: 'image' },
  { key: 'linkedin_url', label: 'Tautan LinkedIn', type: 'text' },
]
