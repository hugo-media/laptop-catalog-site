import type { Laptop as LaptopType } from "../../../drizzle/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Laptop as LaptopIcon, Shield, Truck, RotateCcw } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { useState } from "react";

interface ProductDetailModalProps {
  laptop: LaptopType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({ laptop, open, onOpenChange }: ProductDetailModalProps) {
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  if (!laptop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-2xl font-bold">{laptop.name}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="w-full h-80 bg-gradient-to-br from-secondary/50 via-secondary/30 to-secondary/20 rounded-lg flex items-center justify-center overflow-hidden border border-border/40">
            {laptop.imageUrl ? (
              <img
                src={laptop.imageUrl}
                alt={laptop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <LaptopIcon className="h-32 w-32 text-muted-foreground/25" />
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="secondary" 
              className="text-sm font-semibold px-3 py-1 bg-secondary/80 text-foreground/80"
            >
              {laptop.condition}
            </Badge>
            {laptop.warranty && (
              <Badge 
                variant="outline" 
                className="text-sm font-semibold px-3 py-1 border-accent/30 text-muted-foreground"
              >
                {laptop.warranty}
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="border-t border-b border-border/40 py-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-accent">
                {laptop.price.toLocaleString('pl-PL')}
              </span>
              <span className="text-lg font-semibold text-muted-foreground">zł</span>
            </div>
          </div>

          {/* Description */}
          {laptop.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Опис</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {laptop.description}
              </p>
            </div>
          )}

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Характеристики</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 p-4 bg-secondary/30 rounded-lg border border-border/40">
                <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                  Процесор
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {laptop.processor}
                </p>
              </div>
              <div className="space-y-1.5 p-4 bg-secondary/30 rounded-lg border border-border/40">
                <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                  Графіка
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {laptop.graphicsCard}
                </p>
              </div>
              <div className="space-y-1.5 p-4 bg-secondary/30 rounded-lg border border-border/40">
                <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                  ОЗУ
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {laptop.ram}
                </p>
              </div>
              <div className="space-y-1.5 p-4 bg-secondary/30 rounded-lg border border-border/40">
                <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                  Сховище
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {laptop.storage}
                </p>
              </div>
              <div className="space-y-1.5 p-4 bg-secondary/30 rounded-lg border border-border/40">
                <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                  Дисплей
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {laptop.display}
                </p>
              </div>
              <div className="space-y-1.5 p-4 bg-secondary/30 rounded-lg border border-border/40">
                <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                  ОС
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {laptop.operatingSystem}
                </p>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-secondary/20 rounded-lg border border-border/40">
            <div className="flex flex-col items-center text-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <p className="text-xs font-semibold text-foreground">Гарантія</p>
              <p className="text-xs text-muted-foreground">2-3 роки</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="h-5 w-5 text-accent" />
              <p className="text-xs font-semibold text-foreground">Доставка</p>
              <p className="text-xs text-muted-foreground">Безплатна</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="h-5 w-5 text-accent" />
              <p className="text-xs font-semibold text-foreground">Повернення</p>
              <p className="text-xs text-muted-foreground">14 днів</p>
            </div>
          </div>

          {/* Inquiry Form or Button */}
          {!showInquiryForm ? (
            <Button 
              onClick={() => setShowInquiryForm(true)}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12"
              size="lg"
            >
              Запитати про товар
            </Button>
          ) : (
            <InquiryForm 
              laptop={laptop}
              onSuccess={() => {
                setShowInquiryForm(false);
                onOpenChange(false);
              }}
              onCancel={() => setShowInquiryForm(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
