import { type NextRequest, NextResponse } from "next/server"
import { getCategories } from "@/lib/data-access"
import { getCurrentUser } from "@/lib/auth-utils"
import { mockCategories } from "@/lib/mock-data"
import type { Category } from "@/lib/types"

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await getCategories()

    return NextResponse.json({
      success: true,
      categories,
    })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/categories - Create new category (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUser(request)
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, image, parentId, sortOrder } = body

    // Validation
    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Missing required fields: name, slug" }, { status: 400 })
    }

    // Check if slug already exists
    const existingCategory = mockCategories.find((cat) => cat.slug === slug)
    if (existingCategory) {
      return NextResponse.json({ success: false, error: "Category with this slug already exists" }, { status: 409 })
    }

    // Create category
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim(),
      image,
      parentId,
      sortOrder: Number.parseInt(sortOrder) || mockCategories.length + 1,
      isActive: true,
    }

    mockCategories.push(newCategory)

    return NextResponse.json({
      success: true,
      category: newCategory,
    })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
