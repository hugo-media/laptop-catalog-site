import { trpc } from "@/lib/trpc";
import { LaptopCard } from "@/components/LaptopCard";
import { LaptopFilters, type LaptopFilterOptions } from "@/components/LaptopFilters";
import { MonitorFilters, type MonitorFilterOptions } from "@/components/MonitorFilters";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
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
  const [laptopFilters, setLaptopFilters] = useState<LaptopFilterOptions>({});
  const [monitorFilters, setMonitorFilters] = useState<MonitorFilterOptions>({});

  // Filter laptops by category and applied filters
  const filteredLaptops = useMemo(() => {
    let filtered = laptops?.filter((l) => l.category === selectedCategory) || [];

    // Apply laptop-specific filters
    if (selectedCategory !== "monitors") {
      if (laptopFilters.minPrice !== undefined) {
        filtered = filtered.filter((l) => l.price >= laptopFilters.minPrice!);
      }
      if (laptopFilters.maxPrice !== undefined) {
        filtered = filtered.filter((l) => l.price <= laptopFilters.maxPrice!);
      }
      if (laptopFilters.display) {
        filtered = filtered.filter((l) => l.display?.includes(laptopFilters.display!));
      }
      if (laptopFilters.ram) {
        filtered = filtered.filter((l) => l.ram?.includes(laptopFilters.ram!));
      }
      if (laptopFilters.processor) {
        filtered = filtered.filter((l) => l.processor?.includes(laptopFilters.processor!));
      }
      if (laptopFilters.brand) {
        filtered = filtered.filter((l) => l.name?.includes(laptopFilters.brand!));
      }
    }

    // Apply monitor-specific filters
    if (selectedCategory === "monitors") {
      if (monitorFilters.minPrice !== undefined) {
        filtered = filtered.filter((l) => l.price >= monitorFilters.minPrice!);
      }
      if (monitorFilters.maxPrice !== undefined) {
        filtered = filtered.filter((l) => l.price <= monitorFilters.maxPrice!);
      }
      // Add more monitor-specific filters as needed
    }

    return filtered;
  }, [laptops, selectedCategory, laptopFilters, monitorFilters]);

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
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setLaptopFilters({});
                  setMonitorFilters({});
                }}
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

      {/* Trust Signals */}
      <div className="border-b border-border/40 bg-background/30">
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

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            {selectedCategory === "monitors" ? (
              <MonitorFilters onFilterChange={setMonitorFilters} />
            ) : (
              <LaptopFilters onFilterChange={setLaptopFilters} />
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
              </h2>
              <p className="text-muted-foreground">
                {filteredLaptops.length} {selectedCategory === "monitors" ? "monitors" : "laptops"} available
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : filteredLaptops.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found matching your filters</p>
                <Button 
                  onClick={() => {
                    setLaptopFilters({});
                    setMonitorFilters({});
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLaptops.map((laptop) => (
                  <LaptopCard key={laptop.id} laptop={laptop} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 mt-16">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Hugo Media</h3>
              <p className="text-sm text-muted-foreground">Premium laptop solutions for professionals, creators, and gamers.</p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => setSelectedCategory(cat.value)}
                      className="p-0 h-auto text-muted-foreground hover:text-foreground"
                    >
                      {cat.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Shipping Info</a></li>
                <li><a href="#" className="hover:text-foreground">Returns</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Hugo Media. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
