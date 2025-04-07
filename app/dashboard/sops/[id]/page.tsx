"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// Add Trash2 to the imports from lucide-react
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  PenLine,
  Trash2,
  User,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
// Import the canDeleteSOP function
import { canApproveSOP, canDeleteSOP, canEditSOP, formatDate, getStatusColor, getStatusText } from "@/lib/utils"
import { SOPService, UserService } from "@/lib/api-service"
import type { SOP } from "@/lib/types"
import type { User as UserType } from "@/lib/types"

// Add imports for the new components
import { VersionHistory } from "@/components/version-history"
import { CreateVersionDialog } from "@/components/create-version-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SOPDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [sop, setSop] = useState<SOP | null>(null)
  const [loading, setLoading] = useState(true)
  const [approvalComment, setApprovalComment] = useState("")
  const [rejectionComment, setRejectionComment] = useState("")
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [users, setUsers] = useState<UserType[]>([])
  // Add a delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [fetchedSop, fetchedUsers] = await Promise.all([SOPService.getById(params.id), UserService.getAll()])

        setSop(fetchedSop)
        setUsers(fetchedUsers)
      } catch (error) {
        console.error("Error fetching SOP:", error)
        toast({
          title: "Error",
          description: "Failed to load SOP details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleApprove = async () => {
    if (!sop || !user) return

    try {
      const updatedSop = await SOPService.update(sop.id, {
        status: "approved",
        approvedBy: user.id,
        updatedAt: new Date().toISOString().split("T")[0],
      })

      setSop(updatedSop)

      toast({
        title: "SOP Approved",
        description: "The SOP has been approved successfully.",
      })
    } catch (error) {
      console.error("Error approving SOP:", error)
      toast({
        title: "Error",
        description: "Failed to approve SOP. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    if (!sop) return

    try {
      const updatedSop = await SOPService.update(sop.id, {
        status: "rejected",
        updatedAt: new Date().toISOString().split("T")[0],
      })

      setSop(updatedSop)

      toast({
        title: "SOP Rejected",
        description: "The SOP has been rejected.",
      })
    } catch (error) {
      console.error("Error rejecting SOP:", error)
      toast({
        title: "Error",
        description: "Failed to reject SOP. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitForApproval = async () => {
    if (!sop) return

    try {
      const updatedSop = await SOPService.update(sop.id, {
        status: "pending_approval",
        updatedAt: new Date().toISOString().split("T")[0],
      })

      setSop(updatedSop)

      toast({
        title: "SOP Submitted",
        description: "The SOP has been submitted for approval.",
      })
    } catch (error) {
      console.error("Error submitting SOP for approval:", error)
      toast({
        title: "Error",
        description: "Failed to submit SOP for approval. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportToPDF = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "PDF Export",
      description: "The SOP has been exported to PDF.",
    })
  }

  // Add a delete handler function after the handleExportToPDF function
  const handleDelete = async () => {
    if (!sop) return

    try {
      const success = await SOPService.delete(sop.id)
      if (success) {
        toast({
          title: "SOP Deleted",
          description: "The SOP has been deleted successfully.",
        })
        router.push("/dashboard/sops")
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
      setIsDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!sop) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-10">
        <FileText className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
        <h1 className="text-2xl font-bold">SOP Not Found</h1>
        <p className="text-muted-foreground mb-6">The SOP you are looking for does not exist or has been deleted.</p>
        <Button asChild>
          <Link href="/dashboard/sops">Back to SOPs</Link>
        </Button>
      </div>
    )
  }

  const creator = users.find((u) => u.id === sop.createdBy)
  const approver = sop.approvedBy ? users.find((u) => u.id === sop.approvedBy) : null

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button asChild variant="outline" size="icon">
            <Link href="/dashboard/sops">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{sop.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <span>{sop.department}</span>
              <span className="mx-2">•</span>
              <span>Version {sop.version}</span>
              <span className="mx-2">•</span>
              <Badge className={getStatusColor(sop.status)}>{getStatusText(sop.status)}</Badge>
            </div>
          </div>
        </div>
        {/* Update the action buttons in the header */}
        {/* Find the div with className="flex space-x-2" and replace it with: */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportToPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export to PDF
          </Button>

          {canEditSOP(user?.role || "", sop.createdBy, user?.id || "") && sop.status === "approved" && (
            <CreateVersionDialog sopId={sop.id} currentVersion={sop.version}>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                New Version
              </Button>
            </CreateVersionDialog>
          )}

          {canEditSOP(user?.role || "", sop.createdBy, user?.id || "") &&
            sop.status !== "pending_approval" &&
            sop.status !== "approved" && (
              <Button asChild size="sm">
                <Link href={`/dashboard/sops/${sop.id}/edit`}>
                  <PenLine className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}

          {canDeleteSOP(user?.role || "", sop.createdBy, user?.id || "") && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SOP Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="full-document">Full Document</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Objective</h3>
                    <p className="text-sm">{sop.objective || "No objective provided"}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Scope</h3>
                    <p className="text-sm">{sop.scope || "No scope provided"}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Responsibilities</h3>
                    <p className="text-sm whitespace-pre-line">
                      {sop.responsibilities || "No responsibilities provided"}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Exceptions</h3>
                    <p className="text-sm whitespace-pre-line">{sop.exceptions || "No exceptions provided"}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">References</h3>
                    <p className="text-sm whitespace-pre-line">{sop.references || "No references provided"}</p>
                  </div>
                </TabsContent>

                <TabsContent value="full-document" className="pt-4">
                  <div className="prose max-w-none text-sm">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sop.content
                          .replace(/^# (.*$)/gim, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
                          .replace(/^## (.*$)/gim, "<h4 class='text-md font-semibold mt-3 mb-1'>$1</h4>")
                          .replace(/^### (.*$)/gim, "<h5 class='text-sm font-semibold mt-2 mb-1'>$1</h5>")
                          .replace(/- (.*)/gim, "<li>$1</li>")
                          .replace(/([0-9]+)\. (.*)/gim, "<li>$2</li>")
                          .replace(/\n/gim, "<br />"),
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <VersionHistory
            versions={sop.revisions.map((rev) => ({
              version: rev.version,
              date: rev.date,
              author: rev.author,
              changes: rev.changes,
              status: rev.version === sop.version ? sop.status : "archived",
            }))}
            currentVersion={sop.version}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SOP Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(sop.status)}>{getStatusText(sop.status)}</Badge>
                </div>
              </div>

              <Separator />

              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Author</p>
                  <p className="text-sm">{sop.author || creator?.name || "Unknown"}</p>
                </div>
              </div>

              {approver && (
                <>
                  <Separator />
                  <div className="flex items-center">
                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Approved By</p>
                      <p className="text-sm">{approver.name}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Created Date</p>
                  <p className="text-sm">{formatDate(sop.createdAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm">{formatDate(sop.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Version</p>
                  <p className="text-sm">v{sop.version}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {sop.status === "draft" && canEditSOP(user?.role || "", sop.createdBy, user?.id || "") && (
                <Button className="w-full" onClick={handleSubmitForApproval}>
                  <Clock className="mr-2 h-4 w-4" />
                  Submit for Approval
                </Button>
              )}

              {sop.status === "pending_approval" && canApproveSOP(user?.role || "") && (
                <div className="flex w-full flex-col space-y-2">
                  <Button className="w-full" variant="default" onClick={() => setApproveDialogOpen(true)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>

                  <Button className="w-full" variant="destructive" onClick={() => setRejectDialogOpen(true)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve SOP</DialogTitle>
            <DialogDescription>Are you sure you want to approve this SOP?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approval-comment">Approval Comment (Optional)</Label>
              <Textarea
                id="approval-comment"
                placeholder="Enter any comments about this approval"
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleApprove()
                setApproveDialogOpen(false)
              }}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject SOP</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this SOP.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection"
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleReject()
                setRejectDialogOpen(false)
              }}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

