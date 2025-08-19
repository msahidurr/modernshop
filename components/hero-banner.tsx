import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img src="/ecommerce-hero-lifestyle.png" alt="Hero Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-black mb-6 leading-tight">Discover Premium Products</h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
            Experience the future of shopping with our curated collection of premium products, designed for the modern
            lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 bg-transparent"
            >
              View Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
