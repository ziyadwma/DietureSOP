import type { ChecklistItem } from "@/components/checklist-modal"

export type MediaItem = {
  id: string
  name: string
  type: string
  url: string
}

export type ProcessStep = {
  id: string
  number: number
  description: string
  checklist: ChecklistItem[]
  media: MediaItem[]
}

// Add these types for version control
export type RevisionStatus = "draft" | "pending_approval" | "approved" | "rejected" | "archived"

export type SOPRevision = {
  version: string
  date: string
  author: string
  changes: string
  content?: string
  status: RevisionStatus
}

export type SOP = {
  id: string
  title: string
  department: string
  version: string
  status: RevisionStatus
  createdBy: string
  approvedBy: string | null
  createdAt: string
  updatedAt: string
  content: string
  revisions: SOPRevision[]
  objective?: string
  scope?: string
  responsibilities?: string
  exceptions?: string
  references?: string
  author?: string
}

export type User = {
  id: string
  username: string
  password?: string
  name: string
  role: "super_admin" | "writer" | "approver" | "department_head" | "staff"
  departments: string[]
}

export type Department = string

export type Notification = {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
  link?: string
}

