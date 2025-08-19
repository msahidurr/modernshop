"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductForm } from "@/components/admin/product-form"

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    stock: 45,
    status: "active",
    category: "Electronics",
    image: "/premium-wireless-headphones.png",
    sales: 145,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 249.99,
    stock: 23,
    status: "active",
    category: "Electronics",
    image: "/smart-fitness-watch.png",
    sales: 98,
  },
  {
    id: "3",
    name: "Minimalist Desk Lamp",
    price: 89.99,
    stock: 67,
    status: "active",
    category: "Home & Garden",
    image: "/minimalist-desk-lamp.png",
    sales: 76,
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    price: 39.99,
    stock: 0,
    status: "out_of_stock",
    category: "Fashion",
    image: "/organic-cotton-t-shirt.png",
    sales: 234,
  },
  {
    id: "5",
    name: "Ceramic Coffee Mug Set",
    price: 49.99,
    stock: 12,
    status: "low_stock",
    category: "Home & Garden",
    image: "/ceramic-coffee-mug-set.png",
    sales: 89,
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 129.99,
    stock: 34,
    status: "active",
    category: "Electronics",
    image: "/portable-bluetooth-speaker.png",
    sales: 87,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "out_of_stock":
      return "bg-red-100 text-red-800"
    case "low_stock":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Active"
    case "out_of_stock":
      return "Out of Stock"
    case "low_stock":
      return "Low Stock"
    default:
      return status
  }
}

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(mockProducts)
  const [isProductFormOpen, setIsProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsProductFormOpen(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsProductFormOpen(true)
  }

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p)))
    } else {
      const newProduct = { ...productData, id: Date.now().toString(), sales: 0 }
      setProducts([...products, newProduct])
    }
    setIsProductFormOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>{getStatusText(product.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ProductForm modal */}
      <ProductForm
        product={editingProduct}
        isOpen={isProductFormOpen}
        onSave={handleSaveProduct}
        onCancel={() => setIsProductFormOpen(false)}
      />
    </div>
  )
}
