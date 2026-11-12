import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Education } from './components/sections/Education'
import { Experience } from './components/sections/Experience'
import { Footer } from './components/sections/Footer'
import { Hero } from './components/sections/Hero'
import { Skills } from './components/sections/Skills'
import { Work } from './components/sections/Work'
import { Loader } from './components/ui/Loader'
import { useReveal } from './hooks/useReveal'
import { ContentProvider } from './lib/content'

// Dashboard dimuat terpisah supaya tidak membebani pengunjung biasa
const Admin = lazy(() => import('./components/admin/Admin'))

function Site() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root)
  return (
    <div ref={root}>
      <Hero />
      <main>
        <About />
        <Skills />
        <Work />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

// Layar pembuka tampil sekali per sesi, dan dilewati bagi yang memilih "kurangi gerakan"
const skipLoader = () => sessionStorage.getItem('loaded') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches

function PublicSite() {
  // loading: hanya loader; leaving: situs dipasang di bawah tirai yang naik; done: loader hilang
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'done'>(() => (skipLoader() ? 'done' : 'loading'))
  const mounted = phase !== 'loading'

  // Situs baru dipasang saat tirai mulai naik agar animasi hero tampil tepat saat terlihat;
  // lompatan ke #bagian dari alamat dilakukan sesudahnya
  useEffect(() => {
    if (!mounted || !location.hash || location.hash.startsWith('#/')) return
    document.querySelector(location.hash)?.scrollIntoView()
  }, [mounted])

  return (
    <ContentProvider>
      {phase !== 'done' && (
        <Loader
          onLeave={() => setPhase('leaving')}
          onDone={() => {
            sessionStorage.setItem('loaded', '1')
            setPhase('done')
          }}
        />
      )}
      {mounted && <Site />}
    </ContentProvider>
  )
}

// Hash route sederhana (#/admin) karena GitHub Pages tidak punya rewrite ke index.html
const isAdminRoute = () => location.hash.startsWith('#/admin')

export default function App() {
  const [admin, setAdmin] = useState(isAdminRoute())
  useEffect(() => {
    const on = () => setAdmin(isAdminRoute())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])

  if (admin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }
  return <PublicSite />
}
