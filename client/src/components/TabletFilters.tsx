import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export interface TabletFilterOptions {
  minPrice?: number;
  maxPrice?: number;
  displaySize?: string;
  ram?: string;
  processor?: string;
  brand?: string;
}

interface TabletFiltersProps {
  onFilterChange: (filters: TabletFilterOptions) => void;
}

const DISPLAY_SIZE_OPTIONS = ["7\"", "8\"", "10\"", "11\"", "12\"", "13\""];
const RAM_OPTIONS = ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB"];
const PROCESSOR_OPTIONS = [
  "Apple A14",
  "Apple A15",
  "Apple M1",
  "Snapdragon 8 Gen 1",
  "Snapdragon 8 Gen 2",
  "MediaTek Dimensity",
  "Samsung Exynos",
];
const BRAND_OPTIONS = [
  "Apple",
  "Samsung",
  "iPad",
  "Lenovo",
  "ASUS",
  "Huawei",
  "Microsoft",
];

export function TabletFilters({ onFilterChange }: TabletFiltersProps) {
  const [filters, setFilters] = useState<TabletFilterOptions>({});
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

  const handleFilterToggle = (filterType: keyof TabletFilterOptions, value: string) => {
    const newFilters = { ...filters } as Record<string, any>;
    if (newFilters[filterType] === value) {
      newFilters[filterType] = undefined;
    } else {
      newFilters[filterType] = value;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide" : "Show"}
        </Button>
      </div>

      {showFilters && (
        <Card className="p-6 space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3">Price Range (zł)</h4>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                className="w-24"
              />
            </div>
          </div>

          {/* Display Size */}
          <div>
            <h4 className="font-medium mb-3">Display Size</h4>
            <div className="flex flex-wrap gap-2">
              {DISPLAY_SIZE_OPTIONS.map((size) => (
                <Button
                  key={size}
                  onClick={() => handleFilterToggle("displaySize", size)}
                  variant={filters.displaySize === size ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* RAM */}
          <div>
            <h4 className="font-medium mb-3">RAM</h4>
            <div className="flex flex-wrap gap-2">
              {RAM_OPTIONS.map((ram) => (
                <Button
                  key={ram}
                  onClick={() => handleFilterToggle("ram", ram)}
                  variant={filters.ram === ram ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {ram}
                </Button>
              ))}
            </div>
          </div>

          {/* Processor */}
          <div>
            <h4 className="font-medium mb-3">Processor</h4>
            <div className="flex flex-wrap gap-2">
              {PROCESSOR_OPTIONS.map((proc) => (
                <Button
                  key={proc}
                  onClick={() => handleFilterToggle("processor", proc)}
                  variant={filters.processor === proc ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {proc}
                </Button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <h4 className="font-medium mb-3">Brand</h4>
            <div className="flex flex-wrap gap-2">
              {BRAND_OPTIONS.map((brand) => (
                <Button
                  key={brand}
                  onClick={() => handleFilterToggle("brand", brand)}
                  variant={filters.brand === brand ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {brand}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {Object.keys(filters).length > 0 && (
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
