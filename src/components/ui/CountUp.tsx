import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const fmt = (n: number, decimals: number) => n.toFixed(decimals).replace('.', ',')

// Angka naik dari 0 setiap section masuk layar, dan kembali ke 0 saat keluar layar sehingga main lagi saat di-scroll ulang
export function CountUp({ to, decimals = 0, duration = 1.8 }: { to: number; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const state = { v: 0 }
    let tween: gsap.core.Tween | undefined
    const show = () => (el.textContent = fmt(state.v, decimals))
    const play = () => {
      tween?.kill()
      state.v = 0
      tween = gsap.to(state, { v: to, duration, ease: 'power3.out', onUpdate: show })
    }
    const reset = () => {
      tween?.kill()
      state.v = 0
      show()
    }
    show()
    const st = ScrollTrigger.create({ trigger: el, start: 'top 85%', end: 'bottom 15%', onEnter: play, onEnterBack: play, onLeave: reset, onLeaveBack: reset })
    return () => {
      st.kill()
      tween?.kill()
      el.textContent = fmt(to, decimals)
    }
  }, [to, decimals, duration])

  return <span ref={ref}>{fmt(to, decimals)}</span>
}
