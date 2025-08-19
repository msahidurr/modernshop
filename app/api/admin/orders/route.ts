import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getOrders } from "@/lib/data-access"

// GET /api/admin/orders - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") || undefined
    const userId = searchParams.get("userId") || undefined

    const result = await getOrders({
      userId,
      status,
      page,
      limit,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Get admin orders error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
