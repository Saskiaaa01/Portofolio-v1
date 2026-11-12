import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { activities as staticActivities, jobs as staticJobs } from '../data/journey'
import { profile as staticProfile } from '../data/profile'
import { certificates as staticCerts, projects as staticProjects, skills as staticSkills } from '../data/work'

export type Project = { title: string; role: string; image: string; alt: string; text: string; tags: string[] }
export type Certificate = { image: string; alt: string; zoom: string; position?: string; when: string; title: string; by: string; text: string }
export type Skill = { title: string; text: string; chips: string[] }
export type Job = { year: string; when: string; title: string; at: string; text: string; image?: string }
export type Activity = { title: string; meta: string; text: string; image?: string }
export type Content = {
  hero: { intro: string; photo: string; linkedin: string }
  projects: Project[]
  certificates: Certificate[]
  skills: Skill[]
  jobs: Job[]
  activities: Activity[]
}

// Konten bawaan (dari src/data). Dipakai saat Supabase belum disambungkan, atau tabelnya masih kosong.
const fallback: Content = {
  hero: { intro: staticProfile.intro, photo: staticProfile.photo, linkedin: staticProfile.linkedin },
  projects: staticProjects,
  certificates: staticCerts,
  skills: staticSkills,
  jobs: staticJobs,
  activities: staticActivities,
}

type Row = Record<string, any>
const str = (v: unknown) => (typeof v === 'string' ? v : '')

const API = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Membaca lewat REST langsung: supabase-js (±54 KB gzip) hanya dimuat di dashboard, bukan di situs publik
async function load(): Promise<Content | null> {
  if (!API || !KEY) return null
  const get = async (table: string): Promise<Row[]> => {
    const order = table === 'profile' ? '' : '&order=sort.asc'
    const r = await fetch(`${API}/rest/v1/${table}?select=*${order}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } })
    if (!r.ok) throw new Error(`${table}: ${r.status}`)
    return r.json()
  }
  const [profile, projects, certs, skills, exps, acts] = await Promise.all(['profile', 'projects', 'certificates', 'skills', 'experiences', 'activities'].map(get))
  const p = profile[0]
  return {
    hero: {
      intro: str(p?.intro) || fallback.hero.intro,
      photo: str(p?.photo_url) || fallback.hero.photo,
      linkedin: str(p?.linkedin_url) || fallback.hero.linkedin,
    },
    projects: projects.length
      ? projects.map((r) => ({ title: str(r.title), role: str(r.role), image: str(r.image_url), alt: `Tangkapan layar ${str(r.title)}`, text: str(r.text), tags: r.tags ?? [] }))
      : fallback.projects,
    certificates: certs.length
      ? certs.map((r) => ({ image: str(r.image_url), alt: `Sertifikat ${str(r.title)}`, zoom: `Perbesar sertifikat ${str(r.title)}`, when: str(r.issued_on), title: str(r.title), by: str(r.issuer), text: str(r.text) }))
      : fallback.certificates,
    skills: skills.length ? skills.map((r) => ({ title: str(r.title), text: str(r.text), chips: r.chips ?? [] })) : fallback.skills,
    jobs: exps.length ? exps.map((r) => ({ year: str(r.year), when: str(r.period), title: str(r.title), at: str(r.place), text: str(r.text), image: str(r.image_url) || undefined })) : fallback.jobs,
    activities: acts.length ? acts.map((r) => ({ title: str(r.title), meta: str(r.meta), text: str(r.text), image: str(r.image_url) || undefined })) : fallback.activities,
  }
}

const Ctx = createContext<Content>(fallback)
export const useContent = () => useContext(Ctx)

// Hasil terakhir disimpan di browser: kunjungan berikutnya langsung tampil, lalu disegarkan di latar belakang
const CACHE = 'portfolio-content-v1'
const cached = (): Content | null => {
  try {
    return JSON.parse(localStorage.getItem(CACHE) ?? 'null')
  } catch {
    return null
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(() => cached() ?? fallback)
  useEffect(() => {
    load().then(
      (c) => {
        if (!c) return
        setContent(c)
        try {
          localStorage.setItem(CACHE, JSON.stringify(c))
        } catch {}
      },
      () => {},
    )
  }, [])
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}

export { fallback as staticContent }
