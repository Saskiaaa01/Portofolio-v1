import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { profile } from '../../data/profile'
import { makeIdCardBack, makeIdCardFace } from '../../lib/idCardFace'
import { makeStrapTexture } from '../../lib/strapTexture'

// three.js dimuat hanya saat bagian ini mendekati layar
const Lanyard = lazy(() => import('../reactbits/Lanyard'))

export function Contact() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [face, setFace] = useState<string>()
  const [back, setBack] = useState<string>()
  const [strap, setStrap] = useState<string>()

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    makeStrapTexture().then(setStrap, () => {})
    makeIdCardBack().then(setBack, () => {})
    makeIdCardFace().then(setFace, () => setFace(profile.photo))
  }, [near])

  return (
    <section id="kontak" className="contact">
      <div className="wrap">
        <div className="contact-panel">
          <div ref={boxRef} className="lanyard-box" aria-hidden>
            {near && face && (
              <Suspense fallback={null}>
                <Lanyard frontImage={face} backImage={back} strapImage={strap} finish="matte" metal="silver" cornerRadius={0.14} size={0.52} strapLength={0.4} strapWidth={0.4} className="absolute inset-0" />
              </Suspense>
            )}
          </div>
          <div className="copy">
            <p className="eyebrow" style={{ color: '#8ea1c6' }}>Kontak</p>
            <h2>Mari kerja <em>bareng</em></h2>
            <p>Saya sedang mencari posisi di bidang QA, basis data, atau pengembangan web. Kalau tim Anda butuh orang yang suka mengecek sampai detail, mari ngobrol.</p>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">Hubungi saya di LinkedIn ↗</a>
            <div className="link">{profile.linkedinLabel}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
