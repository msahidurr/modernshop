// Database schema types for the ecommerce platform
export interface User {
  id: string
  email: string
  password: string // In production, this would be hashed
  firstName: string
  lastName: string
  role: "customer" | "admin"
  createdAt: string
  updatedAt: string
  // Profile information
  phone?: string
  dateOfBirth?: string
  // Shipping addresses
  addresses: Address[]
}

export interface Address {
  id: string
  userId: string
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: string
  subcategory?: string
  brand: string
  sku: string
  inventory: number
  images: string[]
  tags: string[]
  status: "active" | "draft" | "archived"
  featured: boolean
  createdAt: string
  updatedAt: string
  // SEO
  seoTitle?: string
  seoDescription?: string
  // Variants (size, color, etc.)
  variants: ProductVariant[]
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  inventory: number
  attributes: { [key: string]: string } // e.g., { size: 'M', color: 'Blue' }
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: "USD"
  // Addresses
  shippingAddress: Address
  billingAddress: Address
  // Payment
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  // Timestamps
  createdAt: string
  updatedAt: string
  shippedAt?: string
  deliveredAt?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  total: number
  // Snapshot of product data at time of order
  productSnapshot: {
    name: string
    image: string
    sku: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Cart types (for frontend state)
export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  image: string
  quantity: number
  maxQuantity: number
}
