import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "./ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import type { SmartDevice } from "../../../drizzle/schema";

interface SmartDeviceFormProps {
  initialData?: SmartDevice;
  onSubmit: (data: {
    name: string;
    type: string;
    brand: string;
    batteryLife: string;
    connectivity: string;
    condition: string;
    warranty: string;
    price: number;
    imageUrl?: string;
    description?: string;
  }) => void;
  isLoading?: boolean;
}

export function SmartDeviceForm({ initialData, onSubmit, isLoading = false }: SmartDeviceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "",
    brand: initialData?.brand || "",
    battery: initialData?.battery || "",
    connectivity: initialData?.connectivity || "",
    condition: initialData?.condition || "",
    warranty: initialData?.warranty || "",
    price: initialData?.price || 0,
    imageUrl: initialData?.imageUrl || "",
    description: initialData?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      batteryLife: formData.battery,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Smart device name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Input
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          placeholder="e.g., Smartwatch, Smart Glasses, Fitness Tracker"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand</label>
        <Input
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="Brand name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Battery Life</label>
        <Input
          value={formData.battery}
          onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
          placeholder="e.g., 7 days, 14 days, 30 days"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Connectivity</label>
        <Input
          value={formData.connectivity}
          onChange={(e) => setFormData({ ...formData, connectivity: e.target.value })}
          placeholder="e.g., Bluetooth, WiFi, LTE"
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
        {isLoading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Smart Device" : "Add Smart Device")}
      </Button>
    </form>
  );
}
