import { BookOpen, Bug, ChartColumn, ClipboardCheck, CodeXml, Database, DatabaseBackup, FileSpreadsheet, FileText, GitMerge, Network, SearchCheck, Server, Sparkles, Table2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { siGit, siGithub, siLaravel, siPhp, siWhatsapp, type SimpleIcon } from 'simple-icons'

const brand = (i: SimpleIcon) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d={i.path} />
  </svg>
)

const S = 15
const icons: Record<string, ReactNode> = {
  'Pengujian fungsional': <ClipboardCheck size={S} aria-hidden />,
  'Pengujian perangkat lunak': <Bug size={S} aria-hidden />,
  'Identifikasi kesalahan': <SearchCheck size={S} aria-hidden />,
  SQL: <Database size={S} aria-hidden />,
  'Join dan subquery': <GitMerge size={S} aria-hidden />,
  ERD: <Network size={S} aria-hidden />,
  Normalisasi: <Table2 size={S} aria-hidden />,
  DBMS: <Server size={S} aria-hidden />,
  'Backup dan recovery': <DatabaseBackup size={S} aria-hidden />,
  Laravel: brand(siLaravel),
  PHP: brand(siPhp),
  'WhatsApp API': brand(siWhatsapp),
  'Git dan GitHub': (
    <>
      {brand(siGit)}
      {brand(siGithub)}
    </>
  ),
  'BRD, SRS, FSD': <FileText size={S} aria-hidden />,
  'Manual book': <BookOpen size={S} aria-hidden />,
  'Pengolahan data': <ChartColumn size={S} aria-hidden />,
  'Microsoft Excel': <FileSpreadsheet size={S} aria-hidden />,
}

// Chip tanpa ikon terdaftar tetap tampil sebagai teks saja
export const skillIcon = (label: string) => icons[label] ?? null

// Ikon kecil cadangan untuk keahlian yang belum terdaftar, supaya kotaknya tidak kosong
export const fallbackIcon = <Sparkles size={S} aria-hidden />

// Ikon kelompok keahlian, dipilih dari kata di judulnya
export const categoryIcon = (title: string): ReactNode => {
  const t = title.toLowerCase()
  if (/quality|qa|uji|test/.test(t)) return <ClipboardCheck size={S} aria-hidden />
  if (/data|database|sql/.test(t)) return <Database size={S} aria-hidden />
  if (/web|program|develop|kode|code/.test(t)) return <CodeXml size={S} aria-hidden />
  if (/analis|administrasi|dokumen/.test(t)) return <FileText size={S} aria-hidden />
  return fallbackIcon
}
