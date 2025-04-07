"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Clock, FileText, PenLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-provider"
import { canCreateSOP, formatDate } from "@/lib/utils"
import { sops } from "@/lib/data"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    draft: 0,
    rejected: 0,
    departmentSops: 0,
  })
  const [recentSops, setRecentSops] = useState<any[]>([])

  useEffect(() => {
    // Calculate stats
    const total = sops.length
    const approved = sops.filter((sop) => sop.status === "approved").length
    const pending = sops.filter((sop) => sop.status === "pending_approval").length
    const draft = sops.filter((sop) => sop.status === "draft").length
    const rejected = sops.filter((sop) => sop.status === "rejected").length
    const departmentSops = sops.filter((sop) => user?.departments.includes(sop.department)).length

    setStats({
      total,
      approved,
      pending,
      draft,
      rejected,
      departmentSops,
    })

    // Get recent SOPs
    const recent = [...sops]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
    setRecentSops(recent)
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}! Here's an overview of the SOP system.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SOPs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Department SOPs</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departmentSops}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent SOPs</CardTitle>
            <CardDescription>The most recently updated SOPs in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSops.map((sop) => (
                <div key={sop.id} className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{sop.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {sop.department} • Updated {formatDate(sop.updatedAt)}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/sops/${sop.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/sops">View All SOPs</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/sops">
                <FileText className="mr-2 h-4 w-4" />
                Browse All SOPs
              </Link>
            </Button>
            {canCreateSOP(user?.role || "") && (
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/sops/new">
                  <PenLine className="mr-2 h-4 w-4" />
                  Create New SOP
                </Link>
              </Button>
            )}
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href={`/dashboard/departments`}>
                <FileText className="mr-2 h-4 w-4" />
                View My Departments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

