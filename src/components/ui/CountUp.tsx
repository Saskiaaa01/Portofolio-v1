import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

const fmt = (n: number, decimals: number) => n.toFixed(decimals).replace('.', ',')

// Angka naik dari 0 satu kali saja, saat minimal separuhnya terlihat; setelah itu tetap di angka akhir (tidak reset saat di-scroll).
// IntersectionObserver (bukan posisi scroll) supaya tetap andal di HP: bar alamat yang naik-turun tidak menggeser pemicu.
export function CountUp({ to, decimals = 0, duration = 1.8 }: { to: number; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const state = { v: 0 }
    let tween: gsap.core.Tween | undefined
    let guard: number | undefined
    const show = () => (el.textContent = fmt(state.v, decimals))
    show()
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 0.5) return
        io.disconnect()
        tween = gsap.to(state, { v: to, duration, ease: 'power3.out', onUpdate: show })
        // Jaring pengaman: kalau animasi tersendat (tab di latar, hemat baterai), tetap berakhir di angka akhir
        guard = window.setTimeout(() => tween?.progress(1), duration * 1000 + 700)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(guard)
      tween?.kill()
      el.textContent = fmt(to, decimals)
    }
  }, [to, decimals, duration])

  return <span ref={ref}>{fmt(to, decimals)}</span>
}
