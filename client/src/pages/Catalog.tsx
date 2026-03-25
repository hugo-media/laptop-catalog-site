import { trpc } from "@/lib/trpc";
import { LaptopCard } from "@/components/LaptopCard";
import { LaptopFilters, type LaptopFilterOptions } from "@/components/LaptopFilters";
import { MonitorFilters, type MonitorFilterOptions } from "@/components/MonitorFilters";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import { Loader2, Shield, Truck, RotateCcw, Star, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Laptop as LaptopType } from "../../../drizzle/schema";

type Category = "promotions" | "refurbished" | "new" | "monitors" | "accessories" | "business";

const getCATEGORIES = (t: any): { value: Category; label: string }[] => [
  { value: "promotions", label: t("categories.promotions") },
  { value: "refurbished", label: t("categories.refurbished") },
  { value: "new", label: t("categories.new") },
  { value: "monitors", label: t("categories.monitors") },
  { value: "accessories", label: t("categories.accessories") },
  { value: "business", label: t("categories.business") },
];

export default function Catalog() {
  const { t } = useTranslation();
  const { data: laptops, isLoading } = trpc.laptops.list.useQuery();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<Category>("new");
  const [laptopFilters, setLaptopFilters] = useState<LaptopFilterOptions>({});
  const [monitorFilters, setMonitorFilters] = useState<MonitorFilterOptions>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter laptops by category, applied filters, and search query
  const filteredLaptops = useMemo(() => {
    let filtered = laptops?.filter((l) => l.category === selectedCategory) || [];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((l) => {
        const searchableText = `${l.name} ${l.processor} ${l.graphicsCard} ${l.ram} ${l.storage} ${l.display}`.toLowerCase();
        return searchableText.includes(query);
      });
    }

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
  }, [laptops, selectedCategory, laptopFilters, monitorFilters, searchQuery]);

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
              <LanguageSwitcher />
              <Button 
                onClick={() => navigate("/about")} 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                {t("header.aboutUs")}
              </Button>
              {user?.role === "admin" && (
                <Button 
                  onClick={() => navigate("/admin")} 
                  variant="outline"
                  size="sm"
                  className="border-accent/30 hover:bg-accent/5"
                >
                  {t("header.adminPanel")}
                </Button>
              )}
              {!user && (
                <Button asChild size="sm" className="bg-accent hover:bg-accent/90">
                  <a href={getLoginUrl()}>{t("header.signIn")}</a>
                </Button>
              )}
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              {user?.role === "admin" && (
                <Button 
                  onClick={() => navigate("/admin")} 
                  variant="outline"
                  size="sm"
                  className="border-accent/30 hover:bg-accent/5"
                >
                  {t("header.admin")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="container">
          <div className="flex justify-center overflow-x-auto gap-1 py-3 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
            {getCATEGORIES(t).map((cat) => (
              <Button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setLaptopFilters({});
                  setMonitorFilters({});
                  setSearchQuery("");
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
                <p className="font-semibold text-foreground">{t("trustSignals.warranty")}</p>
                <p className="text-xs text-muted-foreground">{t("trustSignals.warrantyDesc")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-accent flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">{t("trustSignals.delivery")}</p>
                <p className="text-xs text-muted-foreground">{t("trustSignals.deliveryDesc")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-accent flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">{t("trustSignals.returns")}</p>
                <p className="text-xs text-muted-foreground">{t("trustSignals.returnsDesc")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-accent flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-foreground">{t("trustSignals.trusted")}</p>
                <p className="text-xs text-muted-foreground">{t("trustSignals.trustedDesc")}</p>
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
            {/* Page Title & Search */}
            <div className="mb-8 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {getCATEGORIES(t).find((c: any) => c.value === selectedCategory)?.label}
                </h2>
                <p className="text-muted-foreground">
                  {filteredLaptops.length} {t(selectedCategory === "monitors" ? "catalog.monitors" : "catalog.laptops")}
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("catalog.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 border-border/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : filteredLaptops.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? t("catalog.noResultsSearch") 
                    : t("catalog.noResultsFilters")}
                </p>
                <Button 
                  onClick={() => {
                    setLaptopFilters({});
                    setMonitorFilters({});
                    setSearchQuery("");
                  }}
                  variant="outline"
                >
                  {t("catalog.clearFilters")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLaptops.map((laptop) => (
                  <div
                    key={laptop.id}
                    onClick={() => {
                      setSelectedLaptop(laptop);
                      setModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <LaptopCard laptop={laptop} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        laptop={selectedLaptop}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 mt-16">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.brand")}</h3>
              <p className="text-sm text-muted-foreground">{t("footer.brandDesc")}</p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.categories")}</h3>
              <ul className="space-y-2 text-sm">
                {getCATEGORIES(t).map((cat) => (
                  <li key={cat.value}>
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setSearchQuery("");
                      }}
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
              <h3 className="font-semibold text-foreground mb-4">{t("footer.support")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">{t("footer.contactUs")}</a></li>
                <li><a href="#" className="hover:text-foreground">{t("footer.shippingInfo")}</a></li>
                <li><a href="#" className="hover:text-foreground">{t("footer.returns")}</a></li>
                <li><a href="#" className="hover:text-foreground">{t("footer.faq")}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">{t("footer.privacyPolicy")}</a></li>
                <li><a href="#" className="hover:text-foreground">{t("footer.termsOfService")}</a></li>
                <li><a href="#" className="hover:text-foreground">{t("footer.cookiePolicy")}</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
