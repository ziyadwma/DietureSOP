"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface CreateVersionDialogProps {
  sopId: string
  currentVersion: string
  children: React.ReactNode
}

export function CreateVersionDialog({ sopId, currentVersion, children }: CreateVersionDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [versionType, setVersionType] = useState<"minor" | "major">("minor")
  const [changeDescription, setChangeDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate next version number
  const calculateNextVersion = () => {
    const [major, minor] = currentVersion.split(".").map(Number)

    if (versionType === "major") {
      return `${major + 1}.0`
    } else {
      return `${major}.${minor + 1}`
    }
  }

  const handleSubmit = () => {
    if (!changeDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a description of the changes.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // In a real app, this would be an API call
    setTimeout(() => {
      toast({
        title: "New Version Created",
        description: `Version ${calculateNextVersion()} has been created and is now in draft status.`,
      })
      setIsSubmitting(false)
      setOpen(false)

      // Redirect to edit page for the new version
      router.push(`/dashboard/sops/${sopId}/edit?version=${calculateNextVersion()}`)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
          <DialogDescription>
            Create a new version of this SOP. The current version is {currentVersion}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Version Type</Label>
            <RadioGroup
              value={versionType}
              onValueChange={(value) => setVersionType(value as "minor" | "major")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="minor" id="minor" />
                <div>
                  <Label htmlFor="minor" className="font-medium">
                    Minor Update (v{currentVersion.split(".")[0]}.{Number.parseInt(currentVersion.split(".")[1]) + 1})
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Small changes, clarifications, or corrections that don't fundamentally change the procedure.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="major" id="major" />
                <div>
                  <Label htmlFor="major" className="font-medium">
                    Major Update (v{Number.parseInt(currentVersion.split(".")[0]) + 1}.0)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Substantial changes that significantly alter procedures or require retraining.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next-version">Next Version</Label>
            <Input id="next-version" value={calculateNextVersion()} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="change-description">Change Description</Label>
            <Textarea
              id="change-description"
              placeholder="Describe the changes in this new version..."
              value={changeDescription}
              onChange={(e) => setChangeDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create New Version"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

