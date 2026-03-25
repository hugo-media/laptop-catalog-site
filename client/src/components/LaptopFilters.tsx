import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export interface LaptopFilterOptions {
  minPrice?: number;
  maxPrice?: number;
  display?: string;
  ram?: string;
  processor?: string;
  brand?: string;
}

interface LaptopFiltersProps {
  onFilterChange: (filters: LaptopFilterOptions) => void;
}

const DISPLAY_OPTIONS = ["13\"", "14\"", "15\"", "16\"", "17\"", "18\""];
const RAM_OPTIONS = ["8 GB", "16 GB", "32 GB", "64 GB"];
const PROCESSOR_OPTIONS = [
  "Intel Core i5",
  "Intel Core i7",
  "Intel Core i9",
  "Intel Core Ultra",
  "AMD Ryzen 5",
  "AMD Ryzen 7",
  "AMD Ryzen 9",
];
const BRAND_OPTIONS = [
  "Dell",
  "HP",
  "Lenovo",
  "ASUS",
  "Acer",
  "MSI",
  "Alienware",
  "Apple",
];

export function LaptopFilters({ onFilterChange }: LaptopFiltersProps) {
  const [filters, setFilters] = useState<LaptopFilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const newFilters = { ...filters };
    if (type === "min") {
      newFilters.minPrice = value ? Number(value) : undefined;
    } else {
      newFilters.maxPrice = value ? Number(value) : undefined;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterToggle = (filterType: keyof LaptopFilterOptions, value: string) => {
    const newFilters = { ...filters } as Record<string, any>;
    if (newFilters[filterType] === value) {
      newFilters[filterType] = undefined;
    } else {
      newFilters[filterType] = value;
    }
    setFilters(newFilters as LaptopFilterOptions);
    onFilterChange(newFilters as LaptopFilterOptions);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined).length;

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <Button
        onClick={() => setShowFilters(!showFilters)}
        variant="outline"
        className="w-full justify-between"
      >
        <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        <span className="text-xs">{showFilters ? "Hide" : "Show"}</span>
      </Button>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4 space-y-4">
          {/* Price Range */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Price Range (zł)</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Display Size */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Display Size</h3>
            <div className="flex flex-wrap gap-2">
              {DISPLAY_OPTIONS.map((size) => (
                <Button
                  key={size}
                  variant={filters.display === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle("display", size)}
                  className="text-xs"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* RAM */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">RAM</h3>
            <div className="flex flex-wrap gap-2">
              {RAM_OPTIONS.map((ram) => (
                <Button
                  key={ram}
                  variant={filters.ram === ram ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle("ram", ram)}
                  className="text-xs"
                >
                  {ram}
                </Button>
              ))}
            </div>
          </div>

          {/* Processor */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Processor</h3>
            <div className="flex flex-wrap gap-2">
              {PROCESSOR_OPTIONS.map((proc) => (
                <Button
                  key={proc}
                  variant={filters.processor === proc ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle("processor", proc)}
                  className="text-xs"
                >
                  {proc}
                </Button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Brand</h3>
            <div className="flex flex-wrap gap-2">
              {BRAND_OPTIONS.map((brand) => (
                <Button
                  key={brand}
                  variant={filters.brand === brand ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle("brand", brand)}
                  className="text-xs"
                >
                  {brand}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="w-full text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
