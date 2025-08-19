"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  role: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isLoginModalOpen: boolean
  isSignupModalOpen: boolean
}

type AuthAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "OPEN_LOGIN_MODAL" }
  | { type: "CLOSE_LOGIN_MODAL" }
  | { type: "OPEN_SIGNUP_MODAL" }
  | { type: "CLOSE_SIGNUP_MODAL" }
  | { type: "CLOSE_ALL_MODALS" }

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isLoginModalOpen: false,
  isSignupModalOpen: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "OPEN_LOGIN_MODAL":
      return {
        ...state,
        isLoginModalOpen: true,
        isSignupModalOpen: false,
      }
    case "CLOSE_LOGIN_MODAL":
      return {
        ...state,
        isLoginModalOpen: false,
      }
    case "OPEN_SIGNUP_MODAL":
      return {
        ...state,
        isSignupModalOpen: true,
        isLoginModalOpen: false,
      }
    case "CLOSE_SIGNUP_MODAL":
      return {
        ...state,
        isSignupModalOpen: false,
      }
    case "CLOSE_ALL_MODALS":
      return {
        ...state,
        isLoginModalOpen: false,
        isSignupModalOpen: false,
      }
    default:
      return state
  }
}

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  openLoginModal: () => void
  closeLoginModal: () => void
  openSignupModal: () => void
  closeSignupModal: () => void
  closeAllModals: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from server on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            dispatch({ type: "SET_USER", payload: data.user })
          } else {
            dispatch({ type: "SET_USER", payload: null })
          }
        } else {
          dispatch({ type: "SET_USER", payload: null })
        }
      } catch (error) {
        console.error("Failed to load user:", error)
        dispatch({ type: "SET_USER", payload: null })
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        dispatch({ type: "SET_USER", payload: data.user })
        dispatch({ type: "CLOSE_ALL_MODALS" })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, email, password }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        dispatch({ type: "SET_USER", payload: data.user })
        dispatch({ type: "CLOSE_ALL_MODALS" })
        return { success: true }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
        return { success: false, error: data.error || "Signup failed" }
      }
    } catch (error) {
      console.error("Signup error:", error)
      dispatch({ type: "SET_LOADING", payload: false })
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      dispatch({ type: "SET_USER", payload: null })
      dispatch({ type: "CLOSE_ALL_MODALS" })
    }
  }

  const openLoginModal = () => dispatch({ type: "OPEN_LOGIN_MODAL" })
  const closeLoginModal = () => dispatch({ type: "CLOSE_LOGIN_MODAL" })
  const openSignupModal = () => dispatch({ type: "OPEN_SIGNUP_MODAL" })
  const closeSignupModal = () => dispatch({ type: "CLOSE_SIGNUP_MODAL" })
  const closeAllModals = () => dispatch({ type: "CLOSE_ALL_MODALS" })

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    closeAllModals,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
