import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth-utils"

export async function POST() {
  try {
    // Remove the auth cookie
    removeAuthCookie()

    return NextResponse.json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
