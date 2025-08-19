"use client"

import { useState } from "react"
import { Search, Eye, UserPlus, Shield, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserDetailsModal } from "@/components/admin/user-details-modal"

// Mock user data
const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "customer",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15",
    totalOrders: 5,
    totalSpent: 1299.95,
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    recentOrders: [
      { id: "ORD-1703123456", total: 459.97, status: "delivered", date: "2024-01-15" },
      { id: "ORD-1702987654", total: 289.98, status: "shipped", date: "2024-01-10" },
    ],
    paymentMethods: ["Visa ending in 4242", "PayPal"],
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    role: "customer",
    status: "active",
    createdAt: "2024-01-02",
    lastLogin: "2024-01-14",
    totalOrders: 3,
    totalSpent: 789.97,
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    recentOrders: [{ id: "ORD-1703098765", total: 289.98, status: "shipped", date: "2024-01-14" }],
    paymentMethods: ["Mastercard ending in 8888"],
  },
  {
    id: "3",
    firstName: "Demo",
    lastName: "Admin",
    email: "demo@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-16",
    totalOrders: 0,
    totalSpent: 0,
    recentOrders: [],
    paymentMethods: [],
  },
  {
    id: "4",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    role: "customer",
    status: "suspended",
    createdAt: "2024-01-03",
    lastLogin: "2024-01-12",
    totalOrders: 2,
    totalSpent: 399.98,
    recentOrders: [{ id: "ORD-1703054321", total: 179.98, status: "processing", date: "2024-01-13" }],
    paymentMethods: ["Visa ending in 1234"],
  },
]

const statusConfig = {
  active: { color: "bg-green-100 text-green-800", label: "Active" },
  suspended: { color: "bg-yellow-100 text-yellow-800", label: "Suspended" },
  banned: { color: "bg-red-100 text-red-800", label: "Banned" },
}

const roleConfig = {
  customer: { color: "bg-blue-100 text-blue-800", label: "Customer" },
  admin: { color: "bg-purple-100 text-purple-800", label: "Admin" },
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [users, setUsers] = useState(mockUsers)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    customers: users.filter((u) => u.role === "customer").length,
    admins: users.filter((u) => u.role === "admin").length,
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleStatusUpdate = (userId, newStatus) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, status: newStatus })
    }
  }

  const handleRoleUpdate = (userId, newRole) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, role: newRole })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{userStats.total}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{userStats.customers}</div>
            <p className="text-sm text-muted-foreground">Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{userStats.admins}</div>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleConfig[user.role].color}>
                      {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                      {roleConfig[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[user.status].color}>{statusConfig[user.status].label}</Badge>
                  </TableCell>
                  <TableCell>{user.totalOrders}</TableCell>
                  <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        onRoleUpdate={handleRoleUpdate}
      />
    </div>
  )
}
