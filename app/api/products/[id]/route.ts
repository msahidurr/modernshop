import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/data-access"
import { getCurrentUser } from "@/lib/auth-utils"

// GET /api/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(params.id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updates = { ...body }

    // Validation for numeric fields
    if (updates.price !== undefined && updates.price <= 0) {
      return NextResponse.json({ success: false, error: "Price must be greater than 0" }, { status: 400 })
    }

    if (updates.inventory !== undefined && updates.inventory < 0) {
      return NextResponse.json({ success: false, error: "Inventory cannot be negative" }, { status: 400 })
    }

    // Convert string numbers to actual numbers
    if (updates.price) updates.price = Number.parseFloat(updates.price)
    if (updates.compareAtPrice) updates.compareAtPrice = Number.parseFloat(updates.compareAtPrice)
    if (updates.inventory !== undefined) updates.inventory = Number.parseInt(updates.inventory)

    const updatedProduct = await updateProduct(params.id, updates)

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const success = await deleteProduct(params.id)

    if (!success) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
