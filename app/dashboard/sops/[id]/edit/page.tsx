"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Info } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { canEditSOP } from "@/lib/utils"
import { departments, sops, users } from "@/lib/data"
import { ExceptionsSection } from "@/components/exceptions-section"
import type { ProcessStep } from "@/lib/types"

export default function EditSOPPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [sop, setSop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    author: "",
    objective: "",
    scope: "",
    responsibilities: "",
    procedures: "",
    exceptions: "",
    references: "",
    exceptionSteps: [] as ProcessStep[],
    exceptionRedirectSOP: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const foundSop = sops.find((s) => s.id === params.id)
    if (foundSop) {
      setSop(foundSop)

      // For demo purposes, let's add some additional fields that might not be in the original data
      const enhancedSop = {
        ...foundSop,
        author: users.find((u) => u.id === foundSop.createdBy)?.name || "Unknown",
        objective: "To establish a standardized procedure for " + foundSop.title.toLowerCase(),
        scope: "This procedure applies to all staff in the " + foundSop.department + " department",
        responsibilities: "Department Manager: Oversee implementation\nTeam Members: Follow procedure",
        exceptions: "In case of emergency, contact the department manager immediately",
        references: "Company Policy Manual\nRegulatory Guidelines",
        procedures: foundSop.content,
      }

      setFormData({
        title: enhancedSop.title,
        department: enhancedSop.department,
        author: enhancedSop.author,
        objective: enhancedSop.objective,
        scope: enhancedSop.scope,
        responsibilities: enhancedSop.responsibilities,
        procedures: enhancedSop.procedures,
        exceptions: enhancedSop.exceptions,
        references: enhancedSop.references,
        exceptionSteps: [],
        exceptionRedirectSOP: "",
      })
    }
    setLoading(false)
  }, [params.id])

  useEffect(() => {
    // Check if user can edit this SOP
    if (sop && user && !canEditSOP(user.role, sop.createdBy, user.id)) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to edit this SOP.",
        variant: "destructive",
      })
      router.push(`/dashboard/sops/${params.id}`)
    }
  }, [sop, user, router, params.id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }))
  }

  const handleExceptionDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, exceptions: value }))
  }

  const handleExceptionStepsChange = (steps: ProcessStep[]) => {
    setFormData((prev) => ({ ...prev, exceptionSteps: steps }))
  }

  const handleExceptionRedirectSOPChange = (sopId: string) => {
    setFormData((prev) => ({ ...prev, exceptionRedirectSOP: sopId }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Check if user has access to the selected department
    if (!user?.departments.includes(formData.department)) {
      toast({
        title: "Permission Denied",
        description: "You do not have access to create SOPs for this department.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "SOP Updated",
        description: "Your SOP has been updated successfully.",
      })
      setIsSubmitting(false)
      router.push(`/dashboard/sops/${params.id}`)
    }, 1000)
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>
  }

  if (!sop) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">SOP Not Found</h1>
        <p className="text-muted-foreground">The SOP you are trying to edit does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/sops">Back to SOPs</Link>
        </Button>
      </div>
    )
  }

  // Filter departments to only show those the user has access to
  const userDepartments = departments.filter((dept) => dept !== "All" && user?.departments.includes(dept))

  // Format current date
  const currentDate =
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) +
    ", " +
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center space-x-2">
        <Button asChild variant="outline" size="icon">
          <Link href={`/dashboard/sops/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit SOP</h1>
          <p className="text-muted-foreground">Edit an existing Standard Operating Procedure</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit SOP</CardTitle>
          <CardDescription>Update the information for this Standard Operating Procedure</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="sop-form" onSubmit={handleSubmit} className="space-y-6">
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Editing Information</AlertTitle>
              <AlertDescription>
                After editing, this SOP will need to be resubmitted for approval. Changes will not be visible to others
                until approved.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Meal Packaging Process"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="font-medium">
                    Department
                  </Label>
                  <Select value={formData.department} onValueChange={handleDepartmentChange}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {userDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="font-medium">
                    Author
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    placeholder="Name of the person creating this SOP"
                    value={formData.author}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective" className="font-medium">
                  Objective
                </Label>
                <Textarea
                  id="objective"
                  name="objective"
                  placeholder="Describe the purpose of this SOP and why it exists (e.g., To ensure consistent and hygienic meal packaging across all shifts)"
                  value={formData.objective}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope" className="font-medium">
                  Scope
                </Label>
                <Textarea
                  id="scope"
                  name="scope"
                  placeholder="Define which roles and departments this SOP applies to (e.g., All kitchen staff involved in meal packaging)"
                  value={formData.scope}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities" className="font-medium">
                  Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  name="responsibilities"
                  placeholder="List who is responsible for executing each part of this procedure (e.g., Kitchen Supervisor: Oversees process, Staff: Execute packaging)"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedures" className="font-medium">
                  Procedures
                </Label>
                <Textarea
                  id="procedures"
                  name="procedures"
                  placeholder="Detail the step-by-step process to follow. Number each step clearly."
                  value={formData.procedures}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exceptions" className="font-medium">
                  Exceptions
                </Label>
                <ExceptionsSection
                  initialDescription={formData.exceptions}
                  onDescriptionChange={handleExceptionDescriptionChange}
                  onStepsChange={handleExceptionStepsChange}
                  onRedirectSOPChange={handleExceptionRedirectSOPChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="references" className="font-medium">
                  References
                </Label>
                <Textarea
                  id="references"
                  name="references"
                  placeholder="List any related documents, regulations, or other SOPs that are referenced by this procedure"
                  value={formData.references}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastUpdated" className="font-medium">
                  Last Updated
                </Label>
                <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50 text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{currentDate}</span>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/sops/${params.id}`)}>
            Cancel
          </Button>
          <Button type="submit" form="sop-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

