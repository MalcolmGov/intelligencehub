import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

export function timeAgo(date: Date | string): string {
  const d     = typeof date === 'string' ? new Date(date) : date
  const secs  = Math.floor((Date.now() - d.getTime()) / 1000)
  if (secs < 60)   return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export const STATUS_LABELS: Record<string, string> = {
  SUBMITTED:    'Submitted',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED:  'Shortlisted',
  PILOT:        'Pilot',
  IN_PRODUCTION:'In Production',
  REJECTED:     'Rejected',
}

export const STATUS_COLORS: Record<string, string> = {
  SUBMITTED:    'bg-slate-700 text-slate-200',
  UNDER_REVIEW: 'bg-amber-900/40 text-amber-300',
  SHORTLISTED:  'bg-blue-900/40 text-blue-300',
  PILOT:        'bg-purple-900/40 text-purple-300',
  IN_PRODUCTION:'bg-green-900/40 text-green-300',
  REJECTED:     'bg-red-900/40 text-red-300',
}

export const OPCOS = [
  'Ghana', 'Uganda', 'Rwanda', 'Cameroon', 'Zambia',
  'Benin', 'Eswatini', 'Sudan', 'Liberia',
  "Cote d'Ivoire", 'Congo', 'South Africa', 'Tanzania',
]

export const CATEGORIES = [
  'Customer Experience', 'Risk & Compliance', 'Revenue Growth',
  'Operational Efficiency', 'Technology & Infrastructure',
  'People & Culture', 'Data & Analytics', 'Product Innovation',
]
