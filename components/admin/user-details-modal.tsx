"use client"

import { X, Mail, Calendar, MapPin, ShoppingBag, CreditCard, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserOrder {
  id: string
  total: number
  status: string
  date: string
}

interface UserDetails {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "customer" | "admin"
  status: "active" | "suspended" | "banned"
  createdAt: string
  lastLogin: string
  totalOrders: number
  totalSpent: number
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  recentOrders: UserOrder[]
  paymentMethods: string[]
}

interface UserDetailsModalProps {
  user: UserDetails | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (userId: string, status: UserDetails["status"]) => void
  onRoleUpdate: (userId: string, role: UserDetails["role"]) => void
}

const statusConfig = {
  active: { color: "bg-green-100 text-green-800", label: "Active" },
  suspended: { color: "bg-yellow-100 text-yellow-800", label: "Suspended" },
  banned: { color: "bg-red-100 text-red-800", label: "Banned" },
}

const roleConfig = {
  customer: { color: "bg-blue-100 text-blue-800", label: "Customer" },
  admin: { color: "bg-purple-100 text-purple-800", label: "Admin" },
}

export function UserDetailsModal({ user, isOpen, onClose, onStatusUpdate, onRoleUpdate }: UserDetailsModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {user.firstName} {user.lastName}
              <Badge className={statusConfig[user.status].color}>{statusConfig[user.status].label}</Badge>
              <Badge className={roleConfig[user.role].color}>{roleConfig[user.role].label}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{user.totalOrders}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Spent</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">${user.totalSpent.toFixed(2)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="text-sm font-medium mt-2">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Last Login</span>
                    </div>
                    <p className="text-sm font-medium mt-2">{new Date(user.lastLogin).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </div>

              {user.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>{user.address.street}</p>
                      <p>
                        {user.address.city}, {user.address.state} {user.address.zipCode}
                      </p>
                      <p>{user.address.country}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">{method}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Account Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium min-w-20">Status:</label>
                    <Select
                      value={user.status}
                      onValueChange={(value: UserDetails["status"]) => onStatusUpdate(user.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium min-w-20">Role:</label>
                    <Select
                      value={user.role}
                      onValueChange={(value: UserDetails["role"]) => onRoleUpdate(user.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex gap-4">
                    <Button variant="outline">Reset Password</Button>
                    <Button variant="outline">Send Email</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
