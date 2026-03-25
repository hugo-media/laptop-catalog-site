import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LaptopForm } from "@/components/LaptopForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

type Category = "promotions" | "refurbished" | "new" | "monitors" | "accessories" | "business";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "promotions", label: "Акції" },
  { value: "refurbished", label: "Ноутбуки після оренди" },
  { value: "new", label: "Нові ноутбуки" },
  { value: "monitors", label: "Монітори" },
  { value: "accessories", label: "Аксесуари" },
  { value: "business", label: "Пропозиція для компаній" },
];

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("new");

  const { data: laptops, isLoading } = trpc.laptops.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.laptops.create.useMutation({
    onSuccess: () => {
      toast.success("Laptop added successfully");
      setIsAddOpen(false);
      utils.laptops.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add laptop");
    },
  });

  const updateMutation = trpc.laptops.update.useMutation({
    onSuccess: () => {
      toast.success("Laptop updated successfully");
      setEditingId(null);
      utils.laptops.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update laptop");
    },
  });

  const deleteMutation = trpc.laptops.delete.useMutation({
    onSuccess: () => {
      toast.success("Laptop deleted successfully");
      setDeleteId(null);
      utils.laptops.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete laptop");
    },
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    );
  }

  const filteredLaptops = laptops?.filter((l) => l.category === selectedCategory) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage your laptop inventory</p>
            </div>
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="border-border/40"
            >
              Back to Catalog
            </Button>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="container">
          <div className="flex overflow-x-auto gap-1 py-3 -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                variant={selectedCategory === cat.value ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap text-sm"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        {/* Add New Laptop Button */}
        <div className="mb-8">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4" />
                Add New Laptop
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Laptop</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto pr-4">
                <LaptopForm
                  onSubmit={(data) => {
                    createMutation.mutate({
                      ...data,
                      category: selectedCategory,
                    });
                  }}
                  isLoading={createMutation.isPending}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Laptops Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {CATEGORIES.find((c) => c.value === selectedCategory)?.label} ({filteredLaptops.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : filteredLaptops.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No laptops in this category</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Processor</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLaptops.map((laptop) => (
                      <TableRow key={laptop.id}>
                        <TableCell className="font-medium">{laptop.name}</TableCell>
                        <TableCell className="text-sm">{laptop.processor}</TableCell>
                        <TableCell>{laptop.price} zł</TableCell>
                        <TableCell>{laptop.condition}</TableCell>
                        <TableCell className="space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingId(laptop.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Laptop</DialogTitle>
                              </DialogHeader>
                              <div className="overflow-y-auto pr-4">
                                <LaptopForm
                                  initialData={laptop}
                                  onSubmit={(data) => {
                                    updateMutation.mutate({
                                      id: laptop.id,
                                      ...data,
                                    });
                                  }}
                                  isLoading={updateMutation.isPending}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteId(laptop.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Laptop</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this laptop? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate({ id: deleteId });
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
