"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  FileText,
  LayoutGrid,
  LayoutList,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Trash2,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-provider"
import { canCreateSOP, canDeleteSOP, formatDate, getStatusColor, getStatusText } from "@/lib/utils"
import { SOPService, DepartmentService } from "@/lib/api-service"
import type { SOP } from "@/lib/types"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SOPsPage() {
  const { user } = useAuth()
  const [sops, setSops] = useState<SOP[]>([])
  const [departments, setDepartments] = useState<string[]>(["All"])
  const [filteredSops, setFilteredSops] = useState<SOP[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [sortField, setSortField] = useState<"title" | "department" | "version" | "updatedAt">("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sopToDelete, setSopToDelete] = useState<string | null>(null)

  // Get counts for the status tabs
  const statusCounts = {
    all: sops.length,
    approved: sops.filter((sop) => sop.status === "approved").length,
    pending: sops.filter((sop) => sop.status === "pending_approval").length,
    draft: sops.filter((sop) => sop.status === "draft").length,
    rejected: sops.filter((sop) => sop.status === "rejected").length,
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("Fetching SOPs and departments...")
        const [fetchedSops, fetchedDepartments] = await Promise.all([SOPService.getAll(), DepartmentService.getAll()])
        console.log("Fetched SOPs:", fetchedSops.length)

        setSops(fetchedSops)
        setDepartments(["All", ...fetchedDepartments])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...sops]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (sop) => sop.title.toLowerCase().includes(query) || sop.department.toLowerCase().includes(query),
      )
    }

    // Apply department filter
    if (departmentFilter !== "All") {
      filtered = filtered.filter((sop) => sop.department === departmentFilter)
    }

    // Apply status filter
    if (statusFilter !== "All") {
      const statusMap = {
        Approved: "approved",
        Pending: "pending_approval",
        Draft: "draft",
        Rejected: "rejected",
      }
      filtered = filtered.filter((sop) => sop.status === statusMap[statusFilter as keyof typeof statusMap])
    }

    // Apply tab filter
    if (activeTab !== "all") {
      const tabStatusMap = {
        approved: "approved",
        pending: "pending_approval",
        draft: "draft",
        rejected: "rejected",
      }
      filtered = filtered.filter((sop) => sop.status === tabStatusMap[activeTab as keyof typeof tabStatusMap])
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB

      if (sortField === "updatedAt") {
        valueA = new Date(a.updatedAt).getTime()
        valueB = new Date(b.updatedAt).getTime()
      } else if (sortField === "version") {
        const [aMajor, aMinor] = a.version.split(".").map(Number)
        const [bMajor, bMinor] = b.version.split(".").map(Number)
        valueA = aMajor * 1000 + aMinor
        valueB = bMajor * 1000 + bMinor
      } else {
        valueA = a[sortField]
        valueB = b[sortField]
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    setFilteredSops(filtered)
  }, [sops, searchQuery, departmentFilter, statusFilter, sortField, sortDirection, activeTab])

  const handleSort = (field: "title" | "department" | "version" | "updatedAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending_approval":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "draft":
        return <FileText className="h-4 w-4 text-gray-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const success = await SOPService.delete(id)
      if (success) {
        setSops(sops.filter((sop) => sop.id !== id))
        toast({
          title: "SOP Deleted",
          description: "The SOP has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete SOP. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting SOP:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the SOP.",
        variant: "destructive",
      })
    } finally {
      setSopToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // Function to render the table view
  const renderTableView = () => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>
            {activeTab === "all"
              ? "All"
              : activeTab === "approved"
                ? "Approved"
                : activeTab === "pending"
                  ? "Pending"
                  : activeTab === "draft"
                    ? "Draft"
                    : "Rejected"}{" "}
            SOPs ({filteredSops.length})
          </CardTitle>
          <CardDescription>{filteredSops.length} SOPs found</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("title")}
                    className="flex items-center p-0 h-auto font-medium"
                  >
                    Title
                    {sortField === "title" && (
                      <ArrowUpDown className={`ml-2 h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("department")}
                    className="flex items-center p-0 h-auto font-medium"
                  >
                    Department
                    {sortField === "department" && (
                      <ArrowUpDown className={`ml-2 h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("version")}
                    className="flex items-center p-0 h-auto font-medium"
                  >
                    Version
                    {sortField === "version" && (
                      <ArrowUpDown className={`ml-2 h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("updatedAt")}
                    className="flex items-center p-0 h-auto font-medium"
                  >
                    Last Updated
                    {sortField === "updatedAt" && (
                      <ArrowUpDown className={`ml-2 h-3 w-3 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-12 w-12 mb-2 opacity-20" />
                      <p className="text-lg font-medium">No SOPs found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSops.map((sop) => (
                  <TableRow key={sop.id} className="group hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getStatusIcon(sop.status)}
                        <span className="ml-2">{sop.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{sop.department}</TableCell>
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
                      <div className="flex justify-end space-x-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/sops/${sop.id}`}>View</Link>
                        </Button>
                        {canDeleteSOP(user?.role || "", sop.createdBy, user?.id || "") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setSopToDelete(sop.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )

  // Function to render the grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <div className="col-span-full flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : filteredSops.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground py-12">
          <FileText className="h-12 w-12 mb-2 opacity-20" />
          <p className="text-lg font-medium">No SOPs found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        filteredSops.map((sop) => (
          <Card key={sop.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base line-clamp-1">{sop.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    {sop.department} • v{sop.version}
                  </CardDescription>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    sop.status,
                  )}`}
                >
                  {getStatusText(sop.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">
                <p>Last updated: {formatDate(sop.updatedAt)}</p>
                <p>Created by: {sop.createdBy ? "User " + sop.createdBy : "Unknown"}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Button asChild variant="default" size="sm">
                <Link href={`/dashboard/sops/${sop.id}`}>View SOP</Link>
              </Button>
              {canDeleteSOP(user?.role || "", sop.createdBy, user?.id || "") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setSopToDelete(sop.id)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Standard Operating Procedures</h1>
          <p className="text-muted-foreground">Browse and manage all SOPs in the system</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-muted" : ""}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                >
                  {viewMode === "list" ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle View Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {canCreateSOP(user?.role || "") && (
            <Button asChild>
              <Link href="/dashboard/sops/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New SOP
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search SOPs by title or department..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {showFilters && (
            <>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending Approval</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {statusCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              <Badge variant="secondary" className="ml-2">
                {statusCounts.approved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">
                {statusCounts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft
              <Badge variant="secondary" className="ml-2">
                {statusCounts.draft}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge variant="secondary" className="ml-2">
                {statusCounts.rejected}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">{viewMode === "list" ? renderTableView() : renderGridView()}</div>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete SOP</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this SOP? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => sopToDelete && handleDelete(sopToDelete)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

