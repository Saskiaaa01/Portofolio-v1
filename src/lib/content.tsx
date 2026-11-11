import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { activities as staticActivities, jobs as staticJobs } from '../data/journey'
import { profile as staticProfile } from '../data/profile'
import { certificates as staticCerts, projects as staticProjects, skills as staticSkills } from '../data/work'

export type Project = { title: string; role: string; image: string; alt: string; text: string; tags: string[] }
export type Certificate = { image: string; alt: string; zoom: string; position?: string; when: string; title: string; by: string; text: string }
export type Skill = { title: string; text: string; chips: string[] }
export type Job = { year: string; when: string; title: string; at: string; text: string }
export type Activity = { title: string; meta: string; text: string }
export type Content = {
  hero: { intro: string; fact: string; photo: string; linkedin: string }
  projects: Project[]
  certificates: Certificate[]
  skills: Skill[]
  jobs: Job[]
  activities: Activity[]
}

// Konten bawaan (dari src/data). Dipakai saat Supabase belum disambungkan, atau tabelnya masih kosong.
const fallback: Content = {
  hero: { intro: staticProfile.intro, fact: staticProfile.fact, photo: staticProfile.photo, linkedin: staticProfile.linkedin },
  projects: staticProjects,
  certificates: staticCerts,
  skills: staticSkills,
  jobs: staticJobs,
  activities: staticActivities,
}

type Row = Record<string, any>
const str = (v: unknown) => (typeof v === 'string' ? v : '')

async function load(): Promise<Content | null> {
  if (!import.meta.env.VITE_SUPABASE_URL) return null
  const { supabase } = await import('./supabase')
  if (!supabase) return null
  const get = async (table: string): Promise<Row[]> => {
    const q = supabase.from(table).select('*')
    const { data, error } = await (table === 'profile' ? q : q.order('sort', { ascending: true }))
    if (error) throw error
    return data ?? []
  }
  const [profile, projects, certs, skills, exps, acts] = await Promise.all(['profile', 'projects', 'certificates', 'skills', 'experiences', 'activities'].map(get))
  const p = profile[0]
  return {
    hero: {
      intro: str(p?.intro) || fallback.hero.intro,
      fact: str(p?.fact) || fallback.hero.fact,
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
    jobs: exps.length ? exps.map((r) => ({ year: str(r.year), when: str(r.period), title: str(r.title), at: str(r.place), text: str(r.text) })) : fallback.jobs,
    activities: acts.length ? acts.map((r) => ({ title: str(r.title), meta: str(r.meta), text: str(r.text) })) : fallback.activities,
  }
}

const Ctx = createContext<Content>(fallback)
export const useContent = () => useContext(Ctx)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(fallback)
  useEffect(() => {
    load().then((c) => c && setContent(c), () => {})
  }, [])
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>
}

export { fallback as staticContent }
