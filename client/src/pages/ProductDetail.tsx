import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Heart } from "lucide-react";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:type/:id");

  if (!match) return null;

  const { type, id } = params as { type: string; id: string };
  const productId = parseInt(id);

  // Fetch product based on type
  const queryResult = type === "laptops" ? trpc.laptops.getById.useQuery({ id: productId }) :
    type === "monitors" ? trpc.monitors.getById.useQuery({ id: productId }) :
    type === "accessories" ? trpc.accessories.getById.useQuery({ id: productId }) :
    type === "tablets" ? trpc.tablets.getById.useQuery({ id: productId }) :
    type === "smartdevices" ? trpc.smartDevices.getById.useQuery({ id: productId }) :
    { data: null, isLoading: false, error: new Error("Invalid product type") };

  const { data: product, isLoading, error } = queryResult;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href={`/catalog/${type}`} className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Назад до каталогу
          </Link>
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Товар не знайдено</p>
          </div>
        </div>
      </div>
    );
  }

  const discountPercent = product.discountPercent || 0;
  const originalPrice = product.price;
  const discountedPrice = discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link href={`/catalog/${type}`} className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Назад до каталогу
        </Link>

        {/* Main Content - Image Left, Info + Specs Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Product Image - Left Column */}
          <div className="lg:col-span-1">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center sticky top-24">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">Зображення недоступне</div>
              )}
              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                  -{discountPercent}%
                </div>
              )}
            </div>
          </div>

          {/* Product Info + Specs - Right Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and badges */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex flex-wrap gap-2">
                {product.categories && Array.isArray(product.categories) && (product.categories as string[]).map((cat: string) => (
                  <Badge key={cat} variant="secondary">
                    {cat === "new" && "Новий"}
                    {cat === "restored" && "Відновлений"}
                    {cat === "company" && "Для компанії"}
                    {cat === "promotions" && "Акція"}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Laptop Specifications */}
            {type === "laptops" && product && "processor" in product && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Характеристики</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Процесор</p>
                    <p className="font-semibold text-foreground">{product.processor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Відеокарта</p>
                    <p className="font-semibold text-foreground">{(product as any).graphicsCard}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">ОЗУ</p>
                    <p className="font-semibold text-foreground">{product.ram}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Сховище</p>
                    <p className="font-semibold text-foreground">{product.storage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Дисплей</p>
                    <p className="font-semibold text-foreground">{product.display}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">ОС</p>
                    <p className="font-semibold text-foreground">{product.operatingSystem}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Monitor Specifications */}
            {type === "monitors" && product && "resolution" in product && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Характеристики</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Дозвіл</p>
                    <p className="font-semibold text-foreground">{product.resolution}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Діагональ</p>
                    <p className="font-semibold text-foreground">{(product as any).diagonal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Тип матриці</p>
                    <p className="font-semibold text-foreground">{product.panelType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Частота оновлення</p>
                    <p className="font-semibold text-foreground">{product.refreshRate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Condition */}
            <div className="grid grid-cols-2 gap-6 border-t pt-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Стан</p>
                <p className="text-lg font-medium">{product.condition}</p>
              </div>
              {product.warranty && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Гарантія</p>
                  <p className="text-lg font-medium">{product.warranty}</p>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-muted-foreground mb-3">Ціна</p>
              <div className="flex items-baseline gap-3 mb-2">
                {discountPercent > 0 && (
                  <span className="text-4xl font-bold text-red-600">{discountedPrice} zł</span>
                )}
                <span className={`text-3xl font-bold ${discountPercent > 0 ? "line-through text-muted-foreground" : ""}`}>
                  {originalPrice} zł
                </span>
              </div>
              {discountPercent > 0 && (
                <p className="text-sm text-green-600 font-semibold">
                  ✓ Економія: {originalPrice - discountedPrice} zł
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 h-12 text-base" size="lg">
                Додати в кошик
              </Button>
              <Button variant="outline" size="lg" className="px-6 h-12">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Description - Full Width */}
        {product.description && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Опис</h2>
            <div className="prose prose-sm max-w-none text-foreground">
              {(product.description || "").split("\n").map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-4 text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
