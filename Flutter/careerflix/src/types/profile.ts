export type AvatarTone = 'crimson' | 'ocean' | 'forest' | 'amber' | 'violet' | 'slate'

export type ExperienceEntry = {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export type EducationEntry = {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  details: string
}

export type ProjectEntry = {
  id: string
  name: string
  organization: string
  stack: string
  summary: string
  highlights: string[]
}

export type CertificationEntry = {
  id: string
  name: string
  issuer: string
  year: string
}

export type CareerProfile = {
  id: string
  ownerUid: string
  displayName: string
  avatarTone: AvatarTone
  headline: string
  summary: string
  email: string
  phone: string
  linkedin: string
  location: string
  skills: string[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  createdAt: string
  updatedAt: string
}

export type ProfileDraft = Omit<CareerProfile, 'id' | 'ownerUid' | 'createdAt' | 'updatedAt'>

export const AVATAR_TONES: AvatarTone[] = [
  'crimson',
  'ocean',
  'forest',
  'amber',
  'violet',
  'slate',
]

export function emptyProfileDraft(displayName = ''): ProfileDraft {
  return {
    displayName,
    avatarTone: 'crimson',
    headline: '',
    summary: '',
    email: '',
    phone: '',
    linkedin: '',
    location: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  }
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}
