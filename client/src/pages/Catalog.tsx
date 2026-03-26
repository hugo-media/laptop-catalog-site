import { trpc } from "@/lib/trpc";
import { LaptopCard } from "@/components/LaptopCard";
import { LaptopFilters, type LaptopFilterOptions } from "@/components/LaptopFilters";
import { MonitorFilters, type MonitorFilterOptions } from "@/components/MonitorFilters";
import { TabletFilters, type TabletFilterOptions } from "@/components/TabletFilters";
import { SmartDeviceFilters, type SmartDeviceFilterOptions } from "@/components/SmartDeviceFilters";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Carousel, type CarouselSlide } from "@/components/Carousel";
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

type ProductType = "promotions" | "laptops" | "monitors" | "accessories" | "tablets" | "smartDevices";
type CategoryType = "promotions" | "refurbished" | "new" | "business";

const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: "promotions", label: "Акції" },
  { value: "laptops", label: "Ноутбуки" },
  { value: "monitors", label: "Монітори" },
  { value: "accessories", label: "Аксесуари" },
  { value: "tablets", label: "Планшети" },
  { value: "smartDevices", label: "Смарт девайси" },
];

const LAPTOP_CATEGORIES = [
  { value: "promotions" as CategoryType, label: "Акції" },
  { value: "refurbished" as CategoryType, label: "Ноутбуки після оренди" },
  { value: "new" as CategoryType, label: "Нові ноутбуки" },
  { value: "business" as CategoryType, label: "Пропозиція для компаній" },
];

const MONITOR_CATEGORIES = [
  { value: "promotions" as CategoryType, label: "Акції" },
  { value: "refurbished" as CategoryType, label: "Монітори після оренди" },
  { value: "new" as CategoryType, label: "Нові монітори" },
  { value: "business" as CategoryType, label: "Пропозиція для компаній" },
];

const ACCESSORY_CATEGORIES = [
  { value: "promotions" as CategoryType, label: "Акції" },
  { value: "refurbished" as CategoryType, label: "Відновлені" },
  { value: "new" as CategoryType, label: "Нові" },
  { value: "business" as CategoryType, label: "Для компаній" },
];

const TABLET_CATEGORIES = [
  { value: "promotions" as CategoryType, label: "Акції" },
  { value: "refurbished" as CategoryType, label: "Планшети після оренди" },
  { value: "new" as CategoryType, label: "Нові планшети" },
  { value: "business" as CategoryType, label: "Для компаній" },
];

const SMARTDEVICE_CATEGORIES = [
  { value: "promotions" as CategoryType, label: "Акції" },
  { value: "refurbished" as CategoryType, label: "Девайси після оренди" },
  { value: "new" as CategoryType, label: "Нові девайси" },
  { value: "business" as CategoryType, label: "Для компаній" },
];

