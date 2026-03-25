import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { useEffect } from "react";

interface MonitorFormProps {
  monitorId?: number;
  onSuccess?: () => void;
}

export default function MonitorForm({ monitorId, onSuccess }: MonitorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    resolution: "",
    panelType: "",
    refreshRate: "",
    brightness: "",
    contrast: "",
    responseTime: "",
    connectivity: "",
    size: "",
    condition: "",
    warranty: "",
    price: 0,
    imageUrl: "",
    description: "",
    category: "new" as const,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch monitor data if editing
  const { data: monitor } = trpc.monitors.getById.useQuery(
    { id: monitorId! },
    { enabled: !!monitorId }
  );

  // Update form when monitor data is loaded
  useEffect(() => {
    if (monitor && !formData.name) {
      setFormData({
        name: monitor.name,
        resolution: monitor.resolution,
        panelType: monitor.panelType,
        refreshRate: monitor.refreshRate,
        brightness: monitor.brightness,
        contrast: monitor.contrast,
        responseTime: monitor.responseTime,
        connectivity: monitor.connectivity,
        size: monitor.size,
        condition: monitor.condition,
        warranty: monitor.warranty,
        price: monitor.price,
        imageUrl: monitor.imageUrl || "",
        description: monitor.description || "",
        category: monitor.category as any,
      });
    }
  }, [monitor]);

  const createMutation = trpc.monitors.create.useMutation();
  const updateMutation = trpc.monitors.update.useMutation();
  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (monitorId) {
        await updateMutation.mutateAsync({
          id: monitorId,
          ...formData,
        });
        toast.success("Monitor updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Monitor created successfully");
        setFormData({
          name: "",
          resolution: "",
          panelType: "",
          refreshRate: "",
          brightness: "",
          contrast: "",
          responseTime: "",
          connectivity: "",
          size: "",
          condition: "",
          warranty: "",
          price: 0,
          imageUrl: "",
          description: "",
          category: "new",
        });
      }
      await utils.monitors.list.invalidate();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to save monitor");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        {formData.imageUrl ? (
          <div className="space-y-4">
            <img src={formData.imageUrl} alt="Monitor" className="h-48 mx-auto object-contain" />
            <label className="cursor-pointer">
              <span className="text-sm text-muted-foreground">Click to change image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="font-semibold">Drag and drop your image here</span>
              <span className="text-sm text-muted-foreground">or click to browse</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Monitor Name */}
      <div>
        <label className="block font-semibold mb-2">Monitor Name</label>
        <Input
          placeholder="e.g., Dell UltraSharp 27 4K"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      {/* Resolution and Panel Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Resolution</label>
          <Input
            placeholder="e.g., 2560x1440"
            value={formData.resolution}
            onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Panel Type</label>
          <Input
            placeholder="e.g., IPS, VA, TN, OLED"
            value={formData.panelType}
            onChange={(e) => setFormData({ ...formData, panelType: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Refresh Rate and Brightness */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Refresh Rate</label>
          <Input
            placeholder="e.g., 60Hz, 144Hz, 240Hz"
            value={formData.refreshRate}
            onChange={(e) => setFormData({ ...formData, refreshRate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Brightness</label>
          <Input
            placeholder="e.g., 300 nits"
            value={formData.brightness}
            onChange={(e) => setFormData({ ...formData, brightness: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Contrast and Response Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Contrast</label>
          <Input
            placeholder="e.g., 1000:1"
            value={formData.contrast}
            onChange={(e) => setFormData({ ...formData, contrast: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Response Time</label>
          <Input
            placeholder="e.g., 1ms, 5ms"
            value={formData.responseTime}
            onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Connectivity and Size */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Connectivity</label>
          <Input
            placeholder="e.g., HDMI, DisplayPort, USB-C"
            value={formData.connectivity}
            onChange={(e) => setFormData({ ...formData, connectivity: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Size</label>
          <Input
            placeholder="e.g., 27 inch, 32 inch"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Condition and Warranty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Condition</label>
          <Input
            placeholder="e.g., New, Like New, Used"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Warranty</label>
          <Input
            placeholder="e.g., 3 years official"
            value={formData.warranty}
            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block font-semibold mb-2">Price (zł)</label>
        <Input
          type="number"
          placeholder="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-semibold mb-2">Category</label>
        <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="refurbished">Refurbished</SelectItem>
            <SelectItem value="promotions">Promotions</SelectItem>
            <SelectItem value="gaming">Gaming</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="budget">Budget</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold mb-2">Monitor Description</label>
        <Textarea
          placeholder="Enter detailed monitor description, features, and benefits..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? "Saving..." : monitorId ? "Update Monitor" : "Save Monitor"}
      </Button>
    </form>
  );
}
