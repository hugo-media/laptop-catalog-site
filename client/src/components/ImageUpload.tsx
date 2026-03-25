import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ImageUploadProps {
  onImageUrl: (url: string) => void;
  initialImageUrl?: string;
}

export function ImageUpload({ onImageUrl, initialImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadMutation = trpc.system.uploadImage.useMutation({
    onSuccess: (data) => {
      toast.success("Image uploaded successfully");
      onImageUrl(data.url);
      setPreview(data.url);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload image");
    },
  });

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData as any);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
          isDragging
            ? "border-accent bg-accent/5"
            : "border-border/40 hover:border-accent/50"
        }`}
      >
        <div className="space-y-3">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Drag and drop your image here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFile(file);
              }
            }}
            disabled={uploadMutation.isPending}
            className="hidden"
            id="image-input"
          />
          <label htmlFor="image-input">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadMutation.isPending}
              onClick={() => document.getElementById("image-input")?.click()}
              className="cursor-pointer"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image
                </>
              )}
            </Button>
          </label>
          <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
        </div>
      </div>

      {preview && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Preview</p>
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-40 object-cover rounded-lg border border-border/40"
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onImageUrl("");
              }}
              className="absolute -top-2 -right-2 bg-destructive hover:bg-destructive/90 text-white rounded-full p-1 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
