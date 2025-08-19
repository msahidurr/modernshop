import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getUserById, updateUser } from "@/lib/data-access"

// PUT /api/admin/users/[id] - Update user (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { role, firstName, lastName, phone } = body

    // Validation
    if (role && !["customer", "admin"].includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 })
    }

    const user = await getUserById(params.id)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Prevent admin from changing their own role
    if (currentUser.userId === params.id && role && role !== user.role) {
      return NextResponse.json({ success: false, error: "Cannot change your own role" }, { status: 400 })
    }

    const updates: any = {}
    if (role) updates.role = role
    if (firstName) updates.firstName = firstName.trim()
    if (lastName) updates.lastName = lastName.trim()
    if (phone !== undefined) updates.phone = phone?.trim() || ""

    const updatedUser = await updateUser(params.id, updates)
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
    }

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Update admin user error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
