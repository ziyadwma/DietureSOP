"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { UserService } from "./api-service"
import type { User } from "./types"

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    try {
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("sop_user") : null
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const users = await UserService.getAll()
      const foundUser = users.find((u) => u.username === username && u.password === password)

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("sop_user", JSON.stringify(userWithoutPassword))
          }
        } catch (error) {
          console.error("Error saving user to localStorage:", error)
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sop_user")
      }
    } catch (error) {
      console.error("Error removing user from localStorage:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

