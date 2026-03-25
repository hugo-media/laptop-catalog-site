import { trpc } from "@/lib/trpc";
import { LaptopCard } from "@/components/LaptopCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Loader2, Shield, Truck, RotateCcw, Star } from "lucide-react";

export default function Catalog() {
  const { data: laptops, isLoading } = trpc.laptops.list.useQuery();
  const { user } = useAuth();
  const [, navigate] = useLocation();

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
            <nav className="flex items-center gap-3">
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
          </div>
        </div>
      </header>

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
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Premium Laptops & Workstations
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Hugo Media brings you a curated selection of high-performance laptops for professionals, creators, and gamers. Latest 2025 models with official warranties and expert support.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {laptops ? `${laptops.length} Premium Models Available` : 'Loading...'}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader2 className="animate-spin h-8 w-8 text-accent" />
          </div>
        ) : laptops && laptops.length > 0 ? (
          <div>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {laptops.map((laptop) => (
                <LaptopCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No laptops available yet.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/20 mt-20">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-3">
              <h3 className="font-bold text-foreground text-lg">Hugo Media</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium selection of high-performance laptops and workstations for every need and budget.
              </p>
              <p className="text-xs text-muted-foreground">
                Trusted by professionals and businesses across Poland.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    Catalog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Gaming Laptops</li>
                <li>Workstations</li>
                <li>Business Ultrabooks</li>
                <li>Professional Systems</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: info@hugomedia.pl</li>
                <li>Phone: +48 XXX XXX XXX</li>
                <li>Support: 24/7 Available</li>
                <li>Warranty: Official Coverage</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40 pt-8">
            <p className="text-center text-sm text-muted-foreground">
              &copy; 2025 Hugo Media. All rights reserved. Premium gadget showroom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
