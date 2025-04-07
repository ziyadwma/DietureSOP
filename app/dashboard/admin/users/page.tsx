"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { canManageUsers, generateId, getRoleText } from "@/lib/utils"
import { departments as allDepartments, users as initialUsers } from "@/lib/data"

export default function ManageUsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<any>(null)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    role: "",
    departments: [] as string[],
  })

  useEffect(() => {
    // Check if user has permission to manage users
    if (user && !canManageUsers(user.role)) {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to manage users.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    // Load users and departments
    setUsers(initialUsers)
    setDepartments(allDepartments.filter((dept) => dept !== "All"))
  }, [user, router, toast])

  const handleAddUser = () => {
    // Validate form
    if (!newUser.username || !newUser.password || !newUser.name || !newUser.role || newUser.departments.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Check if username already exists
    if (users.some((u) => u.username === newUser.username)) {
      toast({
        title: "Validation Error",
        description: "Username already exists.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    const newUserWithId = {
      ...newUser,
      id: generateId(),
    }
    setUsers([...users, newUserWithId])
    setNewUser({
      username: "",
      password: "",
      name: "",
      role: "",
      departments: [],
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "User added successfully.",
    })
  }

  const handleEditUser = () => {
    if (!userToEdit) return

    // Validate form
    if (!userToEdit.username || !userToEdit.name || !userToEdit.role || userToEdit.departments.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Check if username already exists (excluding current user)
    if (users.some((u) => u.username === userToEdit.username && u.id !== userToEdit.id)) {
      toast({
        title: "Validation Error",
        description: "Username already exists.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    const updatedUsers = users.map((u) => (u.id === userToEdit.id ? userToEdit : u))
    setUsers(updatedUsers)
    setUserToEdit(null)
    setIsEditDialogOpen(false)

    toast({
      title: "Success",
      description: "User updated successfully.",
    })
  }

  const handleDeleteUser = () => {
    if (!userToDelete) return

    // In a real app, this would be an API call
    const updatedUsers = users.filter((u) => u.id !== userToDelete)
    setUsers(updatedUsers)
    setUserToDelete(null)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Success",
      description: "User deleted successfully.",
    })
  }

  const handleDepartmentChange = (department: string, checked: boolean, isNewUser: boolean) => {
    if (isNewUser) {
      if (checked) {
        setNewUser({
          ...newUser,
          departments: [...newUser.departments, department],
        })
      } else {
        setNewUser({
          ...newUser,
          departments: newUser.departments.filter((d) => d !== department),
        })
      }
    } else {
      if (!userToEdit) return

      if (checked) {
        setUserToEdit({
          ...userToEdit,
          departments: [...userToEdit.departments, department],
        })
      } else {
        setUserToEdit({
          ...userToEdit,
          departments: userToEdit.departments.filter((d: string) => d !== department),
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">Create, edit, and delete users in the system</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Create a new user in the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="writer">SOP Writer</SelectItem>
                    <SelectItem value="approver">SOP Approver</SelectItem>
                    <SelectItem value="department_head">Department Head</SelectItem>
                    <SelectItem value="staff">General Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Departments</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {departments.map((department) => (
                    <div key={department} className="flex items-center space-x-2">
                      <Checkbox
                        id={`department-${department}`}
                        checked={newUser.departments.includes(department)}
                        onCheckedChange={(checked) => handleDepartmentChange(department, checked as boolean, true)}
                      />
                      <Label htmlFor={`department-${department}`} className="text-sm font-normal">
                        {department}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>Manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{getRoleText(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.departments.map((dept: string) => (
                          <span
                            key={dept}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                          >
                            {dept}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog
                          open={isEditDialogOpen && userToEdit?.id === user.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open)
                            if (!open) setUserToEdit(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setUserToEdit({ ...user })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>Update user information</DialogDescription>
                            </DialogHeader>
                            {userToEdit && (
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-username">Username</Label>
                                    <Input
                                      id="edit-username"
                                      placeholder="Enter username"
                                      value={userToEdit.username}
                                      onChange={(e) =>
                                        setUserToEdit({
                                          ...userToEdit,
                                          username: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
                                    <Input
                                      id="edit-password"
                                      type="password"
                                      placeholder="Enter new password"
                                      value={userToEdit.password || ""}
                                      onChange={(e) =>
                                        setUserToEdit({
                                          ...userToEdit,
                                          password: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Full Name</Label>
                                  <Input
                                    id="edit-name"
                                    placeholder="Enter full name"
                                    value={userToEdit.name}
                                    onChange={(e) =>
                                      setUserToEdit({
                                        ...userToEdit,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-role">Role</Label>
                                  <Select
                                    value={userToEdit.role}
                                    onValueChange={(value) =>
                                      setUserToEdit({
                                        ...userToEdit,
                                        role: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger id="edit-role">
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="super_admin">Super Admin</SelectItem>
                                      <SelectItem value="writer">SOP Writer</SelectItem>
                                      <SelectItem value="approver">SOP Approver</SelectItem>
                                      <SelectItem value="department_head">Department Head</SelectItem>
                                      <SelectItem value="staff">General Staff</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Departments</Label>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {departments.map((department) => (
                                      <div key={department} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`edit-department-${department}`}
                                          checked={userToEdit.departments.includes(department)}
                                          onCheckedChange={(checked) =>
                                            handleDepartmentChange(department, checked as boolean, false)
                                          }
                                        />
                                        <Label
                                          htmlFor={`edit-department-${department}`}
                                          className="text-sm font-normal"
                                        >
                                          {department}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditUser}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={isDeleteDialogOpen && userToDelete === user.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open)
                            if (!open) setUserToDelete(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setUserToDelete(user.id)}
                              disabled={user.role === "super_admin" && user.id === "1"}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete User</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this user? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteUser}>
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

