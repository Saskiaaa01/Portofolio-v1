import { focusAreas } from '../../data/profile'
import SpotlightCard from '../reactbits/SpotlightCard'

export function About() {
  return (
    <section id="tentang">
      <div className="wrap split">
        <div className="about">
          <p className="eyebrow">Tentang saya</p>
          <h2>Teliti dulu, <em>baru cepat</em></h2>
          <p>Sebelum kuliah, saya satu tahun empat bulan jadi admin di LPK Jayabaya, Manonjaya. Kerjaan saya mendata siswa baru, merekap uang masuk setiap hari di Excel dan buku kas, dan kadang ikut mengajar siswa baru. Pekerjaan seperti itu menuntut ketelitian, karena satu angka yang salah di rekap kas bisa membuat seluruh laporan tidak cocok.</p>
          <p>Kebiasaan itu yang sekarang saya pakai di dunia software. Di proyek SIPP dan Satu Rumah, saya menguji fitur satu per satu, mencatat kesalahan, dan memastikan setiap fitur berjalan sesuai kebutuhan pengguna.</p>
          <p>Saya kuliah di Universitas Bina Sarana Informatika sejak 2024, dengan IPK 3,89.</p>
        </div>
        <div className="cards">
          {focusAreas.map((f, i) => (
            <SpotlightCard key={f.title} className="sp" theme="light" spotlightColor="#2f7bf5" intensity={0.45}>
              <div className="num">0{i + 1}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
