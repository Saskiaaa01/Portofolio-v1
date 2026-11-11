# Portofolio Saskia Syabani

Vite + React + TypeScript. Konten bisa diubah lewat dashboard di `#/admin` (login + CRUD, data di Supabase).
Tanpa Supabase, situs tetap jalan memakai konten bawaan di `src/data/`.

```bash
npm install
npm run dev      # development
npm run build    # produksi (hasil di dist/)
```

## Menyambungkan dashboard (sekali saja)

1. **Buat proyek Supabase** di supabase.com (gratis). Di *Project Settings → API* salin **Project URL** dan **anon public key**.
2. **Jalankan skema.** *SQL Editor → New query*, tempel isi `supabase/schema.sql`, klik Run.
3. **Daftarkan admin.** Di *Authentication → Users → Add user*, buat akun dengan email dan kata sandi Anda sendiri (centang *Auto Confirm*). Lalu di SQL Editor jalankan:
   ```sql
   insert into admins (email) values ('email-admin-anda@gmail.com');
   ```
4. **Matikan pendaftaran publik.** *Authentication → Sign In / Providers → Email* → matikan *Allow new users to sign up*.
5. **Isi kunci.**
   - Lokal: salin `.env.example` menjadi `.env` lalu isi dua nilainya.
   - GitHub Pages: repo *Settings → Secrets and variables → Actions → New repository secret*, buat `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
6. Buka `/#/admin`, masuk, lalu tekan **Impor data awal** sekali untuk menyalin konten sekarang ke database.

Kunci anon memang publik. Yang melindungi data adalah RLS di `schema.sql`: semua orang boleh membaca, hanya email di tabel `admins` yang boleh menulis.

## Catatan
- Tabel yang kosong = situs memakai konten bawaan. Menghapus semua item tidak mengosongkan bagian itu.
- Studi kasus SSLGuard dan data pendidikan masih ada di kode (`src/data/work.ts`, `Experience.tsx`).
