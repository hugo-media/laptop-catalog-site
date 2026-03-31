import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "./ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Laptop } from "../../../drizzle/schema";

type Category = "promotions" | "refurbished" | "new" | "business";

interface LaptopFormProps {
  initialData?: Laptop;
  onSubmit: (data: {
    name: string;
    processor: string;
    graphicsCard: string;
    ram: string;
    storage: string;
    display: string;
    operatingSystem: string;
    condition: string;
    warranty: string;
    price: number;
    discountPercent?: number;
    imageUrl?: string;
    description?: string;
    categories: Category[];
  }) => void;
  isLoading?: boolean;
}

export function LaptopForm({ initialData, onSubmit, isLoading = false }: LaptopFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    processor: initialData?.processor || "",
    graphicsCard: initialData?.graphicsCard || "",
    ram: initialData?.ram || "",
    storage: initialData?.storage || "",
    display: initialData?.display || "",
    operatingSystem: initialData?.operatingSystem || "",
    condition: initialData?.condition || "",
    warranty: initialData?.warranty || "",
    price: initialData?.price || 0,
    discountPercent: initialData?.discountPercent || 0,
    imageUrl: initialData?.imageUrl || "",
    description: initialData?.description || "",
    categories: initialData?.categories ? JSON.parse(initialData.categories as any) : ["new"],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === "price" || name === "discountPercent") ? (Number(value) || 0) : value,
    }));
  };

  const handleCategoryChange = (categoryValue: string) => {
    setFormData((prev) => {
      const currentCategories = prev.categories as Category[];
      const isChecked = currentCategories.includes(categoryValue as Category);
      
      if (isChecked) {
        return {
          ...prev,
          categories: currentCategories.filter(c => c !== categoryValue),
        };
      } else {
        return {
          ...prev,
          categories: [...currentCategories, categoryValue as Category],
        };
      }
    });
  };

  const handleImageUrl = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      categories: formData.categories,
    });
  };

  const fields = [
    { label: "Laptop Name", name: "name", placeholder: "e.g., Dell XPS 15" },
    { label: "Processor", name: "processor", placeholder: "e.g., Intel Core Ultra 9 285HX" },
    { label: "Graphics Card", name: "graphicsCard", placeholder: "e.g., NVIDIA RTX 5070" },
    { label: "RAM", name: "ram", placeholder: "e.g., 32 GB DDR5" },
    { label: "Storage", name: "storage", placeholder: "e.g., 1 TB SSD NVMe" },
    { label: "Display", name: "display", placeholder: "e.g., 16 inch QHD+" },
    { label: "Operating System", name: "operatingSystem", placeholder: "e.g., Windows 11 Pro" },
    { label: "Condition", name: "condition", placeholder: "e.g., New" },
    { label: "Warranty", name: "warranty", placeholder: "e.g., 2 years official" },
    { label: "Price (zł)", name: "price", placeholder: "e.g., 5999", type: "number" },
    { label: "Discount (%)", name: "discountPercent", placeholder: "e.g., 15", type: "number" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Product Image</label>
        <ImageUpload 
          onImageUrl={handleImageUrl} 
          initialImageUrl={formData.imageUrl}
        />
      </div>

      {/* Basic Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-sm font-medium">{field.label}</label>
            <Input
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Categories Checkboxes */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Категорії (виберіть декілька)</label>
          <div className="space-y-2">
            {[
              { value: "new", label: "Нові ноутбуки" },
              { value: "refurbished", label: "Ноутбуки після оренди" },
              { value: "business", label: "Пропозиція для компаній" },
              { value: "promotions", label: "Акції" },
            ].map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <Checkbox
                  id={cat.value}
                  checked={(formData.categories as Category[]).includes(cat.value as Category)}
                  onCheckedChange={() => handleCategoryChange(cat.value)}
                />
                <Label htmlFor={cat.value} className="font-normal cursor-pointer">
                  {cat.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Product Description</label>
        <Textarea
          name="description"
          placeholder="Enter detailed product description, features, and benefits..."
          value={formData.description}
          onChange={handleChange}
          className="min-h-32 resize-none"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Laptop"}
      </Button>
    </form>
  );
}
