import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { ProductCard } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { AuthModals } from "@/components/auth-modals"

// Sample product data
const featuredProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "/premium-wireless-headphones.png",
    rating: 4.8,
    reviewCount: 124,
    isOnSale: true,
    isFavorite: false,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 249.99,
    image: "/smart-fitness-watch.png",
    rating: 4.6,
    reviewCount: 89,
    isOnSale: false,
    isFavorite: true,
  },
  {
    id: "3",
    name: "Minimalist Desk Lamp",
    price: 89.99,
    originalPrice: 119.99,
    image: "/minimalist-desk-lamp.png",
    rating: 4.9,
    reviewCount: 156,
    isOnSale: true,
    isFavorite: false,
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    price: 39.99,
    image: "/organic-cotton-t-shirt.png",
    rating: 4.7,
    reviewCount: 203,
    isOnSale: false,
    isFavorite: false,
  },
  {
    id: "5",
    name: "Ceramic Coffee Mug Set",
    price: 49.99,
    originalPrice: 69.99,
    image: "/ceramic-coffee-mug-set.png",
    rating: 4.5,
    reviewCount: 78,
    isOnSale: true,
    isFavorite: true,
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 129.99,
    image: "/portable-bluetooth-speaker.png",
    rating: 4.8,
    reviewCount: 167,
    isOnSale: false,
    isFavorite: false,
  },
]

const categories = [
  {
    name: "Electronics",
    image: "/modern-electronics-category.png",
    productCount: 245,
  },
  {
    name: "Fashion",
    image: "/fashion-clothing-category.png",
    productCount: 189,
  },
  {
    name: "Home & Garden",
    image: "/home-and-garden.png",
    productCount: 156,
  },
  {
    name: "Sports",
    image: "/sports-equipment-category.png",
    productCount: 98,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated categories, each featuring premium products selected for quality and
                style.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="group cursor-pointer overflow-hidden rounded-lg bg-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-serif font-semibold text-lg text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.productCount} products</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Featured Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Handpicked products that represent the best of what we offer. Quality, style, and innovation in every
                selection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Stay Updated</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and style
              inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-foreground bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <CartSidebar />
      <AuthModals />
    </div>
  )
}
