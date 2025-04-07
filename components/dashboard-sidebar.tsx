"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, FileText, LayoutDashboard, PlusCircle, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-provider"
import { canCreateSOP, canManageDepartments, canManageUsers } from "@/lib/utils"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "SOPs",
      href: "/dashboard/sops",
      icon: FileText,
      current: pathname === "/dashboard/sops",
    },
    {
      name: "My Departments",
      href: `/dashboard/departments`,
      icon: BookOpen,
      current: pathname === "/dashboard/departments",
    },
  ]

  const adminNavigation = [
    {
      name: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
      current: pathname === "/dashboard/admin/users",
      show: canManageUsers(user?.role || ""),
    },
    {
      name: "Manage Departments",
      href: "/dashboard/admin/departments",
      icon: Settings,
      current: pathname === "/dashboard/admin/departments",
      show: canManageDepartments(user?.role || ""),
    },
  ].filter((item) => item.show)

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center">
          {/* Placeholder for Dieture logo - replace with actual logo when available */}
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-2">
            D
          </div>
          <span className="text-xl font-bold">Dieture SOP</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                item.current ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  item.current ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}

          {adminNavigation.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="px-2 py-2 text-xs font-semibold text-gray-500">Administration</div>
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    item.current ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      item.current ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="p-4">
          <Separator className="my-2" />
          {canCreateSOP(user?.role || "") && (
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/sops/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New SOP
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

