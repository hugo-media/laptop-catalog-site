import { trpc } from "@/lib/trpc";
import { LaptopCard } from "@/components/LaptopCard";
import { LaptopFilters, type LaptopFilterOptions } from "@/components/LaptopFilters";
import { MonitorFilters, type MonitorFilterOptions } from "@/components/MonitorFilters";
import { TabletFilters, type TabletFilterOptions } from "@/components/TabletFilters";
import { SmartDeviceFilters, type SmartDeviceFilterOptions } from "@/components/SmartDeviceFilters";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState, useMemo, useEffect } from "react";
import { Loader2, Shield, Truck, RotateCcw, Star, Search, X, ChevronLeft, ArrowRight, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [params] = useLocation();
  
  const urlProductType = (params?.split('/').pop() || "promotions") as ProductType;
  const [productType, setProductType] = useState<ProductType>(() => {
    const type = params?.split('/').pop();
    if (type && ['promotions', 'laptops', 'monitors', 'accessories', 'tablets', 'smartDevices'].includes(type)) {
      return type as ProductType;
    }
    return "promotions";
  });
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("new");
  const [laptopFilters, setLaptopFilters] = useState<LaptopFilterOptions>({});
  const [monitorFilters, setMonitorFilters] = useState<MonitorFilterOptions>({});
  const [tabletFilters, setTabletFilters] = useState<TabletFilterOptions>({});
  const [smartDeviceFilters, setSmartDeviceFilters] = useState<SmartDeviceFilterOptions>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLaptop, setSelectedLaptop] = useState<LaptopType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'popularity' | 'newest'>('newest');
  const [showSubcategoryAccordion, setShowSubcategoryAccordion] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<ProductType | null>(null);


  // Sync productType state with URL parameter
  useEffect(() => {
    const type = params?.split('/').pop();
    if (type && ['promotions', 'laptops', 'monitors', 'accessories', 'tablets', 'smartDevices'].includes(type)) {
      setProductType(type as ProductType);
      setSelectedCategory("new");
      setLaptopFilters({});
      setMonitorFilters({});
      setTabletFilters({});
      setSmartDeviceFilters({});
      setSearchQuery("");
    }
  }, [params]);

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

  const getProductTypeLabel = () => {
    return PRODUCT_TYPES.find(t => t.value === productType)?.label || "Каталог";
  };

  const filteredProducts = useMemo(() => {
    let filtered = getCurrentData() || [];
    
    if (productType !== "promotions") {
      filtered = filtered.filter((p: any) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p: any) => {
        const searchableText = `${p.name} ${p.brand || ""} ${p.type || ""}`.toLowerCase();
        return searchableText.includes(query);
      });
    }

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

    if (productType === "monitors") {
      if (monitorFilters.minPrice !== undefined) {
        filtered = filtered.filter((m: any) => m.price >= monitorFilters.minPrice!);
      }
      if (monitorFilters.maxPrice !== undefined) {
        filtered = filtered.filter((m: any) => m.price <= monitorFilters.maxPrice!);
      }
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
        break;
      case 'popularity':
        sorted.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        sorted.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
        break;
    }

    return sorted;
  }, [getCurrentData(), selectedCategory, laptopFilters, monitorFilters, searchQuery, productType, sortBy]);

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

      {/* Breadcrumb & Back Button */}
      <div className="border-b border-border/40 bg-background/50">
        <div className="container py-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад на головну
          </button>
        </div>
      </div>

      {/* Category Header */}
      <div className="border-b border-border/40 bg-background/30">
        <div className="container py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {getProductTypeLabel()}
          </h1>
          <p className="text-muted-foreground">
            Переглядайте наш каталог та знайдіть найкращі пропозиції
          </p>
        </div>
      </div>

      {/* Main Categories Navigation with Subcategory Dropdown */}
      <div className="border-b border-border/40 bg-background/50">
        <div className="container py-6">
          <p className="text-sm text-muted-foreground mb-4">Перейти до категорії:</p>
          <div className="flex flex-wrap items-center gap-3">
            {PRODUCT_TYPES.map((type) => (
              <div key={type.value} className="relative inline-block">
                <Button
                  onClick={() => {
                    navigate(`/catalog/${type.value}`);
                    // Show dropdown immediately if this is the selected category with subcategories
                    if (productType === type.value && getCategoryListForProductType().length > 0) {
                      setExpandedCategory(type.value);
                    }
                  }}
                  variant={productType === type.value ? "default" : "outline"}
                  className={`justify-between ${
                    productType === type.value
                      ? "border-accent bg-accent text-white"
                      : "border-border/40 hover:border-accent/50"
                  }`}
                >
                  <span>{type.label}</span>
                  {productType === type.value && getCategoryListForProductType().length > 0 && (
                    <ArrowRight className={`h-4 w-4 ml-2 transition-transform ${expandedCategory === type.value ? 'rotate-90' : ''}`} />
                  )}
                </Button>
                
                {/* Subcategory Dropdown - Only show for selected category */}
                {productType === type.value && getCategoryListForProductType().length > 0 && expandedCategory === type.value && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-border/40 rounded-lg shadow-lg z-50 min-w-max">
                    {getCategoryListForProductType().map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          setLaptopFilters({});
                          setMonitorFilters({});
                          setTabletFilters({});
                          setSmartDeviceFilters({});
                          setSearchQuery("");
                          setExpandedCategory(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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
              <div className="flex items-center gap-2 bg-background border border-border/40 rounded-lg px-4 py-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("catalog.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 flex-1"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "товар" : "товарів"}
                </p>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Новинки</SelectItem>
                    <SelectItem value="price-asc">Ціна: від меншої до більшої</SelectItem>
                    <SelectItem value="price-desc">Ціна: від більшої до меншої</SelectItem>
                    <SelectItem value="popularity">Популярність</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subcategory Header */}
            {selectedCategory && selectedCategory !== "promotions" && (
              <div className="mb-6 pb-4 border-b border-border/20">
                <p className="text-sm text-muted-foreground">Категорія:</p>
                <p className="text-lg font-semibold text-foreground">
                  {getCategoryListForProductType().find(c => c.value === selectedCategory)?.label}
                </p>
              </div>
            )}

            {/* Products */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Товари не знайдені</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setLaptopFilters({});
                    setMonitorFilters({});
                    setTabletFilters({});
                    setSmartDeviceFilters({});
                  }}
                  variant="outline"
                >
                  Очистити фільтри
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product: any) => (
                  <LaptopCard
                    key={product.id}
                    laptop={product}
                  />
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
    </div>
  );
}
