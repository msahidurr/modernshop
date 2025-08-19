"use client"

import type React from "react"

import { useState } from "react"
import { X, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export function AuthModals() {
  const { state, login, signup, closeAllModals, openLoginModal, openSignupModal } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(formData.email, formData.password)
    if (!result.success) {
      setError(result.error || "Login failed")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signup(formData.firstName, formData.lastName, formData.email, formData.password)
    if (!result.success) {
      setError(result.error || "Signup failed")
    }
  }

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "", password: "" })
    setError("")
    setShowPassword(false)
  }

  const handleClose = () => {
    closeAllModals()
    resetForm()
  }

  if (!state.isLoginModalOpen && !state.isSignupModalOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-serif font-semibold">
              {state.isLoginModalOpen ? "Sign In" : "Create Account"}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Demo Credentials Notice */}
            {state.isLoginModalOpen && (
              <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>Email: demo@example.com</p>
                <p>Password: password</p>
              </div>
            )}

            <form onSubmit={state.isLoginModalOpen ? handleLogin : handleSignup} className="space-y-4">
              {/* Name fields for signup */}
              {state.isSignupModalOpen && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {state.isSignupModalOpen && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters with uppercase and lowercase letters
                  </p>
                )}
              </div>

              {/* Error message */}
              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {state.isLoginModalOpen ? "Signing In..." : "Creating Account..."}
                  </>
                ) : state.isLoginModalOpen ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Switch between login/signup */}
            <div className="mt-6 text-center text-sm">
              {state.isLoginModalOpen ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      resetForm()
                      openSignupModal()
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      resetForm()
                      openLoginModal()
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
