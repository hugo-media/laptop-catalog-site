import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FilterState {
  priceRange: [number, number];
  processors: string[];
  ram: string[];
  screenSize: string[];
  condition: string[];
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  productType: string;
}

const PROCESSORS = ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9'];
const RAM_OPTIONS = ['8GB', '16GB', '32GB', '64GB'];
const SCREEN_SIZES = ['13"', '14"', '15"', '16"', '17"'];
const CONDITIONS = ['Новий', 'Б/У', 'Відновлений'];

export function ProductFilters({ onFilterChange, productType }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    processors: [],
    ram: [],
    screenSize: [],
    condition: [],
  });

  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (category: keyof Omit<FilterState, 'priceRange'>, value: string) => {
    const newFilters = { ...filters };
    if (newFilters[category].includes(value)) {
      newFilters[category] = newFilters[category].filter((item) => item !== value);
    } else {
      newFilters[category].push(value);
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 50000],
      processors: [],
      ram: [],
      screenSize: [],
      condition: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFiltersCount =
    filters.processors.length +
    filters.ram.length +
    filters.screenSize.length +
    filters.condition.length;

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50"
      >
        <span className="font-semibold">
          Фільтри {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </span>
        <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div className="bg-white border rounded-lg p-4 space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Ціна: {filters.priceRange[0]} - {filters.priceRange[1]} zł
            </label>
            <Slider
              min={0}
              max={50000}
              step={500}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="w-full"
            />
          </div>

          {/* Processors */}
          {productType === 'laptops' && (
            <div>
              <label className="block text-sm font-medium mb-2">Процесор</label>
              <div className="space-y-2">
                {PROCESSORS.map((processor) => (
                  <div key={processor} className="flex items-center">
                    <Checkbox
                      id={processor}
                      checked={filters.processors.includes(processor)}
                      onCheckedChange={() => handleCheckboxChange('processors', processor)}
                    />
                    <label htmlFor={processor} className="ml-2 text-sm cursor-pointer">
                      {processor}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RAM */}
          {productType === 'laptops' && (
            <div>
              <label className="block text-sm font-medium mb-2">ОЗУ</label>
              <div className="space-y-2">
                {RAM_OPTIONS.map((ram) => (
                  <div key={ram} className="flex items-center">
                    <Checkbox
                      id={ram}
                      checked={filters.ram.includes(ram)}
                      onCheckedChange={() => handleCheckboxChange('ram', ram)}
                    />
                    <label htmlFor={ram} className="ml-2 text-sm cursor-pointer">
                      {ram}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screen Size */}
          {productType === 'laptops' && (
            <div>
              <label className="block text-sm font-medium mb-2">Розмір екрану</label>
              <div className="space-y-2">
                {SCREEN_SIZES.map((size) => (
                  <div key={size} className="flex items-center">
                    <Checkbox
                      id={size}
                      checked={filters.screenSize.includes(size)}
                      onCheckedChange={() => handleCheckboxChange('screenSize', size)}
                    />
                    <label htmlFor={size} className="ml-2 text-sm cursor-pointer">
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium mb-2">Стан</label>
            <div className="space-y-2">
              {CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center">
                  <Checkbox
                    id={condition}
                    checked={filters.condition.includes(condition)}
                    onCheckedChange={() => handleCheckboxChange('condition', condition)}
                  />
                  <label htmlFor={condition} className="ml-2 text-sm cursor-pointer">
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full"
            >
              <X size={16} className="mr-2" />
              Очистити фільтри
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
