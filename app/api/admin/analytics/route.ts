import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getAnalytics } from "@/lib/data-access"

// GET /api/admin/analytics - Get analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const analytics = await getAnalytics()

    return NextResponse.json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
