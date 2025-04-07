"use client"

import { useState } from "react"
import { Check, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export type ChecklistItem = {
  id: string
  text: string
  checked: boolean
}

interface ChecklistModalProps {
  stepNumber: number
  isOpen: boolean
  onClose: () => void
  initialItems?: ChecklistItem[]
  onSave: (items: ChecklistItem[]) => void
}

export function ChecklistModal({ stepNumber, isOpen, onClose, initialItems = [], onSave }: ChecklistModalProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems)
  const [newItemText, setNewItemText] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText,
        checked: false,
      }
      setItems([...items, newItem])
      setNewItemText("")
      setErrors({})
    } else {
      setErrors({ newItem: "Please enter an item" })
    }
  }

  const updateItem = (id: string, text: string) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, text } : item))
    setItems(updatedItems)

    // Clear error if text is not empty
    if (text.trim()) {
      const newErrors = { ...errors }
      delete newErrors[id]
      setErrors(newErrors)
    }
  }

  const toggleItem = (id: string) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    setItems(updatedItems)
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    const newErrors = { ...errors }
    delete newErrors[id]
    setErrors(newErrors)
  }

  const handleSave = () => {
    // Validate all items have text
    const newErrors: { [key: string]: string } = {}
    items.forEach((item) => {
      if (!item.text.trim()) {
        newErrors[item.id] = "Checklist item is required"
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(items)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Step {stepNumber} Checklist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a new checklist item"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className={errors.newItem ? "border-red-500" : ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addItem()
                }
              }}
            />
          </div>
          {errors.newItem && <p className="text-sm text-red-500">{errors.newItem}</p>}

          <Button type="button" variant="outline" onClick={addItem} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>

          <div className="space-y-2 mt-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border ${
                    item.checked ? "bg-primary border-primary" : "border-input"
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  {item.checked && <Check className="h-4 w-4 text-primary-foreground" />}
                </div>
                <Input
                  value={item.text}
                  onChange={(e) => updateItem(item.id, e.target.value)}
                  className={errors[item.id] ? "border-red-500" : ""}
                />
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" onClick={() => toggleItem(item.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {Object.values(errors).filter((error) => error !== errors.newItem).length > 0 && (
            <p className="text-sm text-red-500">Checklist item is required</p>
          )}
        </div>
        <div className="flex justify-end">
          <Button type="button" variant="default" onClick={handleSave} className="bg-[#0f172a] hover:bg-[#1e293b]">
            Save Checklist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

