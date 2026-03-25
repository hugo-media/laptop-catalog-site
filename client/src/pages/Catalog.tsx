import { trpc } from "@/lib/trpc";
import { LaptopCard } from "@/components/LaptopCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState } from "react";
import { Loader2, Shield, Truck, RotateCcw, Star } from "lucide-react";

type Category = "promotions" | "refurbished" | "new" | "monitors" | "accessories" | "business";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "promotions", label: "Акції" },
  { value: "refurbished", label: "Ноутбуки після оренди" },
  { value: "new", label: "Нові ноутбуки" },
  { value: "monitors", label: "Монітори" },
  { value: "accessories", label: "Аксесуари" },
  { value: "business", label: "Пропозиція для компаній" },
];

export default function Catalog() {
  const { data: laptops, isLoading } = trpc.laptops.list.useQuery();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<Category>("new");

  const filteredLaptops = laptops?.filter((l) => l.category === selectedCategory) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header with Logo */}
      <header className="border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            {/* Hugo Media Logo & Branding */}
            <div className="flex items-center gap-4">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402378754/DMLwym6Zv6yd8JHAqkjkFj/hugo-media-logo_da9d05f5.jpg" 
                alt="Hugo Media" 
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">Hugo Media</h1>
                <p className="text-xs text-muted-foreground">Premium Laptop Solutions</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                onClick={() => navigate("/about")} 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                About Us
              </Button>
              {user?.role === "admin" && (
                <Button 
                  onClick={() => navigate("/admin")} 
                  variant="outline"
                  size="sm"
                  className="border-accent/30 hover:bg-accent/5"
                >
                  Admin Panel
                </Button>
              )}
              {!user && (
                <Button asChild size="sm" className="bg-accent hover:bg-accent/90">
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
              )}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              {user?.role === "admin" && (
                <Button 
                  onClick={() => navigate("/admin")} 
                  variant="outline"
                  size="sm"
                  className="border-accent/30 hover:bg-accent/5"
                >
                  Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="container">
          <div className="flex overflow-x-auto gap-1 py-3 -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                variant={selectedCategory === cat.value ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap text-sm"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Trust Signals Banner */}
      <div className="bg-secondary/30 border-b border-border/40">
        <div className="container py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-accent flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Official Warranty</p>
                <p className="text-xs text-muted-foreground">2-3 years coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-accent flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Over 400 PLN</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-accent flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">14-Day Returns</p>
                <p className="text-xs text-muted-foreground">No questions asked</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-accent flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Trusted Seller</p>
                <p className="text-xs text-muted-foreground">4.9/5 rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="border-b border-border/40 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Premium Laptops & Workstations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Hugo Media brings you a curated selection of high-performance laptops for professionals, creators, and gamers. Latest 2025 models with official warranties and expert support.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="text-sm">
                <span className="font-bold text-accent text-lg">{filteredLaptops.length}</span>
                <span className="text-muted-foreground ml-2">
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="container py-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredLaptops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLaptops.map((laptop) => (
              <LaptopCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No laptops available in this category.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/20 mt-20">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">Hugo Media</h3>
              <p className="text-sm text-muted-foreground">Premium laptop solutions for professionals and creators worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button 
                      onClick={() => setSelectedCategory(cat.value)}
                      className="hover:text-accent transition"
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-accent transition">Returns</a></li>
                <li><a href="#" className="hover:text-accent transition">Warranty</a></li>
                <li><a href="#" className="hover:text-accent transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 Hugo Media. All rights reserved. Premium gadget showroom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
