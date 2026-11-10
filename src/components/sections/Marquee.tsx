import { tools } from '../../data/profile'
import ScrollVelocity from '../reactbits/ScrollVelocity'

// Deretan alat dan keahlian; arah dan kecepatannya mengikuti scroll (React Bits ScrollVelocity)
export function Marquee() {
  return (
    <div className="wrap">
      <section className="strip glass" aria-label={`Alat dan keahlian: ${tools.join(', ')}`}>
        <ScrollVelocity
          texts={[
            <>
              {tools.map((t) => (
                <span key={t}>
                  {t}
                  <i className="dot" aria-hidden />
                </span>
              ))}
            </>,
          ]}
          velocity={40}
          skewWithVelocity={10}
          pauseOnHover
          fontSize="17px"
          fontWeight={600}
          color="#0b1424"
        />
      </section>
    </div>
  )
}
