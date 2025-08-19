"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Menu, X, LogOut, Package, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toggleCart, getTotalItems } = useCart()
  const { state: authState, openLoginModal, openSignupModal, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty"]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/products")
    }
  }

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`)
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-serif font-black text-primary cursor-pointer">ModernShop</h1>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-muted/50 border-border focus:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                Shop All
              </Button>
            </Link>

            {/* User Account */}
            {authState.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={authState.user.avatar || "/placeholder.svg"} alt={authState.user.name} />
                      <AvatarFallback className="text-xs">
                        {authState.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="max-w-24 truncate">{authState.user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{authState.user.name}</p>
                    <p className="text-xs text-muted-foreground">{authState.user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={openLoginModal}>Sign In</DropdownMenuItem>
                  <DropdownMenuItem onClick={openSignupModal}>Create Account</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Shopping Cart */}
            <Button variant="ghost" size="sm" className="relative" onClick={toggleCart}>
              <ShoppingCart className="h-4 w-4" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block border-t border-border">
          <div className="flex items-center justify-center space-x-8 py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            {/* Mobile Search */}
            <div className="p-4 border-b border-border">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4">
              <div className="mb-4">
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="block w-full text-left py-2 text-sm font-semibold text-primary">
                    Shop All Products
                  </button>
                </Link>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                {authState.user ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={authState.user.avatar || "/placeholder.svg"} alt={authState.user.name} />
                        <AvatarFallback className="text-xs">
                          {authState.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{authState.user.name}</p>
                        <p className="text-xs text-muted-foreground">{authState.user.email}</p>
                      </div>
                    </div>
                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="block w-full text-left py-2 text-sm font-medium text-foreground">
                        My Orders
                      </button>
                    </Link>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="block w-full text-left py-2 text-sm font-medium text-foreground">
                        Account Settings
                      </button>
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left py-2 text-sm font-medium text-destructive"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={openLoginModal}
                      className="block w-full text-left py-2 text-sm font-medium text-foreground"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={openSignupModal}
                      className="block w-full text-left py-2 text-sm font-medium text-foreground"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
