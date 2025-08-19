"use client"

import { useState } from "react"
import { Search, Eye, Package, Truck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderDetailsModal } from "@/components/admin/order-details-modal"

// Mock order data
const mockOrders = [
  {
    id: "ORD-1703123456",
    customer: "John Doe",
    email: "john@example.com",
    total: 459.97,
    status: "delivered",
    date: "2024-01-15",
    items: 2,
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "ORD-1703098765",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 289.98,
    status: "shipped",
    date: "2024-01-14",
    items: 2,
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
  },
  {
    id: "ORD-1703054321",
    customer: "Bob Johnson",
    email: "bob@example.com",
    total: 179.98,
    status: "processing",
    date: "2024-01-13",
    items: 2,
    shippingAddress: "789 Pine St, Chicago, IL 60601",
  },
  {
    id: "ORD-1703012345",
    customer: "Alice Brown",
    email: "alice@example.com",
    total: 329.99,
    status: "completed",
    date: "2024-01-12",
    items: 1,
    shippingAddress: "321 Elm St, Houston, TX 77001",
  },
  {
    id: "ORD-1702987654",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    total: 199.99,
    status: "cancelled",
    date: "2024-01-11",
    items: 1,
    shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processing":
      return <Package className="h-3 w-3" />
    case "shipped":
      return <Truck className="h-3 w-3" />
    case "delivered":
    case "completed":
      return <CheckCircle className="h-3 w-3" />
    default:
      return null
  }
}

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const orderStats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered" || o.status === "completed").length,
  }

  const handleViewOrder = (order) => {
    const orderWithDetails = {
      ...order,
      customerName: order.customer,
      customerEmail: order.email,
      subtotal: order.total * 0.85,
      tax: order.total * 0.08,
      shipping: order.total * 0.07,
      items: [
        {
          id: "1",
          name: "Sample Product",
          price: order.total / order.items,
          quantity: order.items,
          image: "/placeholder.svg",
        },
      ],
      shippingAddress: {
        street: order.shippingAddress.split(",")[0],
        city: order.shippingAddress.split(",")[1]?.trim() || "",
        state: order.shippingAddress.split(",")[2]?.trim() || "",
        zipCode: "12345",
        country: "USA",
      },
      paymentMethod: "Credit Card ending in 4242",
      createdAt: order.date,
      updatedAt: order.date,
      trackingNumber: order.status === "shipped" ? "TRK123456789" : undefined,
    }
    setSelectedOrder(orderWithDetails)
    setIsOrderModalOpen(true)
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{orderStats.processing}</div>
            <p className="text-sm text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{orderStats.shipped}</div>
            <p className="text-sm text-muted-foreground">Shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select onValueChange={(value) => handleStatusUpdate(order.id, value)}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}
