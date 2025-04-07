import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function canCreateSOP(role: string) {
  return ["super_admin", "writer"].includes(role)
}

export function canEditSOP(role: string, createdBy: string, userId: string) {
  return ["super_admin", "writer"].includes(role) && (role === "super_admin" || createdBy === userId)
}

export function canApproveSOP(role: string) {
  return ["super_admin", "approver", "department_head"].includes(role)
}

export function canDeleteSOP(role: string, createdBy: string, userId: string) {
  return role === "super_admin" || (role === "writer" && createdBy === userId)
}

export function canViewSOP() {
  return true // All authenticated users can view SOPs
}

export function canManageUsers(role: string) {
  return role === "super_admin"
}

export function canManageDepartments(role: string) {
  return role === "super_admin"
}

export function getStatusColor(status: string) {
  switch (status) {
    case "draft":
      return "text-gray-500 bg-gray-100"
    case "pending_approval":
      return "text-yellow-500 bg-yellow-100"
    case "approved":
      return "text-green-500 bg-green-100"
    case "rejected":
      return "text-red-500 bg-red-100"
    case "archived":
      return "text-blue-500 bg-blue-100"
    default:
      return "text-gray-500 bg-gray-100"
  }
}

export function getStatusText(status: string) {
  switch (status) {
    case "draft":
      return "Draft"
    case "pending_approval":
      return "Pending Approval"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
    case "archived":
      return "Archived"
    default:
      return status
  }
}

export function getRoleText(role: string) {
  switch (role) {
    case "super_admin":
      return "Super Admin"
    case "writer":
      return "SOP Writer"
    case "approver":
      return "SOP Approver"
    case "department_head":
      return "Department Head"
    case "staff":
      return "General Staff"
    default:
      return role
  }
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

