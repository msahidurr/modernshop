import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/data-access"
import { getCurrentUser } from "@/lib/auth-utils"

// GET /api/products - Get products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      category: searchParams.get("category") || undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
      search: searchParams.get("search") || undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "12"),
    }

    const result = await getProducts(params)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      subcategory,
      brand,
      sku,
      inventory,
      images,
      tags,
      status,
      featured,
      variants,
    } = body

    // Validation
    if (!name || !description || !price || !category || !brand || !sku) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, description, price, category, brand, sku" },
        { status: 400 },
      )
    }

    if (price <= 0) {
      return NextResponse.json({ success: false, error: "Price must be greater than 0" }, { status: 400 })
    }

    if (inventory < 0) {
      return NextResponse.json({ success: false, error: "Inventory cannot be negative" }, { status: 400 })
    }

    // Create product
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: Number.parseFloat(price),
      compareAtPrice: compareAtPrice ? Number.parseFloat(compareAtPrice) : undefined,
      category: category.trim(),
      subcategory: subcategory?.trim(),
      brand: brand.trim(),
      sku: sku.trim(),
      inventory: Number.parseInt(inventory) || 0,
      images: images || [],
      tags: tags || [],
      status: status || "active",
      featured: Boolean(featured),
      variants: variants || [],
      seoTitle: `${name} - ${brand}`,
      seoDescription: description.substring(0, 160),
    }

    const newProduct = await createProduct(productData)

    return NextResponse.json({
      success: true,
      product: newProduct,
    })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