export default function Catalog() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [productType, setProductType] = useState<ProductType>("promotions");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("promotions");
  const [laptopFilters, setLaptopFilters] = useState<LaptopFilterOptions>({});
  const [monitorFilters, setMonitorFilters] = useState<MonitorFilterOptions>({});
  const [tabletFilters, setTabletFilters] = useState<TabletFilterOptions>({});
  const [smartDeviceFilters, setSmartDeviceFilters] = useState<SmartDeviceFilterOptions>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Queries for all product types
  const { data: laptops, isLoading: laptopsLoading } = trpc.laptops.list.useQuery();
  const { data: monitors, isLoading: monitorsLoading } = trpc.monitors.list.useQuery();
  const { data: accessories, isLoading: accessoriesLoading } = trpc.accessories.list.useQuery();
  const { data: tablets, isLoading: tabletsLoading } = trpc.tablets.list.useQuery();
  const { data: smartDevices, isLoading: smartDevicesLoading } = trpc.smartDevices.list.useQuery();

  // Get current data based on product type
  const getCurrentData = () => {
    switch (productType) {
      case "promotions": {
        // Aggregate all promotional items from all product types
        const allPromos: any[] = [];
        if (laptops) allPromos.push(...laptops.filter(l => l.category === "promotions"));
        if (monitors) allPromos.push(...monitors.filter(m => m.category === "promotions"));
        if (accessories) allPromos.push(...accessories.filter(a => a.category === "promotions"));
        if (tablets) allPromos.push(...tablets.filter(t => t.category === "promotions"));
        if (smartDevices) allPromos.push(...smartDevices.filter(s => s.category === "promotions"));
        return allPromos;
      }
      case "laptops": return laptops || [];
      case "monitors": return monitors || [];
      case "accessories": return accessories || [];
      case "tablets": return tablets || [];
      case "smartDevices": return smartDevices || [];
    }
  };

  // Get category list for current product type
  const getCategoryListForProductType = () => {
    switch (productType) {
      case "promotions": return [];
      case "laptops": return LAPTOP_CATEGORIES;
      case "monitors": return MONITOR_CATEGORIES;
      case "accessories": return ACCESSORY_CATEGORIES;
      case "tablets": return TABLET_CATEGORIES;
      case "smartDevices": return SMARTDEVICE_CATEGORIES;
    }
  };

  const getCurrentLoading = () => {
    switch (productType) {
      case "promotions": return laptopsLoading || monitorsLoading || accessoriesLoading || tabletsLoading || smartDevicesLoading;
      case "laptops": return laptopsLoading;
      case "monitors": return monitorsLoading;
      case "accessories": return accessoriesLoading;
      case "tablets": return tabletsLoading;
      case "smartDevices": return smartDevicesLoading;
    }
  };

  // Filter products by category, applied filters, and search query
  const filteredProducts = useMemo(() => {
    let filtered = getCurrentData() || [];
    
    // For non-promotions, filter by category
    if (productType !== "promotions") {
      filtered = filtered.filter((p: any) => p.category === selectedCategory);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p: any) => {
        const searchableText = `${p.name} ${p.brand || ""} ${p.type || ""}`.toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Apply tablet-specific filters
    if (productType === "tablets") {
      if (tabletFilters.minPrice !== undefined) {
        filtered = filtered.filter((t: any) => t.price >= tabletFilters.minPrice!);
      }
      if (tabletFilters.maxPrice !== undefined) {
        filtered = filtered.filter((t: any) => t.price <= tabletFilters.maxPrice!);
      }
      if (tabletFilters.displaySize) {
        filtered = filtered.filter((t: any) => t.display === tabletFilters.displaySize);
      }
      if (tabletFilters.ram) {
        filtered = filtered.filter((t: any) => t.ram === tabletFilters.ram);
      }
      if (tabletFilters.processor) {
        filtered = filtered.filter((t: any) => t.processor === tabletFilters.processor);
      }
      if (tabletFilters.brand) {
        filtered = filtered.filter((t: any) => t.brand === tabletFilters.brand);
      }
    }

    // Apply smart device-specific filters
    if (productType === "smartDevices") {
      if (smartDeviceFilters.minPrice !== undefined) {
        filtered = filtered.filter((s: any) => s.price >= smartDeviceFilters.minPrice!);
      }
      if (smartDeviceFilters.maxPrice !== undefined) {
        filtered = filtered.filter((s: any) => s.price <= smartDeviceFilters.maxPrice!);
      }
      if (smartDeviceFilters.deviceType) {
        filtered = filtered.filter((s: any) => s.deviceType === smartDeviceFilters.deviceType);
      }
      if (smartDeviceFilters.brand) {
        filtered = filtered.filter((s: any) => s.brand === smartDeviceFilters.brand);
      }
    }

    // Apply laptop-specific filters
    if (productType === "laptops") {
      if (laptopFilters.minPrice !== undefined) {
        filtered = filtered.filter((l: any) => l.price >= laptopFilters.minPrice!);
      }
      if (laptopFilters.maxPrice !== undefined) {
        filtered = filtered.filter((l: any) => l.price <= laptopFilters.maxPrice!);
      }
      if (laptopFilters.display) {
        filtered = filtered.filter((l: any) => l.display?.includes(laptopFilters.display!));
      }
      if (laptopFilters.ram) {
        filtered = filtered.filter((l: any) => l.ram?.includes(laptopFilters.ram!));
      }
      if (laptopFilters.processor) {
        filtered = filtered.filter((l: any) => l.processor?.includes(laptopFilters.processor!));
      }
      if (laptopFilters.brand) {
        filtered = filtered.filter((l: any) => l.name?.includes(laptopFilters.brand!));
      }
    }

    // Apply monitor-specific filters
    if (productType === "monitors") {
      if (monitorFilters.minPrice !== undefined) {
        filtered = filtered.filter((m: any) => m.price >= monitorFilters.minPrice!);
      }
      if (monitorFilters.maxPrice !== undefined) {
        filtered = filtered.filter((m: any) => m.price <= monitorFilters.maxPrice!);
      }
    }

    return filtered;
  }, [getCurrentData(), selectedCategory, laptopFilters, monitorFilters, searchQuery, productType]);

  const isLoading = getCurrentLoading();

  return (
    <div className="min-h-screen bg-premium">
      {/* Premium Header with Logo */}
      <header className="border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            {/* Hugo Media Logo & Branding */}
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
              type="button"
            >
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663402378754/DMLwym6Zv6yd8JHAqkjkFj/hugo-media-logo_da9d05f5.jpg" 
                alt="Hugo Media" 
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">Hugo Media</h1>
                <p className="text-xs text-muted-foreground">Premium Laptop Solutions</p>
              </div>
            </button>

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

      {/* Hero Carousel - Show only on Promotions page */}
      {productType === "promotions" && (
        <div className="w-full py-0">
            <Carousel
            slides={[
              {
                id: "slide-1",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663402378754/DMLwym6Zv6yd8JHAqkjkFj/hugo-media-logo_da9d05f5.jpg",
                title: "Бізнесові моделі в найкращих цінах",
                subtitle: "Найновіші ноутбуки від провідних виробників",
                brands: ["Latitude", "ThinkPad", "EliteBook", "Precision", "Zbook", "XPS"],
                cta: {
                  text: "Переглянути →",
                  action: () => setProductType("laptops"),
                },
              },
              {
                id: "slide-2",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663402378754/DMLwym6Zv6yd8JHAqkjkFj/hugo-media-logo_da9d05f5.jpg",
                title: "Професійні монітори",
                subtitle: "Для роботи та розваг",
                brands: ["Dell", "LG", "ASUS", "BenQ"],
                cta: {
                  text: "Переглянути →",
                  action: () => setProductType("monitors"),
                },
              },
              {
                id: "slide-3",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663402378754/DMLwym6Zv6yd8JHAqkjkFj/hugo-media-logo_da9d05f5.jpg",
                title: "Аксесуари та гаджети",
                subtitle: "Все для вашого робочого місця",
                cta: {
                  text: "Переглянути →",
                  action: () => setProductType("accessories"),
                },
              },
            ]}
            autoplay={true}
            autoplayInterval={6000}
            />
        </div>
      )}

      {/* Product Type Navigation */}
      <nav className="border-b border-border/40 bg-background sticky top-0 z-40">
        <div className="container">
          <div className="flex justify-center overflow-x-auto gap-1 py-3 -mx-4 px-4 md:mx-0 md:px-0">
            {PRODUCT_TYPES.map((type) => (
              <Button
                key={type.value}
                onClick={() => {
                  setProductType(type.value);
                  setSelectedCategory("new");
                  setLaptopFilters({});
                  setMonitorFilters({});
                  setSearchQuery("");
                }}
                variant={productType === type.value ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap text-sm"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Category Navigation - Only show when product type is selected */}
      <nav className="border-b border-border/40 bg-background/30 backdrop-blur-sm sticky top-[68px] z-39">
        <div className="container">
          <div className="flex justify-center overflow-x-auto gap-1 py-2 -mx-4 px-4 md:mx-0 md:px-0">
            {getCategoryListForProductType().map((cat) => (
              <Button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setLaptopFilters({});
                  setMonitorFilters({});
                  setTabletFilters({});
                  setSmartDeviceFilters({});
                  setSearchQuery("");
                }}
                variant={selectedCategory === cat.value ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap text-xs"
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
            {productType === "monitors" && (
              <MonitorFilters onFilterChange={setMonitorFilters} />
            )}
            {productType === "laptops" && (
              <LaptopFilters onFilterChange={setLaptopFilters} />
            )}
            {productType === "tablets" && (
              <TabletFilters onFilterChange={setTabletFilters} />
            )}
            {productType === "smartDevices" && (
              <SmartDeviceFilters onFilterChange={setSmartDeviceFilters} />
            )}
            {productType === "accessories" && (
              <LaptopFilters onFilterChange={setLaptopFilters} />
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Page Title & Search */}
            <div className="mb-8 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {getCategoryListForProductType().find((c: any) => c.value === selectedCategory)?.label}
                </h2>
                <p className="text-muted-foreground">
                  {filteredProducts.length} {t("catalog.products")}
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
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{t("catalog.noResults")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product: any) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedLaptop(product);
                      setModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <LaptopCard laptop={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedLaptop && (
        <ProductDetailModal
          laptop={selectedLaptop}
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setSelectedLaptop(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.about")}</h3>
              <p className="text-sm text-muted-foreground">{t("footer.aboutDesc")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.support")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">{t("footer.faq")}</a></li>
                <li><a href="#" className="hover:text-foreground">{t("footer.contact")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">{t("footer.privacy")}</a></li>
                <li><a href="#" className="hover:text-foreground">{t("footer.terms")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t("footer.contact")}</h3>
              <p className="text-sm text-muted-foreground">info@hugomedia.com</p>
              <p className="text-sm text-muted-foreground">+48 123 456 789</p>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Hugo Media. {t("footer.rights")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
