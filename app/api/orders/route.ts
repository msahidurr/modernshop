import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getOrders, createOrder, getProductById, updateProduct } from "@/lib/data-access"
import type { Order, OrderItem } from "@/lib/types"

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || undefined

    const result = await getOrders({
      userId: currentUser.userId,
      status,
      page,
      limit,
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, billingAddress, paymentMethod, paymentDetails } = body

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Order must contain at least one item" }, { status: 400 })
    }

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { success: false, error: "Shipping and billing addresses are required" },
        { status: 400 },
      )
    }

    if (!paymentMethod) {
      return NextResponse.json({ success: false, error: "Payment method is required" }, { status: 400 })
    }

    // Validate and process order items
    const orderItems: OrderItem[] = []
    let subtotal = 0

    for (const item of items) {
      // Get current product data
      const product = await getProductById(item.productId)
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.productId}` }, { status: 400 })
      }

      // Check inventory
      if (product.inventory < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient inventory for ${product.name}` },
          { status: 400 },
        )
      }

      // Create order item
      const orderItem: OrderItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderId: "", // Will be set after order creation
        productId: product.id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: product.price,
        total: product.price * item.quantity,
        productSnapshot: {
          name: product.name,
          image: product.images[0] || "/placeholder.svg",
          sku: product.sku,
        },
      }

      orderItems.push(orderItem)
      subtotal += orderItem.total

      // Update product inventory
      await updateProduct(product.id, {
        inventory: product.inventory - item.quantity,
      })
    }

    // Calculate totals
    const shipping = subtotal > 100 ? 0 : 9.99
    const tax = subtotal * 0.08 // 8% tax rate
    const total = subtotal + shipping + tax

    // Process payment (simulated)
    const paymentResult = await processPayment({
      amount: total,
      currency: "USD",
      paymentMethod,
      paymentDetails,
    })

    if (!paymentResult.success) {
      // Restore inventory if payment fails
      for (const item of items) {
        const product = await getProductById(item.productId)
        if (product) {
          await updateProduct(product.id, {
            inventory: product.inventory + item.quantity,
          })
        }
      }
      return NextResponse.json({ success: false, error: paymentResult.error }, { status: 400 })
    }

    // Create order
    const orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt"> = {
      userId: currentUser.userId,
      status: "pending",
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      currency: "USD",
      shippingAddress: {
        ...shippingAddress,
        id: `addr-${Date.now()}`,
        userId: currentUser.userId,
        type: "shipping" as const,
      },
      billingAddress: {
        ...billingAddress,
        id: `addr-${Date.now() + 1}`,
        userId: currentUser.userId,
        type: "billing" as const,
      },
      paymentMethod,
      paymentStatus: "paid",
    }

    const newOrder = await createOrder(orderData)

    // Update order items with order ID
    newOrder.items = newOrder.items.map((item) => ({
      ...item,
      orderId: newOrder.id,
    }))

    // Send confirmation email (simulated)
    await sendOrderConfirmationEmail(newOrder, currentUser.email)

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// Simulated payment processing
async function processPayment(paymentData: {
  amount: number
  currency: string
  paymentMethod: string
  paymentDetails: any
}): Promise<{ success: boolean; error?: string; transactionId?: string }> {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate payment validation
  if (paymentData.paymentDetails?.cardNumber === "4000000000000002") {
    return { success: false, error: "Payment declined - insufficient funds" }
  }

  if (paymentData.paymentDetails?.cardNumber === "4000000000000119") {
    return { success: false, error: "Payment declined - processing error" }
  }

  // Simulate successful payment
  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
}

// Simulated email sending
async function sendOrderConfirmationEmail(order: Order, email: string): Promise<void> {
  console.log(`[v0] Sending order confirmation email to ${email} for order ${order.orderNumber}`)
  // In production, this would integrate with an email service like SendGrid, Mailgun, etc.
  await new Promise((resolve) => setTimeout(resolve, 500))
}
