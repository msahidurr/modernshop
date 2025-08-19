"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/lib/auth-context"
import { useAdmin } from "@/lib/admin-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { state: authState, openLoginModal } = useAuth()
  const { canAccessAdmin } = useAdmin()

  useEffect(() => {
    if (!authState.isLoading && !canAccessAdmin()) {
      if (!authState.user) {
        openLoginModal()
      } else {
        router.push("/")
      }
    }
  }, [authState.isLoading, canAccessAdmin, authState.user, openLoginModal, router])

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!canAccessAdmin()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
          <p className="text-sm text-muted-foreground">Sign in with demo@example.com to access admin features.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
