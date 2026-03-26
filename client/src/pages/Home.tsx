import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Carousel, type CarouselSlide } from "@/components/Carousel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Shield, Truck, RotateCcw, Star, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

type ProductType = "promotions" | "laptops" | "monitors" | "accessories" | "tablets" | "smartDevices";

const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: "promotions", label: "Акції" },
  { value: "laptops", label: "Ноутбуки" },
  { value: "monitors", label: "Монітори" },
  { value: "accessories", label: "Аксесуари" },
  { value: "tablets", label: "Планшети" },
  { value: "smartDevices", label: "Смарт девайси" },
];

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleCategoryClick = (productType: ProductType) => {
    navigate(`/catalog/${productType}`);
  };

  const carouselSlides: CarouselSlide[] = [
    {
      id: "slide-1",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663402378754/DMLwym6Zv6yd8JHAqkjkFj/hugo-media-logo_da9d05f5.jpg",
      title: "Бізнесові моделі в найкращих цінах",
      subtitle: "Найновіші ноутбуки від провідних виробників",
      brands: ["Latitude", "ThinkPad", "EliteBook", "Precision", "Zbook", "XPS"],
      cta: {
        text: "Переглянути →",
        action: () => handleCategoryClick("laptops"),
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
        action: () => handleCategoryClick("monitors"),
      },
    },
    {
      id: "slide-3",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663402378754/DMLwym6Zv6yd8JHAqkjkFj/hugo-media-logo_da9d05f5.jpg",
      title: "Аксесуари та гаджети",
      subtitle: "Все для вашого робочого місця",
      brands: ["Apple", "Logitech", "Corsair", "Razer"],
      cta: {
        text: "Переглянути →",
        action: () => handleCategoryClick("accessories"),
      },
    },
  ];

  return (
    <>
      {/* Premium Header with Logo - Fixed at Top */}
      <header className="fixed top-0 left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            {/* Hugo Media Logo & Branding */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
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

          {/* Category Navigation Row - Centered */}
          <div className="border-t border-border/40 py-3 mt-3 flex justify-center">
            <div className="flex gap-2 md:gap-4 whitespace-nowrap">
              {PRODUCT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  onClick={() => handleCategoryClick(type.value)}
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 flex-shrink-0"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-premium pt-[140px]">
      {/* Hero Carousel */}
      <div className="w-full py-0">
        <Carousel
          slides={carouselSlides}
          autoplay={true}
          autoplayInterval={6000}
        />
      </div>

      {/* Trust Signals */}
      <div className="border-b border-border/40 bg-background/30">
        <div className="container py-8">
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

      {/* Promotions Section */}
      <section className="border-b border-border/40 bg-gradient-to-r from-accent/5 to-accent/10">
        <div className="container py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              🔥 Актуальні Акції
            </h2>
            <p className="text-muted-foreground text-lg">
              Найкращі пропозиції та знижки на преміум техніку
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Promo Card 1 */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                  -30%
                </div>
                <h3 className="text-2xl font-bold mb-2">Ноутбуки Бізнес-класу</h3>
                <p className="text-purple-100 mb-6">Потужні моделі для професіоналів</p>
                <Button 
                  onClick={() => handleCategoryClick("laptops")}
                  className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
                >
                  Переглянути →
                </Button>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                  -25%
                </div>
                <h3 className="text-2xl font-bold mb-2">Професійні Монітори</h3>
                <p className="text-blue-100 mb-6">Для роботи та творчості</p>
                <Button 
                  onClick={() => handleCategoryClick("monitors")}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                >
                  Переглянути →
                </Button>
              </div>
            </div>

            {/* Promo Card 3 */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                  -20%
                </div>
                <h3 className="text-2xl font-bold mb-2">Аксесуари та Гаджети</h3>
                <p className="text-indigo-100 mb-6">Все для вашого робочого місця</p>
                <Button 
                  onClick={() => handleCategoryClick("accessories")}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold"
                >
                  Переглянути →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* About Section */}
      <section className="border-b border-border/40 bg-background/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Про Hugo Media
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Hugo Media - ваш надійний партнер у виборі якісної комп'ютерної техніки. Ми пропонуємо найкращі ноутбуки, монітори та аксесуари від провідних виробників світу.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                З більш ніж 10 років досвіду на ринку, ми гарантуємо якість кожного товару, професійну консультацію та відмінний сервіс.
              </p>
              <Button 
                onClick={() => navigate("/about")}
                className="bg-accent hover:bg-accent/90"
              >
                Дізнатися більше
              </Button>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-8 border border-accent/20">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="text-2xl font-bold text-accent">✓</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Оригінальні товари</h4>
                    <p className="text-sm text-muted-foreground">Тільки сертифіковані товари від офіційних дистриб'юторів</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl font-bold text-accent">✓</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Гарантія 2-3 роки</h4>
                    <p className="text-sm text-muted-foreground">Повна гарантія на всі товари</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl font-bold text-accent">✓</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Швидка доставка</h4>
                    <p className="text-sm text-muted-foreground">Доставка по всій Україні за 1-3 дні</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl font-bold text-accent">✓</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Повернення за 14 днів</h4>
                    <p className="text-sm text-muted-foreground">Повне повернення коштів без питань</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent/10 to-accent/5 border-t border-border/40">
        <div className="container py-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Готові знайти ідеальний ноутбук?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Переглядайте наш каталог і знайдіть найкращі пропозиції на ноутбуки, монітори та аксесуари
          </p>
          <Button 
            onClick={() => handleCategoryClick("promotions")}
            size="lg"
            className="bg-accent hover:bg-accent/90"
          >
            Переглянути акції
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Про нас</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Про компанію</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Наша команда</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Контакти</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Категорії</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Ноутбуки</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Монітори</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Аксесуари</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Підтримка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Повернення</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Контакти</h4>
              <p className="text-sm text-muted-foreground mb-2">
                📞 +38 (0XX) XXX-XX-XX
              </p>
              <p className="text-sm text-muted-foreground">
                📧 info@hugomedia.ua
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Hugo Media. Усі права захищені.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
