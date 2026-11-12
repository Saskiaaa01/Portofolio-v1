-- Jalankan sekali di Supabase: SQL Editor -> New query -> tempel -> Run.
-- Aman dijalankan ulang.

create table if not exists profile (
  id int primary key default 1 check (id = 1),
  intro text,
  fact text,
  photo_url text,
  linkedin_url text
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  role text,
  text text,
  image_url text,
  tags text[] not null default '{}',
  sort int not null default 0
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  issued_on text,
  text text,
  image_url text,
  sort int not null default 0
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text,
  chips text[] not null default '{}',
  sort int not null default 0
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  year text,
  period text,
  title text not null,
  place text,
  text text,
  image_url text,
  sort int not null default 0
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meta text,
  text text,
  image_url text,
  sort int not null default 0
);

-- Untuk database yang sudah dibuat sebelum kolom foto ada (aman dijalankan ulang)
alter table experiences add column if not exists image_url text;
alter table activities add column if not exists image_url text;

-- Daftar akun yang boleh mengubah konten. Isi email admin lewat SQL Editor (lihat README), jangan di repo.
create table if not exists admins (email text primary key);
alter table admins enable row level security;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

do $$
declare t text;
begin
  foreach t in array array['profile', 'projects', 'certificates', 'skills', 'experiences', 'activities'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "baca publik" on %I', t);
    execute format('create policy "baca publik" on %I for select using (true)', t);
    execute format('drop policy if exists "admin tulis" on %I', t);
    execute format('create policy "admin tulis" on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Penyimpanan gambar (publik dibaca, hanya admin yang mengunggah)
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true) on conflict (id) do nothing;

drop policy if exists "baca gambar publik" on storage.objects;
create policy "baca gambar publik" on storage.objects for select using (bucket_id = 'portfolio');
drop policy if exists "admin unggah gambar" on storage.objects;
create policy "admin unggah gambar" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio' and is_admin());
drop policy if exists "admin ubah gambar" on storage.objects;
create policy "admin ubah gambar" on storage.objects for update to authenticated using (bucket_id = 'portfolio' and is_admin());
drop policy if exists "admin hapus gambar" on storage.objects;
create policy "admin hapus gambar" on storage.objects for delete to authenticated using (bucket_id = 'portfolio' and is_admin());
