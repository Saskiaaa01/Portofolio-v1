import { BookOpen, Bug, ChartColumn, ClipboardCheck, Database, DatabaseBackup, FileSpreadsheet, FileText, GitMerge, Network, SearchCheck, Server, Table2 } from 'lucide-react'
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
