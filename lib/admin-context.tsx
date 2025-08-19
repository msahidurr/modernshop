"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useAuth } from "./auth-context"

interface AdminContextType {
  isAdmin: boolean
  canAccessAdmin: () => boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { state: authState } = useAuth()

  // In a real app, this would check user roles from the backend
  // For demo purposes, we'll make the demo user an admin
  const isAdmin = authState.user?.email === "demo@example.com"

  const canAccessAdmin = () => {
    return isAdmin && authState.user !== null
  }

  const value: AdminContextType = {
    isAdmin,
    canAccessAdmin,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
