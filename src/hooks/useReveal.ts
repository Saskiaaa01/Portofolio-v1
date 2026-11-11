import { useGSAP } from '@gsap/react'
import type { RefObject } from 'react'
import { gsap } from '../lib/gsap'

// Fade-up untuk elemen [data-reveal] di dalam ref saat masuk layar; yang muncul bersamaan diberi jeda bertahap.
// Memakai IntersectionObserver supaya tetap jalan walau scroll melompat. Mati saat reduced motion.
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const els = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        gsap.set(els, { opacity: 0, y: 36 })
        const io = new IntersectionObserver(
          (entries) => {
            entries
              .filter((e) => e.isIntersecting)
              .forEach((e, i) => {
                gsap.to(e.target, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.09, ease: 'power3.out', clearProps: 'all' })
                io.unobserve(e.target)
              })
          },
          { rootMargin: '0px 0px -8% 0px' },
        )
        els.forEach((el) => io.observe(el))
        return () => io.disconnect()
      })
    },
    { scope: ref },
  )
}
