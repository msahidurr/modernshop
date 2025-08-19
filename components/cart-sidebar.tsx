"use client"

import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function CartSidebar() {
  const { state, removeItem, updateQuantity, closeCart, getTotalPrice, getTotalItems } = useCart()
  const { state: authState, openLoginModal } = useAuth()
  const router = useRouter()

  const handleCheckout = () => {
    if (!authState.user) {
      openLoginModal()
      return
    }
    closeCart()
    router.push("/checkout")
  }

  if (!state.isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-serif font-semibold">Shopping Cart ({getTotalItems()})</h2>
          <Button variant="ghost" size="sm" onClick={closeCart}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some products to get started</p>
              <Button onClick={closeCart}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">${item.price.toFixed(2)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
