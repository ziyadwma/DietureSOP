import { sops, users, departments } from "./data"
import type { SOP, User, Department } from "./types"

// In a real application, these would be API calls to a backend server
// For now, we'll simulate API calls with local data and localStorage

// Helper to simulate API latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Initialize data from localStorage if available - moved to the top for immediate execution
const initializeDataSync = () => {
  try {
    if (typeof window !== "undefined") {
      const storedSops = localStorage.getItem("sops")
      const storedUsers = localStorage.getItem("users")
      const storedDepts = localStorage.getItem("departments")

      if (storedSops) {
        const parsedSops = JSON.parse(storedSops)
        sops.length = 0
        sops.push(...parsedSops)
      }

      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        users.length = 0
        users.push(...parsedUsers)
      }

      if (storedDepts) {
        const parsedDepts = JSON.parse(storedDepts)
        departments.length = 0
        departments.push("All", ...parsedDepts)
      }
    }
  } catch (error) {
    console.error("Error initializing data from localStorage:", error)
  }
}

// Run initialization immediately
if (typeof window !== "undefined") {
  initializeDataSync()
}

// SOP API functions
export const SOPService = {
  async getAll(): Promise<SOP[]> {
    await delay(300) // Simulate network delay
    return [...sops]
  },

  async getById(id: string): Promise<SOP | null> {
    await delay(200)
    const foundSop = sops.find((sop) => sop.id === id)
    console.log(`Getting SOP by ID ${id}:`, foundSop ? "Found" : "Not found")
    return foundSop || null
  },

  async create(sopData: Partial<SOP>): Promise<SOP> {
    await delay(500)

    // Generate a unique ID
    const id = Math.random().toString(36).substring(2, 9)
    console.log("Creating SOP with ID:", id)

    const newSop: SOP = {
      id,
      title: sopData.title || "",
      department: sopData.department || "",
      version: "1.0",
      status: "draft",
      createdBy: sopData.createdBy || "",
      approvedBy: null,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      content: sopData.content || "",
      objective: sopData.objective || "",
      scope: sopData.scope || "",
      responsibilities: sopData.responsibilities || "",
      exceptions: sopData.exceptions || "",
      references: sopData.references || "",
      author: sopData.author || "",
      revisions: [
        {
          version: "1.0",
          date: new Date().toISOString().split("T")[0],
          author: sopData.author || "Unknown",
          changes: "Initial document creation",
          status: "draft",
        },
      ],
    }

    // In a real app, this would be an API call
    // For now, we'll update our local data
    sops.push(newSop)
    console.log("SOP added to array, new length:", sops.length)

    // Save to localStorage for persistence
    try {
      // Get the latest data from localStorage to avoid overwriting other changes
      let existingSops = []
      try {
        const storedSops = localStorage.getItem("sops")
        existingSops = storedSops ? JSON.parse(storedSops) : []
      } catch (e) {
        console.error("Error parsing stored SOPs:", e)
        existingSops = []
      }

      // Add the new SOP and save back to localStorage
      const updatedSops = [...existingSops, newSop]
      localStorage.setItem("sops", JSON.stringify(updatedSops))
      console.log("SOP saved to localStorage")
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return newSop
  },

  async update(id: string, sopData: Partial<SOP>): Promise<SOP> {
    await delay(500)

    const index = sops.findIndex((sop) => sop.id === id)
    if (index === -1) throw new Error("SOP not found")

    const updatedSop = {
      ...sops[index],
      ...sopData,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    sops[index] = updatedSop

    // Save to localStorage for persistence
    try {
      // Get the latest data from localStorage
      let existingSops = []
      try {
        const storedSops = localStorage.getItem("sops")
        existingSops = storedSops ? JSON.parse(storedSops) : []
      } catch (e) {
        console.error("Error parsing stored SOPs:", e)
        existingSops = []
      }

      // Update the SOP in the array
      const updatedSops = existingSops.map((sop: SOP) => (sop.id === id ? updatedSop : sop))
      localStorage.setItem("sops", JSON.stringify(updatedSops))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return updatedSop
  },

  async createNewVersion(
    id: string,
    versionData: {
      versionType: "minor" | "major"
      changes: string
    },
  ): Promise<SOP> {
    await delay(500)

    const sop = sops.find((sop) => sop.id === id)
    if (!sop) throw new Error("SOP not found")

    const [major, minor] = sop.version.split(".").map(Number)
    const newVersion = versionData.versionType === "major" ? `${major + 1}.0` : `${major}.${minor + 1}`

    const newRevision = {
      version: newVersion,
      date: new Date().toISOString().split("T")[0],
      author: versionData.changes,
      changes: versionData.changes,
      status: "draft",
    }

    const updatedSop = {
      ...sop,
      version: newVersion,
      status: "draft",
      updatedAt: new Date().toISOString().split("T")[0],
      revisions: [...sop.revisions, newRevision],
    }

    const index = sops.findIndex((s) => s.id === id)
    sops[index] = updatedSop

    // Save to localStorage for persistence
    try {
      // Get the latest data from localStorage
      let existingSops = []
      try {
        const storedSops = localStorage.getItem("sops")
        existingSops = storedSops ? JSON.parse(storedSops) : []
      } catch (e) {
        console.error("Error parsing stored SOPs:", e)
        existingSops = []
      }

      // Update the SOP in the array
      const updatedSops = existingSops.map((s: SOP) => (s.id === id ? updatedSop : s))
      localStorage.setItem("sops", JSON.stringify(updatedSops))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return updatedSop
  },

  async changeStatus(id: string, status: string, comment?: string): Promise<SOP> {
    await delay(300)

    const index = sops.findIndex((sop) => sop.id === id)
    if (index === -1) throw new Error("SOP not found")

    const updatedSop = {
      ...sops[index],
      status,
      updatedAt: new Date().toISOString().split("T")[0],
    }

    sops[index] = updatedSop

    // Save to localStorage for persistence
    try {
      // Get the latest data from localStorage
      let existingSops = []
      try {
        const storedSops = localStorage.getItem("sops")
        existingSops = storedSops ? JSON.parse(storedSops) : []
      } catch (e) {
        console.error("Error parsing stored SOPs:", e)
        existingSops = []
      }

      // Update the SOP in the array
      const updatedSops = existingSops.map((sop: SOP) => (sop.id === id ? updatedSop : sop))
      localStorage.setItem("sops", JSON.stringify(updatedSops))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return updatedSop
  },

  async delete(id: string): Promise<boolean> {
    await delay(300)

    const index = sops.findIndex((sop) => sop.id === id)
    if (index === -1) return false

    sops.splice(index, 1)

    // Save to localStorage for persistence
    try {
      // Get the latest data from localStorage
      let existingSops = []
      try {
        const storedSops = localStorage.getItem("sops")
        existingSops = storedSops ? JSON.parse(storedSops) : []
      } catch (e) {
        console.error("Error parsing stored SOPs:", e)
        existingSops = []
      }

      // Remove the SOP from the array
      const updatedSops = existingSops.filter((sop: SOP) => sop.id !== id)
      localStorage.setItem("sops", JSON.stringify(updatedSops))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return true
  },
}

// User API functions
export const UserService = {
  async getAll(): Promise<User[]> {
    await delay(300)
    return [...users]
  },

  async getById(id: string): Promise<User | null> {
    await delay(200)
    return users.find((user) => user.id === id) || null
  },

  async create(userData: Partial<User>): Promise<User> {
    await delay(500)

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      username: userData.username || "",
      password: userData.password || "",
      name: userData.name || "",
      role: userData.role || "staff",
      departments: userData.departments || [],
    }

    users.push(newUser)

    // Save to localStorage for persistence
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return newUser
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    await delay(500)

    const index = users.findIndex((user) => user.id === id)
    if (index === -1) throw new Error("User not found")

    const updatedUser = {
      ...users[index],
      ...userData,
    }

    users[index] = updatedUser

    // Save to localStorage for persistence
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = existingUsers.map((user: User) => (user.id === id ? updatedUser : user))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return updatedUser
  },

  async delete(id: string): Promise<boolean> {
    await delay(300)

    const index = users.findIndex((user) => user.id === id)
    if (index === -1) return false

    users.splice(index, 1)

    // Save to localStorage for persistence
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = existingUsers.filter((user: User) => user.id !== id)
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return true
  },
}

// Department API functions
export const DepartmentService = {
  async getAll(): Promise<Department[]> {
    await delay(300)
    return [...departments].filter((dept) => dept !== "All")
  },

  async create(name: string): Promise<Department> {
    await delay(500)

    if (departments.includes(name)) {
      throw new Error("Department already exists")
    }

    departments.push(name)

    // Save to localStorage for persistence
    try {
      const existingDepts = JSON.parse(localStorage.getItem("departments") || "[]")
      localStorage.setItem("departments", JSON.stringify([...existingDepts, name]))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return name
  },

  async update(oldName: string, newName: string): Promise<Department> {
    await delay(500)

    const index = departments.findIndex((dept) => dept === oldName)
    if (index === -1) throw new Error("Department not found")

    departments[index] = newName

    // Save to localStorage for persistence
    try {
      const existingDepts = JSON.parse(localStorage.getItem("departments") || "[]")
      const updatedDepts = existingDepts.map((dept: string) => (dept === oldName ? newName : dept))
      localStorage.setItem("departments", JSON.stringify(updatedDepts))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return newName
  },

  async delete(name: string): Promise<boolean> {
    await delay(300)

    const index = departments.findIndex((dept) => dept === name)
    if (index === -1) return false

    departments.splice(index, 1)

    // Save to localStorage for persistence
    try {
      const existingDepts = JSON.parse(localStorage.getItem("departments") || "[]")
      const updatedDepts = existingDepts.filter((dept: string) => dept !== name)
      localStorage.setItem("departments", JSON.stringify(updatedDepts))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    return true
  },
}

// Initialize data from localStorage if available - keep this for backward compatibility
export const initializeData = () => {
  try {
    if (typeof window !== "undefined") {
      const storedSops = localStorage.getItem("sops")
      const storedUsers = localStorage.getItem("users")
      const storedDepts = localStorage.getItem("departments")

      if (storedSops) {
        const parsedSops = JSON.parse(storedSops)
        sops.length = 0
        sops.push(...parsedSops)
      }

      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        users.length = 0
        users.push(...parsedUsers)
      }

      if (storedDepts) {
        const parsedDepts = JSON.parse(storedDepts)
        departments.length = 0
        departments.push("All", ...parsedDepts)
      }
    }
  } catch (error) {
    console.error("Error initializing data from localStorage:", error)
  }
}

