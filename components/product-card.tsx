"use client"

import { Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  isOnSale?: boolean
  isFavorite?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  isOnSale = false,
  isFavorite = false,
}: ProductCardProps) {
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image: image || "/placeholder.svg",
    })
    // Optionally open cart after adding item
    // openCart()
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
      <div className="relative overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Sale Badge */}
        {isOnSale && <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Sale</Badge>}

        {/* Favorite Button */}
        <Button variant="ghost" size="sm" className="absolute top-3 right-3 bg-background/80 hover:bg-background">
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button variant="secondary" size="sm">
            Quick View
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium text-foreground mb-2 line-clamp-2">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold text-foreground">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
