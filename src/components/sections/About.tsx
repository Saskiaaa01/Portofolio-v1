import { focus } from '../../data/profile'

export function About() {
  return (
    <section id="tentang">
      <div className="wrap split">
        <div data-reveal>
          <p className="eyebrow">Tentang saya</p>
          <h2>Teliti dulu, <em>baru cepat</em></h2>
        </div>
        <div className="about" data-reveal>
          <p>Sebelum kuliah, saya satu tahun empat bulan jadi admin di LPK Jayabaya, Manonjaya. Kerjaan saya mendata siswa baru, merekap uang masuk setiap hari di Excel dan buku kas, dan kadang ikut mengajar siswa baru. Pekerjaan seperti itu menuntut ketelitian, karena satu angka yang salah di rekap kas bisa membuat seluruh laporan tidak cocok.</p>
          <p>Kebiasaan itu yang sekarang saya pakai di dunia software. Di proyek SIPP dan Satu Rumah, saya menguji fitur satu per satu, mencatat kesalahan, dan memastikan setiap fitur berjalan sesuai kebutuhan pengguna.</p>
          <ul className="focus-line" aria-label="Bidang fokus">
            {focus.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
