import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, validatePassword, hashPassword, verifyPassword } from "@/lib/auth-utils"
import { getUserById, updateUser } from "@/lib/data-access"

// PUT /api/user/password - Change password
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required" },
        { status: 400 },
      )
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json({ success: false, error: passwordValidation.message }, { status: 400 })
    }

    const user = await getUserById(currentUser.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    const updatedUser = await updateUser(currentUser.userId, {
      password: hashedNewPassword,
    })

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
