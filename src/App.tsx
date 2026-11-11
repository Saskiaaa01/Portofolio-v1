import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Experience } from './components/sections/Experience'
import { Footer } from './components/sections/Footer'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { Work } from './components/sections/Work'
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
        <Marquee />
        <About />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
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
  return (
    <ContentProvider>
      <Site />
    </ContentProvider>
  )
}
