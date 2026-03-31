import type { Laptop as LaptopType } from "../../../drizzle/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Laptop, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface LaptopCardProps {
  laptop: LaptopType;
}

export function LaptopCard({ laptop }: LaptopCardProps) {
  const [, setLocation] = useLocation();
  // Determine product type from context - default to laptops
  const productType = "laptops";
  
  const handleCardClick = () => {
    setLocation(`/product/${productType}/${laptop.id}`);
  };
  
  return (
    <div onClick={handleCardClick} className="group h-full flex flex-col bg-card rounded-lg border border-border/60 hover:border-accent/40 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
      {/* Premium Image Area */}
      <div className="relative w-full h-40 bg-gradient-to-br from-secondary/50 via-secondary/30 to-secondary/20 flex items-center justify-center border-b border-border/40 overflow-hidden">
        {laptop.imageUrl ? (
          <img
            src={laptop.imageUrl}
            alt={laptop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Laptop className="h-24 w-24 text-muted-foreground/25 group-hover:text-accent/35 transition-all duration-300 group-hover:scale-110" />
          </>
        )}
        {laptop.discountPercent && laptop.discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            -{laptop.discountPercent}%
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Product Title */}
        <div>
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-accent transition-colors duration-300 line-clamp-2">
            {laptop.name}
          </h3>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="secondary" 
            className="text-xs font-semibold px-3 py-1 bg-secondary/80 text-foreground/80"
          >
            {laptop.condition}
          </Badge>
          {laptop.warranty && (
            <Badge 
              variant="outline" 
              className="text-xs font-semibold px-3 py-1 border-accent/30 text-muted-foreground"
            >
              {laptop.warranty}
            </Badge>
          )}
        </div>

        {/* Specifications Grid - Premium Layout */}
        <div className="space-y-2 py-3 border-y border-border/40">
          {/* Primary Specs - 2 columns */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                Processor
              </p>
              <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
                {laptop.processor}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                Graphics
              </p>
              <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
                {laptop.graphicsCard}
              </p>
            </div>
          </div>

          {/* Secondary Specs - 2 columns */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                RAM
              </p>
              <p className="text-xs font-semibold text-foreground">
                {laptop.ram}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                Storage
              </p>
              <p className="text-xs font-semibold text-foreground">
                {laptop.storage}
              </p>
            </div>
          </div>

          {/* Display - Full width */}
          <div className="space-y-1 pt-1">
            <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
              Display
            </p>
            <p className="text-xs font-semibold text-foreground">
              {laptop.display}
            </p>
          </div>
        </div>

        {/* Price Section - Premium Styling */}
        <div className="space-y-2 pt-2 mt-auto">
          {laptop.discountPercent && laptop.discountPercent > 0 ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold text-muted-foreground line-through">
                  {laptop.price.toLocaleString('pl-PL')}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">zł</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-red-600 tracking-tight">
                  {Math.round(laptop.price * (1 - laptop.discountPercent / 100)).toLocaleString('pl-PL')}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">zł</span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-accent tracking-tight">
                {laptop.price.toLocaleString('pl-PL')}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">zł</span>
            </div>
          )}

          {/* Call-to-Action Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setLocation(`/product/${productType}/${laptop.id}`);
            }}
            className="w-full group/btn gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-9 text-sm transition-all duration-300"
            size="sm"
          >
            Ask About This Item
            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
}
