import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getUserById, updateUser } from "@/lib/data-access"

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(currentUser.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, dateOfBirth } = body

    // Validation
    if (!firstName || !lastName) {
      return NextResponse.json({ success: false, error: "First name and last name are required" }, { status: 400 })
    }

    const updates = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() || "",
      dateOfBirth: dateOfBirth || undefined,
    }

    const updatedUser = await updateUser(currentUser.userId, updates)
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Return updated user data without password
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update user profile error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
