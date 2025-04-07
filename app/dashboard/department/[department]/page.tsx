"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-provider"
import { formatDate, getStatusColor, getStatusText } from "@/lib/utils"
import { sops } from "@/lib/data"

export default function DepartmentSOPsPage({
  params,
}: {
  params: { department: string }
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [departmentSops, setDepartmentSops] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSops, setFilteredSops] = useState<any[]>([])

  useEffect(() => {
    // Decode the department name from the URL
    const department = decodeURIComponent(params.department)

    // Filter SOPs by department
    const filtered = sops.filter((sop) => sop.department === department)
    setDepartmentSops(filtered)
    setFilteredSops(filtered)
  }, [params.department])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const filtered = departmentSops.filter(
        (sop) => sop.title.toLowerCase().includes(query) || sop.status.toLowerCase().includes(query),
      )
      setFilteredSops(filtered)
    } else {
      setFilteredSops(departmentSops)
    }
  }, [searchQuery, departmentSops])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{decodeURIComponent(params.department)} Department SOPs</h1>
        <p className="text-muted-foreground">
          Browse and manage SOPs for the {decodeURIComponent(params.department)} department
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search SOPs</CardTitle>
          <CardDescription>Find specific SOPs within this department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search SOPs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department SOPs ({filteredSops.length})</CardTitle>
          <CardDescription>
            Showing {filteredSops.length} of {departmentSops.length} SOPs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No SOPs found for this department
                  </TableCell>
                </TableRow>
              ) : (
                filteredSops.map((sop) => (
                  <TableRow key={sop.id}>
                    <TableCell className="font-medium">{sop.title}</TableCell>
                    <TableCell>v{sop.version}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          sop.status,
                        )}`}
                      >
                        {getStatusText(sop.status)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(sop.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/sops/${sop.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

