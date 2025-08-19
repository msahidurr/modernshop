import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { updateOrderStatus } from "@/lib/data-access"
import type { Order } from "@/lib/types"

// PUT /api/admin/orders/[id]/status - Update order status (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid order status" }, { status: 400 })
    }

    const updatedOrder = await updateOrderStatus(params.id, status)

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Send status update email (simulated)
    await sendOrderStatusUpdateEmail(updatedOrder)

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order status updated successfully",
    })
  } catch (error) {
    console.error("Update order status error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// Simulated email sending for status updates
async function sendOrderStatusUpdateEmail(order: Order): Promise<void> {
  console.log(`[v0] Sending status update email for order ${order.orderNumber} - Status: ${order.status}`)
  // In production, this would integrate with an email service
  await new Promise((resolve) => setTimeout(resolve, 300))
}
