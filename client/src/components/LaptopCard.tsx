import { Laptop as LaptopType } from "../../../drizzle/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Laptop, ArrowRight } from "lucide-react";

interface LaptopCardProps {
  laptop: LaptopType;
}

export function LaptopCard({ laptop }: LaptopCardProps) {
  return (
    <div className="group h-full flex flex-col bg-card rounded-lg border border-border/60 hover:border-accent/40 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Premium Image Placeholder Area */}
      <div className="relative w-full h-56 bg-gradient-to-br from-secondary/50 via-secondary/30 to-secondary/20 flex items-center justify-center border-b border-border/40 overflow-hidden">
        {/* Subtle animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Icon */}
        <Laptop className="h-24 w-24 text-muted-foreground/25 group-hover:text-accent/35 transition-all duration-300 group-hover:scale-110" />
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {/* Product Title */}
        <div>
          <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-accent transition-colors duration-300 line-clamp-2">
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
        <div className="space-y-3 py-4 border-y border-border/40">
          {/* Primary Specs - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                Processor
              </p>
              <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                {laptop.processor}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                Graphics
              </p>
              <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                {laptop.graphicsCard}
              </p>
            </div>
          </div>

          {/* Secondary Specs - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                RAM
              </p>
              <p className="text-sm font-semibold text-foreground">
                {laptop.ram}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
                Storage
              </p>
              <p className="text-sm font-semibold text-foreground">
                {laptop.storage}
              </p>
            </div>
          </div>

          {/* Display - Full width */}
          <div className="space-y-1.5 pt-2">
            <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
              Display
            </p>
            <p className="text-sm font-semibold text-foreground">
              {laptop.display}
            </p>
          </div>
        </div>

        {/* Price Section - Premium Styling */}
        <div className="space-y-4 pt-2 mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-accent tracking-tight">
              {laptop.price.toLocaleString('pl-PL')}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">zł</span>
          </div>

          {/* Call-to-Action Button */}
          <Button
            className="w-full group/btn gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11 transition-all duration-300"
            size="sm"
          >
            Ask About This Item
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
}
