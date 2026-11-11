import { tools } from '../../data/profile'
import ScrollVelocity from '../reactbits/ScrollVelocity'

// Deretan alat selebar layar, tanpa kotak; arah dan kecepatannya mengikuti scroll (React Bits ScrollVelocity)
export function Marquee() {
  return (
    <section className="strip" data-reveal aria-label={`Alat dan keahlian: ${tools.join(', ')}`}>
      <ScrollVelocity
        texts={[
          <>
            {tools.map((t) => (
              <span key={t}>
                {t}
                <span className="gap" aria-hidden />
              </span>
            ))}
          </>,
        ]}
        velocity={30}
        skewWithVelocity={0}
        fadeEdges
        pauseOnHover
        fontSize="clamp(24px, 2.8vw, 36px)"
        fontWeight={600}
        scrollerStyle={{ lineHeight: 1.5 }}
      />
    </section>
  )
}
