import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export interface SmartDeviceFilterOptions {
  minPrice?: number;
  maxPrice?: number;
  deviceType?: string;
  brand?: string;
}

interface SmartDeviceFiltersProps {
  onFilterChange: (filters: SmartDeviceFilterOptions) => void;
}

const DEVICE_TYPE_OPTIONS = [
  "Смарт годинники",
  "Розумні окуляри",
  "Фітнес браслети",
  "Смарт кольця",
  "Портативні колонки",
  "Смарт лампи",
];
const BRAND_OPTIONS = [
  "Apple",
  "Samsung",
  "Garmin",
  "Fitbit",
  "Xiaomi",
  "Google",
  "Meta",
  "Huawei",
];

export function SmartDeviceFilters({ onFilterChange }: SmartDeviceFiltersProps) {
  const [filters, setFilters] = useState<SmartDeviceFilterOptions>({});
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

  const handleFilterToggle = (filterType: keyof SmartDeviceFilterOptions, value: string) => {
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

          {/* Device Type */}
          <div>
            <h4 className="font-medium mb-3">Device Type</h4>
            <div className="flex flex-wrap gap-2">
              {DEVICE_TYPE_OPTIONS.map((type) => (
                <Button
                  key={type}
                  onClick={() => handleFilterToggle("deviceType", type)}
                  variant={filters.deviceType === type ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {type}
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
