export const sslguard = {
  title: 'SSLGuard',
  role: 'Saya rancang dan bangun sendiri',
  image: '/images/sslguard.jpg',
  alt: 'Halaman depan SSLGuard dengan daftar domain dan sisa hari sertifikatnya',
  story: [
    ['Masalahnya', 'Sertifikat SSL punya tanggal kedaluwarsa. Kalau lupa diperpanjang, browser langsung menandai situsnya tidak aman dan pengunjung bisa tertahan di halaman peringatan.'],
    ['Yang saya buat', 'Aplikasi web untuk mendaftarkan domain, memeriksa masa berlaku sertifikatnya, dan mengirim pengingat lewat WhatsApp 30, 14, dan 7 hari sebelum habis. Pemeriksaan berjalan otomatis setiap pagi pukul 07.00, setiap alamat domain divalidasi supaya sistem aman dari serangan SSRF, dan semua pemeriksaan serta pengingat tercatat di riwayat.'],
    ['Bagian saya', 'Merancang database, mengembangkan fitur, menguji fungsinya, dan menulis dokumen BRD, SRS, FSD serta buku panduan untuk Admin dan Owner.'],
  ],
  stack: 'Laravel, PHP, database relasional, WhatsApp API',
}

export const reminders = [
  { days: 30, pos: 0, text: 'Pengingat SSLGuard: sertifikat SSL untuk <b>contoh-domain.id</b> akan habis dalam 30 hari. Jadwalkan perpanjangan dari sekarang.' },
  { days: 14, pos: 53, text: 'Pengingat kedua: sertifikat <b>contoh-domain.id</b> tinggal 14 hari lagi dan belum diperpanjang.' },
  { days: 7, pos: 77, text: 'Peringatan terakhir: sertifikat <b>contoh-domain.id</b> habis dalam 7 hari. Segera perpanjang agar situs tetap bisa diakses.' },
]

export const projects = [
  {
    title: 'SSLGuard',
    role: 'Saya rancang dan bangun sendiri',
    image: '/images/sslguard.jpg',
    alt: sslguard.alt,
    text: 'Aplikasi web yang memeriksa masa berlaku sertifikat SSL setiap pagi dan mengirim pengingat lewat WhatsApp sebelum kedaluwarsa.',
    tags: ['Laravel', 'PHP', 'WhatsApp API'],
  },
  {
    title: 'SIPP',
    tags: ['QA', 'Perancangan', 'Pengujian fungsional'],
    role: 'Perancangan dan QA',
    image: '/images/sipp.jpg',
    alt: 'Halaman beranda SIPP berisi pencarian layanan publik',
    text: 'Sistem Informasi Pelayanan Publik, tempat masyarakat menyampaikan pengaduan yang kemudian diteruskan ke Organisasi Perangkat Daerah. Saya ikut merancang sistemnya dan menjadi penguji: memeriksa fungsi tiap fitur, mencatat kesalahan, dan memastikan hasilnya sesuai kebutuhan pengguna.',
  },
  {
    title: 'Satu Rumah',
    tags: ['QA', 'Perancangan', 'Evaluasi kualitas'],
    role: 'Perancangan dan QA',
    image: '/images/satu-rumah.jpg',
    alt: 'Halaman masuk portal verifikator Satu Rumah',
    text: 'Portal untuk memverifikasi berkas teknis dan site plan perumahan, menjadwalkan survei lapangan, sampai menerbitkan Berita Acara secara digital. Saya ikut dalam perancangan, menguji fitur dan fungsinya, menandai bagian yang belum sesuai, dan membantu mengevaluasi kualitas aplikasi berdasarkan kebutuhan yang sudah ditetapkan.',
  },
]

export const certificates = [
  { image: '/images/cert-ai.jpg', alt: 'Sertifikat AI Career Readiness Training atas nama Saskia Syabani', zoom: 'Perbesar sertifikat AI Career Readiness Training', when: '30 September 2026', title: 'AI Career Readiness Training', by: 'ASEAN Foundation, didukung LinkedIn', text: 'Program ASEAN Ahead tentang kesiapan karier di era AI: strategi karier, optimasi profil LinkedIn, CV ramah ATS, dan latihan wawancara dengan bantuan AI.' },
  { image: '/images/cert-db.jpg', alt: 'Sertifikat Database System dari PT Netkrom Solusindo atas nama Saskia Syabani', zoom: 'Perbesar sertifikat Database System', position: 'center 30%', when: '23 Juli 2025', title: 'Database System', by: 'PT Netkrom Solusindo, predikat Menengah', text: 'Lulus ujian yang mencakup model relasional, ERD, normalisasi, SQL (fungsi agregat, join, subquery), DBMS, keamanan basis data, serta backup dan recovery.' },
  { image: '/images/cert-seminar.jpg', alt: 'Sertifikat peserta seminar Acceleration of Information Technology for IT Career', zoom: 'Perbesar sertifikat seminar', when: '21 November 2024', title: 'Acceleration of Information Technology for IT Career', by: 'Prodi Sistem Informasi UBSI', text: 'Peserta seminar di Aula UBSI Kampus Kota Tasikmalaya, bersama pembicara Wahyu Bintoro, S.Psi dan Deddy Supriadi, M.Kom.' },
]

export const skills = [
  { title: 'Quality assurance', text: 'Dipakai untuk menguji SIPP dan Satu Rumah.', chips: ['Pengujian fungsional', 'Pengujian perangkat lunak', 'Identifikasi kesalahan'] },
  { title: 'Basis data', text: 'Merancang struktur database SSLGuard, bersertifikat Database System.', chips: ['SQL', 'Join dan subquery', 'ERD', 'Normalisasi', 'DBMS', 'Backup dan recovery'] },
  { title: 'Pengembangan web', text: 'Membangun SSLGuard dari rancangan sampai jalan.', chips: ['Laravel', 'PHP', 'WhatsApp API', 'Git dan GitHub'] },
  { title: 'Analisis dan administrasi', text: 'Dari kebutuhan pengguna sampai dokumen dan data yang rapi.', chips: ['BRD, SRS, FSD', 'Manual book', 'Pengolahan data', 'Microsoft Excel'] },
]
