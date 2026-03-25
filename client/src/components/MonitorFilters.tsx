import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export interface MonitorFilterOptions {
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  resolution?: string;
  refreshRate?: string;
  panelType?: string;
}

interface MonitorFiltersProps {
  onFilterChange: (filters: MonitorFilterOptions) => void;
}

const SIZE_OPTIONS = ["21\"", "22\"", "24\"", "27\"", "32\"", "34\"", "38\""];
const RESOLUTION_OPTIONS = ["1080p", "1440p", "2160p (4K)", "3440x1440"];
const REFRESH_RATE_OPTIONS = ["60Hz", "75Hz", "100Hz", "120Hz", "144Hz", "165Hz", "240Hz"];
const PANEL_TYPE_OPTIONS = ["IPS", "VA", "TN", "OLED", "Nano Cell"];

export function MonitorFilters({ onFilterChange }: MonitorFiltersProps) {
  const [filters, setFilters] = useState<MonitorFilterOptions>({});
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

  const handleFilterToggle = (filterType: keyof MonitorFilterOptions, value: string) => {
    const newFilters = { ...filters } as Record<string, any>;
    if (newFilters[filterType] === value) {
      newFilters[filterType] = undefined;
    } else {
      newFilters[filterType] = value;
    }
    setFilters(newFilters as MonitorFilterOptions);
    onFilterChange(newFilters as MonitorFilterOptions);
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

          {/* Screen Size */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Screen Size</h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <Button
                  key={size}
                  variant={filters.size === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle("size", size)}
                  className="text-xs"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Resolution</h3>
            <div className="flex flex-wrap gap-2">
              {RESOLUTION_OPTIONS.map((res) => (
                <Button
                  key={res}
                  variant={filters.resolution === res ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle("resolution", res)}
                  className="text-xs"
                >
                  {res}
                </Button>
              ))}
            </div>
          </div>

          {/* Refresh Rate */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Refresh Rate</h3>
            <div className="flex flex-wrap gap-2">
              {REFRESH_RATE_OPTIONS.map((rate) => (
                <Button
                  key={rate}
                  variant={filters.refreshRate === rate ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle("refreshRate", rate)}
                  className="text-xs"
                >
                  {rate}
                </Button>
              ))}
            </div>
          </div>

          {/* Panel Type */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Panel Type</h3>
            <div className="flex flex-wrap gap-2">
              {PANEL_TYPE_OPTIONS.map((panel) => (
                <Button
                  key={panel}
                  variant={filters.panelType === panel ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle("panelType", panel)}
                  className="text-xs"
                >
                  {panel}
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
