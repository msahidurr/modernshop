import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")
const JWT_ALGORITHM = "HS256"

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token management
export async function createToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Cookie management
export function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export function removeAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = cookies()
  return cookieStore.get("auth-token")?.value || null
}

// Get current user from request
export async function getCurrentUser(request?: NextRequest): Promise<JWTPayload | null> {
  let token: string | null = null

  if (request) {
    // For middleware/API routes
    token = request.cookies.get("auth-token")?.value || null
  } else {
    // For server components
    token = await getAuthToken()
  }

  if (!token) return null

  return verifyToken(token)
}

// Validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long" }
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase and one lowercase letter" }
  }
  return { valid: true }
}
