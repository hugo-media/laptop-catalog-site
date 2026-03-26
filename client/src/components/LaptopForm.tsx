import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { Textarea } from "@/components/ui/textarea";
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
    imageUrl?: string;
    description?: string;
    category: Category;
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
    imageUrl: initialData?.imageUrl || "",
    description: initialData?.description || "",
    category: (initialData?.category || "new") as Category,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as Category,
    }));
  };

  const handleImageUrl = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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

        {/* Category Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="promotions">Акції</SelectItem>
              <SelectItem value="refurbished">Ноутбуки після оренди</SelectItem>
              <SelectItem value="new">Нові ноутбуки</SelectItem>
              <SelectItem value="monitors">Монітори</SelectItem>
              <SelectItem value="accessories">Аксесуари</SelectItem>
              <SelectItem value="business">Пропозиція для компаній</SelectItem>
            </SelectContent>
          </Select>
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
