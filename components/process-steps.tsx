"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProcessStep, type ProcessStep as ProcessStepType } from "./process-step"

interface ProcessStepsProps {
  onStepsChange: (steps: ProcessStepType[]) => void
}

export function ProcessSteps({ onStepsChange }: ProcessStepsProps) {
  const [steps, setSteps] = useState<ProcessStepType[]>([
    {
      id: "1",
      number: 1,
      description: "",
      checklist: [],
      media: [],
    },
  ])

  const addStep = () => {
    const newStep: ProcessStepType = {
      id: Date.now().toString(),
      number: steps.length + 1,
      description: "",
      checklist: [],
      media: [],
    }
    const updatedSteps = [...steps, newStep]
    setSteps(updatedSteps)
    onStepsChange(updatedSteps)
  }

  const updateStep = (updatedStep: ProcessStepType) => {
    const updatedSteps = steps.map((step) => (step.id === updatedStep.id ? updatedStep : step))
    setSteps(updatedSteps)
    onStepsChange(updatedSteps)
  }

  const deleteStep = (id: string) => {
    const filteredSteps = steps.filter((step) => step.id !== id)
    // Renumber steps
    const updatedSteps = filteredSteps.map((step, index) => ({
      ...step,
      number: index + 1,
    }))
    setSteps(updatedSteps)
    onStepsChange(updatedSteps)
  }

  const finishSteps = () => {
    // This would typically validate all steps are complete
    // For now, we'll just log the steps
    console.log("Finished steps:", steps)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Process Steps</h2>

      {steps.map((step) => (
        <ProcessStep key={step.id} step={step} onUpdate={updateStep} onDelete={deleteStep} />
      ))}

      <Separator />

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={addStep} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Step
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex items-center" onClick={finishSteps}>
            <Check className="mr-2 h-4 w-4" />
            Finish Steps
          </Button>
        </div>
      </div>
    </div>
  )
}

