"use client"

import { TrendingUp, Package, ShoppingCart, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for dashboard
const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+180.1%",
    changeType: "positive" as const,
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "1,234",
    change: "+19%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Customers",
    value: "573",
    change: "+201",
    changeType: "positive" as const,
    icon: Users,
  },
]

const recentOrders = [
  {
    id: "ORD-1703123456",
    customer: "John Doe",
    email: "john@example.com",
    total: 459.97,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-1703098765",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 289.98,
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "ORD-1703054321",
    customer: "Bob Johnson",
    email: "bob@example.com",
    total: 179.98,
    status: "processing",
    date: "2024-01-13",
  },
  {
    id: "ORD-1703012345",
    customer: "Alice Brown",
    email: "alice@example.com",
    total: 329.99,
    status: "completed",
    date: "2024-01-12",
  },
]

const topProducts = [
  {
    name: "Premium Wireless Headphones",
    sales: 145,
    revenue: "$43,455.00",
    image: "/premium-wireless-headphones.png",
  },
  {
    name: "Smart Fitness Watch",
    sales: 98,
    revenue: "$24,499.02",
    image: "/smart-fitness-watch.png",
  },
  {
    name: "Bluetooth Speaker",
    sales: 87,
    revenue: "$11,309.13",
    image: "/portable-bluetooth-speaker.png",
  },
  {
    name: "Minimalist Desk Lamp",
    sales: 76,
    revenue: "$6,839.24",
    image: "/minimalist-desk-lamp.png",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span className="text-green-600">{stat.change}</span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">Add Product</h3>
              <p className="text-sm text-muted-foreground">Add a new product to your catalog</p>
            </div>
            <div className="p-4 border border-border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">Process Orders</h3>
              <p className="text-sm text-muted-foreground">Review and process pending orders</p>
            </div>
            <div className="p-4 border border-border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">View Customers</h3>
              <p className="text-sm text-muted-foreground">Manage customer accounts and data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
