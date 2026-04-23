import type { ReactNode } from "react"

export interface Section {
  id: string
  title: string
  subtitle?: ReactNode
  content?: string
  showButton?: boolean
  buttonText?: string
  tag?: string
  stats?: { value: string; label: string }[]
  services?: { icon: string; title: string; desc: string }[]
  projects?: { title: string; meta: string; desc: string }[]
  calculator?: boolean
}

export interface SectionProps extends Section {
  isActive: boolean
}