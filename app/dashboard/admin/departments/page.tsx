"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { canManageDepartments } from "@/lib/utils"
import { departments as initialDepartments } from "@/lib/data"

export default function ManageDepartmentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [departments, setDepartments] = useState<string[]>([])
  const [newDepartment, setNewDepartment] = useState("")
  const [editDepartment, setEditDepartment] = useState({ index: -1, name: "" })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(-1)

  useEffect(() => {
    // Check if user has permission to manage departments
    if (user && !canManageDepartments(user.role)) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to manage departments.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    // Load departments
    setDepartments(initialDepartments.filter((dept) => dept !== "All"))
  }, [user, router, toast])

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      toast({
        title: "Validation Error",
        description: "Department name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    if (departments.includes(newDepartment.trim())) {
      toast({
        title: "Validation Error",
        description: "Department already exists.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    setDepartments([...departments, newDepartment.trim()])
    setNewDepartment("")
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Department added successfully.",
    })
  }

  const handleEditDepartment = () => {
    if (!editDepartment.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Department name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    if (
      departments.includes(editDepartment.name.trim()) &&
      departments[editDepartment.index] !== editDepartment.name.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Department already exists.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    const updatedDepartments = [...departments]
    updatedDepartments[editDepartment.index] = editDepartment.name.trim()
    setDepartments(updatedDepartments)
    setEditDepartment({ index: -1, name: "" })
    setIsEditDialogOpen(false)

    toast({
      title: "Success",
      description: "Department updated successfully.",
    })
  }

  const handleDeleteDepartment = () => {
    // In a real app, this would be an API call
    const updatedDepartments = [...departments]
    updatedDepartments.splice(departmentToDelete, 1)
    setDepartments(updatedDepartments)
    setDepartmentToDelete(-1)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Success",
      description: "Department deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Departments</h1>
          <p className="text-muted-foreground">Create, edit, and delete departments in the system</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Department</DialogTitle>
              <DialogDescription>Create a new department in the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="department-name">Department Name</Label>
                <Input
                  id="department-name"
                  placeholder="Enter department name"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDepartment}>Add Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments ({departments.length})</CardTitle>
          <CardDescription>Manage all departments in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{department}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog
                          open={isEditDialogOpen && editDepartment.index === index}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setEditDepartment({ index: -1, name: "" })
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditDepartment({ index, name: department })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Department</DialogTitle>
                              <DialogDescription>Update the department name</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-department-name">Department Name</Label>
                                <Input
                                  id="edit-department-name"
                                  placeholder="Enter department name"
                                  value={editDepartment.name}
                                  onChange={(e) =>
                                    setEditDepartment({
                                      ...editDepartment,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditDepartment}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={isDeleteDialogOpen && departmentToDelete === index}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open)
                            if (!open) setDepartmentToDelete(-1)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm" onClick={() => setDepartmentToDelete(index)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Department</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this department? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteDepartment}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
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

