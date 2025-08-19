import type { User, Product, Order, Category, PaginatedResponse } from "./types"
import { mockUsers, mockProducts, mockOrders, mockCategories } from "./mock-data"

// Simulate database operations with in-memory data
// In production, these would be replaced with actual database queries

// User operations
export async function getUserById(id: string): Promise<User | null> {
  // Simulate async database call
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockUsers.find((user) => user.id === id) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockUsers.find((user) => user.email === email) || null
}

export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockUsers.push(newUser)
  return newUser
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const userIndex = mockUsers.findIndex((u) => u.id === id)
  if (userIndex === -1) return null

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockUsers[userIndex]
}

export async function getAllUsers(params?: {
  search?: string
  role?: string
  page?: number
  limit?: number
}): Promise<PaginatedResponse<User>> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  let filteredUsers = [...mockUsers]

  // Apply filters
  if (params?.search) {
    const searchTerm = params.search.toLowerCase()
    filteredUsers = filteredUsers.filter(
      (u) =>
        u.firstName.toLowerCase().includes(searchTerm) ||
        u.lastName.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm),
    )
  }
  if (params?.role) {
    filteredUsers = filteredUsers.filter((u) => u.role === params.role)
  }

  // Sort by creation date (newest first)
  filteredUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Pagination
  const page = params?.page || 1
  const limit = params?.limit || 20
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  return {
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit),
    },
  }
}

// Product operations
export async function getProducts(params?: {
  category?: string
  featured?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  inStock?: boolean
  page?: number
  limit?: number
}): Promise<PaginatedResponse<Product>> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  let filteredProducts = [...mockProducts]

  // Apply filters
  if (params?.category) {
    filteredProducts = filteredProducts.filter((p) => p.category === params.category)
  }
  if (params?.featured !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.featured === params.featured)
  }
  if (params?.search) {
    const searchTerm = params.search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }
  if (params?.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.price >= params.minPrice!)
  }
  if (params?.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.price <= params.maxPrice!)
  }
  if (params?.brand) {
    filteredProducts = filteredProducts.filter((p) => p.brand.toLowerCase().includes(params.brand!.toLowerCase()))
  }
  if (params?.inStock) {
    filteredProducts = filteredProducts.filter((p) => p.inventory > 0)
  }

  // Pagination
  const page = params?.page || 1
  const limit = params?.limit || 12
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  return {
    data: paginatedProducts,
    pagination: {
      page,
      limit,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
    },
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockProducts.find((product) => product.id === id) || null
}

export async function createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockProducts.push(newProduct)
  return newProduct
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const productIndex = mockProducts.findIndex((p) => p.id === id)
  if (productIndex === -1) return null

  mockProducts[productIndex] = {
    ...mockProducts[productIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockProducts[productIndex]
}

export async function deleteProduct(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  const productIndex = mockProducts.findIndex((p) => p.id === id)
  if (productIndex === -1) return false

  mockProducts.splice(productIndex, 1)
  return true
}

// Order operations
export async function getOrders(params?: {
  userId?: string
  status?: string
  page?: number
  limit?: number
}): Promise<PaginatedResponse<Order>> {
  await new Promise((resolve) => setTimeout(resolve, 150))

  let filteredOrders = [...mockOrders]

  if (params?.userId) {
    filteredOrders = filteredOrders.filter((o) => o.userId === params.userId)
  }
  if (params?.status) {
    filteredOrders = filteredOrders.filter((o) => o.status === params.status)
  }

  // Sort by creation date (newest first)
  filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Pagination
  const page = params?.page || 1
  const limit = params?.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

  return {
    data: paginatedOrders,
    pagination: {
      page,
      limit,
      total: filteredOrders.length,
      totalPages: Math.ceil(filteredOrders.length / limit),
    },
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockOrders.find((order) => order.id === id) || null
}

export async function createOrder(
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">,
): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, "0")}`

  const newOrder: Order = {
    ...orderData,
    id: `order-${Date.now()}`,
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockOrders.push(newOrder)
  return newOrder
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  const orderIndex = mockOrders.findIndex((o) => o.id === id)
  if (orderIndex === -1) return null

  const updates: Partial<Order> = {
    status,
    updatedAt: new Date().toISOString(),
  }

  // Add timestamps for status changes
  if (status === "shipped") {
    updates.shippedAt = new Date().toISOString()
  } else if (status === "delivered") {
    updates.deliveredAt = new Date().toISOString()
  }

  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    ...updates,
  }
  return mockOrders[orderIndex]
}

// Category operations
export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockCategories.filter((cat) => cat.isActive)
}

// Analytics operations
export async function getAnalytics() {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const totalProducts = mockProducts.length
  const totalUsers = mockUsers.filter((u) => u.role === "customer").length

  // Calculate recent orders (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentOrders = mockOrders.filter((order) => new Date(order.createdAt) > thirtyDaysAgo)

  return {
    totalOrders,
    totalRevenue,
    totalProducts,
    totalUsers,
    recentOrders: recentOrders.length,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    topCategories: mockCategories.slice(0, 4),
  }
}
