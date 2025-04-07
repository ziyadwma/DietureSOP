"use client"

import { useState } from "react"
import { Check, Edit, Image, ListChecks, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { type ChecklistItem, ChecklistModal } from "./checklist-modal"

export type MediaItem = {
  id: string
  name: string
  type: string
  url: string
}

export type ProcessStep = {
  id: string
  number: number
  description: string
  checklist: ChecklistItem[]
  media: MediaItem[]
}

interface ProcessStepProps {
  step: ProcessStep
  onUpdate: (updatedStep: ProcessStep) => void
  onDelete: (id: string) => void
}

export function ProcessStep({ step, onUpdate, onDelete }: ProcessStepProps) {
  const [description, setDescription] = useState(step.description)
  const [isEditing, setIsEditing] = useState(step.description === "")
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false)
  const [isMediaUploading, setIsMediaUploading] = useState(false)

  const handleSaveStep = () => {
    if (description.trim()) {
      onUpdate({
        ...step,
        description: description.trim(),
      })
      setIsEditing(false)
    }
  }

  const handleSaveChecklist = (items: ChecklistItem[]) => {
    onUpdate({
      ...step,
      checklist: items,
    })
  }

  const handleAddMedia = () => {
    // Simulate file upload
    setIsMediaUploading(true)
    setTimeout(() => {
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        name: `Image ${step.media.length + 1}`,
        type: "image",
        url: `/placeholder.svg?height=200&width=300`,
      }

      onUpdate({
        ...step,
        media: [...step.media, newMedia],
      })
      setIsMediaUploading(false)
    }, 1000)
  }

  const handleRemoveMedia = (mediaId: string) => {
    onUpdate({
      ...step,
      media: step.media.filter((m) => m.id !== mediaId),
    })
  }

  return (
    <div className="rounded-lg border p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Step {step.number}</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(step.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Step description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full"
          />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMedia}
                disabled={isMediaUploading}
                className="flex items-center"
              >
                <Image className="mr-2 h-4 w-4" />
                Add Media
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChecklistModalOpen(true)}
                className="flex items-center"
              >
                <ListChecks className="mr-2 h-4 w-4" />
                Add Checklist
              </Button>
            </div>
            <Button type="button" onClick={handleSaveStep} className="bg-[#0f172a] hover:bg-[#1e293b]">
              <Check className="mr-2 h-4 w-4" />
              Save Step
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm">{step.description}</p>

          {step.media.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Media</h4>
              <div className="flex flex-wrap gap-2">
                {step.media.map((media) => (
                  <div key={media.id} className="relative group">
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={media.name}
                      className="h-20 w-20 object-cover rounded border"
                    />
                    <button
                      onClick={() => handleRemoveMedia(media.id)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step.checklist.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Checklist</h4>
              <div className="space-y-1">
                {step.checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                        item.checked ? "bg-primary border-primary" : "border-input"
                      }`}
                    >
                      {item.checked && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsChecklistModalOpen(true)} className="text-xs">
                Edit Checklist
              </Button>
            </div>
          )}

          {step.media.length === 0 && step.checklist.length === 0 && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleAddMedia} className="flex items-center">
                <Image className="mr-2 h-4 w-4" />
                Add Media
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsChecklistModalOpen(true)}
                className="flex items-center"
              >
                <ListChecks className="mr-2 h-4 w-4" />
                Add Checklist
              </Button>
            </div>
          )}
        </div>
      )}

      <ChecklistModal
        stepNumber={step.number}
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
        initialItems={step.checklist}
        onSave={handleSaveChecklist}
      />
    </div>
  )
}

