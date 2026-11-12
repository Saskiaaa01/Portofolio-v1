// Tombol "Lihat semua" yang hanya muncul kalau item melebihi batas, supaya halaman tetap ringkas saat konten bertambah
export function MoreButton({ total, limit, open, label, onClick }: { total: number; limit: number; open: boolean; label: string; onClick: () => void }) {
  if (total <= limit) return null
  return (
    <div className="more">
      <button onClick={onClick} aria-expanded={open}>
        {open ? 'Tampilkan lebih sedikit' : `Lihat semua ${label} (${total})`}
      </button>
    </div>
  )
}
