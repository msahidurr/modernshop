import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getAllUsers } from "@/lib/data-access"

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || undefined
    const role = searchParams.get("role") || undefined

    const result = await getAllUsers({
      search,
      role,
      page,
      limit,
    })

    // Remove passwords from response
    const usersWithoutPasswords = result.data.map(({ password: _, ...user }) => user)

    return NextResponse.json({
      success: true,
      data: usersWithoutPasswords,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error("Get admin users error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
