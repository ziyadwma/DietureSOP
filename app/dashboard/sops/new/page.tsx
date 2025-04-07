"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Info } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { DepartmentService, SOPService } from "@/lib/api-service"
import type { ProcessStep } from "@/components/process-step"
import { ExceptionsSection } from "@/components/exceptions-section"
import { useEffect } from "react"

export default function CreateSOPPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [departments, setDepartments] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    author: user?.name || "",
    objective: "",
    scope: "",
    responsibilities: "",
    procedures: "",
    exceptions: "",
    references: "",
    processSteps: [] as ProcessStep[],
    exceptionSteps: [] as ProcessStep[],
    exceptionRedirectSOP: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const allDepartments = await DepartmentService.getAll()
        // Filter departments to only show those the user has access to
        const userDepartments = allDepartments.filter((dept) => user?.departments?.includes(dept))
        setDepartments(userDepartments)
      } catch (error) {
        console.error("Error fetching departments:", error)
        toast({
          title: "Error",
          description: "Failed to load departments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [user, toast])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }))
  }

  const handleProcessStepsChange = (steps: ProcessStep[]) => {
    setFormData((prev) => ({ ...prev, processSteps: steps }))
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    if (!user?.departments?.includes(formData.department)) {
      toast({
        title: "Permission Denied",
        description: "You do not have access to create SOPs for this department.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare SOP data
      const sopData = {
        title: formData.title,
        department: formData.department,
        author: formData.author,
        createdBy: user?.id || "",
        status: "draft" as const,
        content: formData.procedures,
        objective: formData.objective,
        scope: formData.scope,
        responsibilities: formData.responsibilities,
        exceptions: formData.exceptions,
        references: formData.references,
      }

      console.log("Creating SOP with data:", sopData)

      // Create the SOP
      const newSop = await SOPService.create(sopData)
      console.log("SOP created successfully:", newSop)

      toast({
        title: "SOP Created",
        description: "Your SOP has been created successfully.",
      })

      // Wait a moment to ensure data is saved before navigating
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Redirect to the SOPs list instead of the detail page to avoid potential issues
      router.push("/dashboard/sops")
    } catch (error) {
      console.error("Error creating SOP:", error)
      toast({
        title: "Error",
        description: "Failed to create SOP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center space-x-2">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/sops">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New SOP</h1>
          <p className="text-muted-foreground">Create a new Standard Operating Procedure</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New SOP</CardTitle>
          <CardDescription>Fill out the form below to create a new Standard Operating Procedure</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="sop-form" onSubmit={handleSubmit} className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-800" />
              <AlertTitle className="text-blue-800">Approval Process Information</AlertTitle>
              <AlertDescription className="text-blue-800">
                Once submitted, this SOP will be sent for approval to the designated reviewer. The SOP will remain in a{" "}
                <span className="font-semibold">"Pending Approval"</span> state until approved or rejected. You'll be
                able to track the approval status on the home page.
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
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="font-medium">
                    Department
                  </Label>
                  <Select value={formData.department} onValueChange={handleDepartmentChange} required>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
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

              <Separator />

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
                  required
                />
              </div>

              <Separator />

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
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/sops")}>
            Cancel
          </Button>
          <Button type="submit" form="sop-form" disabled={isSubmitting} className="bg-[#0f172a] hover:bg-[#1e293b]">
            {isSubmitting ? "Creating..." : "Create SOP"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

