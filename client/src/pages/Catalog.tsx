import { trpc } from "@/lib/trpc";
import { LaptopCard } from "@/components/LaptopCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Catalog() {
  const { data: laptops, isLoading } = trpc.laptops.list.useQuery();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Laptop Catalog</h1>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/about")} variant="outline" size="sm">
                About Us
              </Button>
              {user?.role === "admin" && (
                <Button onClick={() => navigate("/admin")} variant="default" size="sm">
                  Admin Panel
                </Button>
              )}
              {!user && (
                <Button asChild size="sm">
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">
            Premium laptops for professionals, creators, and gamers
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : laptops && laptops.length > 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {laptops.length} products
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {laptops.map((laptop) => (
                <LaptopCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No laptops available yet.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Laptop Catalog</h3>
              <p className="text-sm text-muted-foreground">
                Premium selection of high-performance laptops for every need.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Catalog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Latest Models</h3>
              <p className="text-sm text-muted-foreground">
                2025 technology with official warranties
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Laptop Catalog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
