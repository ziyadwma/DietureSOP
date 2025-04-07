"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowRight, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ProcessSteps } from "@/components/process-steps"
import type { ProcessStep } from "@/components/process-step"
import { SOPService } from "@/lib/api-service"
import type { SOP } from "@/lib/types"

type ExceptionType = "description" | "steps" | "redirect"

interface ExceptionsSectionProps {
  initialDescription: string
  onDescriptionChange: (description: string) => void
  onStepsChange: (steps: ProcessStep[]) => void
  onRedirectSOPChange: (sopId: string) => void
}

export function ExceptionsSection({
  initialDescription,
  onDescriptionChange,
  onStepsChange,
  onRedirectSOPChange,
}: ExceptionsSectionProps) {
  const [exceptionType, setExceptionType] = useState<ExceptionType>("description")
  const [description, setDescription] = useState(initialDescription)
  const [redirectSOP, setRedirectSOP] = useState("")
  const [availableSOPs, setAvailableSOPs] = useState<SOP[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch available SOPs for the redirect dropdown
  useEffect(() => {
    const fetchSOPs = async () => {
      try {
        setLoading(true)
        const allSOPs = await SOPService.getAll()
        // Filter to only show approved SOPs
        const approvedSOPs = allSOPs.filter((sop) => sop.status === "approved")
        setAvailableSOPs(approvedSOPs)
      } catch (error) {
        console.error("Error fetching SOPs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSOPs()
  }, [])

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    onDescriptionChange(e.target.value)
  }

  const handleExceptionTypeChange = (value: ExceptionType) => {
    setExceptionType(value)
  }

  const handleRedirectSOPChange = (value: string) => {
    setRedirectSOP(value)
    onRedirectSOPChange(value)
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={exceptionType}
        onValueChange={(value) => handleExceptionTypeChange(value as ExceptionType)}
        className="space-y-4"
      >
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="description" id="exception-description" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="exception-description" className="font-medium">
              Simple Description
            </Label>
            <p className="text-sm text-muted-foreground">Provide a simple text description of exceptions</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <RadioGroupItem value="steps" id="exception-steps" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="exception-steps" className="font-medium">
              Exception Process Steps
            </Label>
            <p className="text-sm text-muted-foreground">Define detailed process steps for handling exceptions</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <RadioGroupItem value="redirect" id="exception-redirect" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="exception-redirect" className="font-medium">
              Redirect to Another SOP
            </Label>
            <p className="text-sm text-muted-foreground">Reference another SOP that handles these exceptions</p>
          </div>
        </div>
      </RadioGroup>

      {exceptionType === "description" && (
        <div className="space-y-2 pt-2">
          <Textarea
            id="exceptions"
            placeholder="Describe what to do if something goes wrong or in special circumstances (e.g., In case of equipment failure, contact maintenance and switch to manual packaging)"
            value={description}
            onChange={handleDescriptionChange}
            rows={3}
          />
        </div>
      )}

      {exceptionType === "steps" && (
        <div className="pt-2">
          <ProcessSteps onStepsChange={onStepsChange} />
        </div>
      )}

      {exceptionType === "redirect" && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="redirect-sop">Select SOP</Label>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                <span className="text-sm text-muted-foreground">Loading SOPs...</span>
              </div>
            ) : availableSOPs.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No approved SOPs available for redirection. Please create and approve SOPs first.
              </div>
            ) : (
              <Select value={redirectSOP} onValueChange={handleRedirectSOPChange}>
                <SelectTrigger id="redirect-sop">
                  <SelectValue placeholder="Select an SOP" />
                </SelectTrigger>
                <SelectContent>
                  {availableSOPs.map((sop) => (
                    <SelectItem key={sop.id} value={sop.id}>
                      {sop.title} (v{sop.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {redirectSOP && (
            <div className="rounded-md border p-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{availableSOPs.find((sop) => sop.id === redirectSOP)?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {availableSOPs.find((sop) => sop.id === redirectSOP)?.department} • Version{" "}
                    {availableSOPs.find((sop) => sop.id === redirectSOP)?.version}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto" asChild>
                  <a href={`/dashboard/sops/${redirectSOP}`} target="_blank" rel="noopener noreferrer">
                    View <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

