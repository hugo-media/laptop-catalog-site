import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Laptop } from "../../../drizzle/schema";

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initialData ? "Update Laptop" : "Add Laptop"}
      </Button>
    </form>
  );
}
