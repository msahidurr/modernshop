import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/data-access"

// GET /api/products/search - Advanced product search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params = {
      search: searchParams.get("q") || searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined,
      brand: searchParams.get("brand") || undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
      inStock: searchParams.get("inStock") === "true" ? true : undefined,
      sortBy: searchParams.get("sortBy") || "relevance", // relevance, price_asc, price_desc, name, newest
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "12"),
    }

    // Get products with basic filtering
    const result = await getProducts({
      category: params.category,
      featured: params.featured,
      search: params.search,
      page: params.page,
      limit: params.limit,
    })

    // Apply additional client-side filtering (in production, this would be done in the database)
    let filteredProducts = result.data

    // Price filtering
    if (params.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.price >= params.minPrice!)
    }
    if (params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.price <= params.maxPrice!)
    }

    // Brand filtering
    if (params.brand) {
      filteredProducts = filteredProducts.filter((product) =>
        product.brand.toLowerCase().includes(params.brand!.toLowerCase()),
      )
    }

    // In stock filtering
    if (params.inStock) {
      filteredProducts = filteredProducts.filter((product) => product.inventory > 0)
    }

    // Sorting
    switch (params.sortBy) {
      case "price_asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "name":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        // Keep relevance order (default from search)
        break
    }

    // Get unique brands and categories for filters
    const brands = [...new Set(result.data.map((product) => product.brand))].sort()
    const categories = [...new Set(result.data.map((product) => product.category))].sort()
    const priceRange = {
      min: Math.min(...result.data.map((product) => product.price)),
      max: Math.max(...result.data.map((product) => product.price)),
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
      pagination: {
        ...result.pagination,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / params.limit),
      },
      filters: {
        brands,
        categories,
        priceRange,
      },
      appliedFilters: {
        search: params.search,
        category: params.category,
        brand: params.brand,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        featured: params.featured,
        inStock: params.inStock,
        sortBy: params.sortBy,
      },
    })
  } catch (error) {
    console.error("Product search error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
