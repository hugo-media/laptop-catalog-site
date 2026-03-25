import type { Laptop as LaptopType } from "../../../drizzle/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, User, MessageSquare, Loader2 } from "lucide-react";

interface InquiryFormProps {
  laptop: LaptopType;
  onSuccess: () => void;
  onCancel: () => void;
}

export function InquiryForm({ laptop, onSuccess, onCancel }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Будь ласка, введіть ваше ім'я");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Будь ласка, введіть вашу електронну пошту");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Будь ласка, введіть коректну електронну пошту");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Будь ласка, введіть ваш номер телефону");
      return;
    }

    setLoading(true);

    try {
      // Send inquiry notification to owner
      const response = await fetch("/api/trpc/system.notifyOwner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Новий запит про товар: ${laptop.name}`,
          content: `Ім'я: ${formData.name}\nЕлектронна пошта: ${formData.email}\nНомер телефону: ${formData.phone}\n\nТовар: ${laptop.name} (${laptop.price} zł)\n\nПовідомлення:\n${formData.message || "Немає додаткового повідомлення"}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send inquiry");
      }

      toast.success("Ваш запит успішно відправлено! Ми зв'яжемося з вами найближчим часом.");
      onSuccess();
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Помилка при відправці запиту. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-border/40 pt-6">
      <h3 className="text-lg font-semibold text-foreground">Запитати про товар</h3>

      {/* Name Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-accent" />
          Ваше ім'я
        </label>
        <Input
          type="text"
          name="name"
          placeholder="Введіть ваше ім'я"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          className="border-border/40"
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Mail className="h-4 w-4 text-accent" />
          Електронна пошта
        </label>
        <Input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          className="border-border/40"
        />
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Phone className="h-4 w-4 text-accent" />
          Номер телефону
        </label>
        <Input
          type="tel"
          name="phone"
          placeholder="+48 123 456 789"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
          className="border-border/40"
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-accent" />
          Повідомлення (необов'язково)
        </label>
        <Textarea
          name="message"
          placeholder="Напишіть вашу пропозицію або запитання..."
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
          className="border-border/40 min-h-24 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Відправлення...
            </>
          ) : (
            "Відправити запит"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 border-border/40 h-11"
        >
          Скасувати
        </Button>
      </div>
    </form>
  );
}
