import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "./ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import type { Tablet } from "../../../drizzle/schema";

interface TabletFormProps {
  initialData?: Tablet;
  onSubmit: (data: {
    name: string;
    processor: string;
    ram: string;
    storage: string;
    display: string;
    operatingSystem: string;
    condition: string;
    warranty: string;
    price: number;
    imageUrl?: string;
    description?: string;
  }) => void;
  isLoading?: boolean;
}

export function TabletForm({ initialData, onSubmit, isLoading = false }: TabletFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    processor: initialData?.processor || "",
    ram: initialData?.ram || "",
    storage: initialData?.storage || "",
    display: initialData?.display || "",
    operatingSystem: initialData?.operatingSystem || "",
    condition: initialData?.condition || "",
    warranty: initialData?.warranty || "",
    price: initialData?.price || 0,
    imageUrl: initialData?.imageUrl || "",
    description: initialData?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Tablet name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Processor</label>
        <Input
          value={formData.processor}
          onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
          placeholder="e.g., Apple M1, Snapdragon 888"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">RAM</label>
        <Input
          value={formData.ram}
          onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
          placeholder="e.g., 4GB, 8GB, 12GB"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Storage</label>
        <Input
          value={formData.storage}
          onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
          placeholder="e.g., 64GB, 128GB, 256GB"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Display</label>
        <Input
          value={formData.display}
          onChange={(e) => setFormData({ ...formData, display: e.target.value })}
          placeholder="e.g., 10.9 inch, 12.9 inch"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Operating System</label>
        <Input
          value={formData.operatingSystem}
          onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
          placeholder="e.g., iPadOS, Android"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Condition</label>
        <Input
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          placeholder="e.g., New, Like New, Good"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Warranty</label>
        <Input
          value={formData.warranty}
          onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
          placeholder="e.g., 1 Year, 2 Years"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price (zł)</label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          placeholder="Price"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <ImageUpload
          onImageUrl={(url: string) => setFormData({ ...formData, imageUrl: url })}
          initialImageUrl={formData.imageUrl}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Tablet" : "Add Tablet")}
      </Button>
    </form>
  );
}
