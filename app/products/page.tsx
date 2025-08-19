"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { AuthModals } from "@/components/auth-modals"

interface Product {
  id: string
  name: string
  price: number
  compareAtPrice?: number
  image: string
  rating: number
  reviewCount: number
  brand: string
  category: string
  inventory: number
  featured: boolean
}

interface FilterState {
  search: string
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  inStock: boolean
  featured: boolean
  sortBy: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Available filter options
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    inStock: false,
    featured: false,
    sortBy: "relevance",
  })

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sortBy: filters.sortBy,
      })

      if (filters.search) params.append("q", filters.search)
      if (filters.categories.length > 0) params.append("category", filters.categories[0])
      if (filters.brands.length > 0) params.append("brand", filters.brands[0])
      if (filters.priceRange[0] > 0) params.append("minPrice", filters.priceRange[0].toString())
      if (filters.priceRange[1] < 1000) params.append("maxPrice", filters.priceRange[1].toString())
      if (filters.inStock) params.append("inStock", "true")
      if (filters.featured) params.append("featured", "true")

      const response = await fetch(`/api/products/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.data)
        setTotalPages(data.pagination.totalPages)

        // Update available filters
        if (data.filters) {
          setAvailableCategories(data.filters.categories)
          setAvailableBrands(data.filters.brands)
          setPriceRange([data.filters.priceRange.min, data.filters.priceRange.max])
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts()
  }, [filters, currentPage])

  // Update filter
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      brands: [],
      priceRange: [0, 1000],
      inStock: false,
      featured: false,
      sortBy: "relevance",
    })
  }

  // Toggle category filter
  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]
    updateFilter("categories", newCategories)
  }

  // Toggle brand filter
  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    updateFilter("brands", newBrands)
  }

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.inStock ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">All Products</h1>
          <p className="text-muted-foreground">Discover our complete collection of premium products</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 space-y-6`}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear ({activeFiltersCount})
                    </Button>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-sm">Categories</h4>
                  <div className="space-y-2">
                    {availableCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-sm">Brands</h4>
                  <div className="space-y-2">
                    {availableBrands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={filters.brands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-sm">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                      max={priceRange[1]}
                      min={priceRange[0]}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => updateFilter("inStock", checked)}
                    />
                    <label htmlFor="in-stock" className="text-sm cursor-pointer">
                      In Stock Only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={(checked) => updateFilter("featured", checked)}
                    />
                    <label htmlFor="featured" className="text-sm cursor-pointer">
                      Featured Products
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `${products.length} products found`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.brands.map((brand) => (
                  <Badge key={brand} variant="secondary" className="cursor-pointer" onClick={() => toggleBrand(brand)}>
                    {brand} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.inStock && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter("inStock", false)}>
                    In Stock <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.featured && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter("featured", false)}>
                    Featured <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => updateFilter("priceRange", [0, 1000])}
                  >
                    ${filters.priceRange[0]} - ${filters.priceRange[1]} <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-lg h-64 mb-4"></div>
                    <div className="bg-muted rounded h-4 mb-2"></div>
                    <div className="bg-muted rounded h-4 w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.compareAtPrice}
                    image={product.image}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    isOnSale={!!product.compareAtPrice}
                    isFavorite={false}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                    className="w-10"
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <CartSidebar />
      <AuthModals />
    </div>
  )
}
