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
          <Link href="/catalog" className="flex items-center gap-2 text-primary hover:underline mb-8">
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
        <Link href="/catalog" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Назад до каталогу
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
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

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Title and badges */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
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

            {/* Condition */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Стан</p>
              <p className="text-lg font-medium">{product.condition}</p>
            </div>

            {/* Price */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Ціна</p>
              <div className="flex items-center gap-3">
                {discountPercent > 0 && (
                  <span className="text-2xl font-bold text-red-500">{discountedPrice} zł</span>
                )}
                <span className={`text-2xl font-bold ${discountPercent > 0 ? "line-through text-muted-foreground" : ""}`}>
                  {originalPrice} zł
                </span>
              </div>
              {discountPercent > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  Економія: {originalPrice - discountedPrice} zł
                </p>
              )}
            </div>

            {/* Warranty */}
            {product.warranty && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Гарантія</p>
                <p className="text-lg font-medium">{product.warranty}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" size="lg">
                Додати в кошик
              </Button>
              <Button variant="outline" size="lg" className="px-4">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Laptop Specifications */}
        {type === "laptops" && product && "processor" in product && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Характеристики</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">Процесор</span>
                <span className="font-semibold text-right">{product.processor}</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">Відеокарта</span>
                <span className="font-semibold text-right">{(product as any).graphicsCard}</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">ОЗУ</span>
                <span className="font-semibold text-right">{product.ram}</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">Сховище</span>
                <span className="font-semibold text-right">{product.storage}</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">Дисплей</span>
                <span className="font-semibold text-right">{product.display}</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">ОС</span>
                <span className="font-semibold text-right">{product.operatingSystem}</span>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-4">Опис</h2>
            <div className="prose prose-sm max-w-none text-foreground">
              {(product.description || "").split("\n").map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-4 text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Monitor Specifications */}
        {type === "monitors" && product && "resolution" in product && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Характеристики</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">Дозвіл</span>
                <span className="font-semibold text-right">{product.resolution}</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">Діагональ</span>
                <span className="font-semibold text-right">{(product as any).diagonal}</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">Тип матриці</span>
                <span className="font-semibold text-right">{product.panelType}</span>
              </div>
              <div className="flex justify-between items-start pb-4 border-b">
                <span className="text-muted-foreground font-medium">Частота оновлення</span>
                <span className="font-semibold text-right">{product.refreshRate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
