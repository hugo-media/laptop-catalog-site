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

  const { data: laptops, isLoading, refetch } = trpc.laptops.list.useQuery();
  const createMutation = trpc.laptops.create.useMutation({
    onSuccess: () => {
      toast.success("Laptop added successfully");
      setIsAddOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add laptop");
    },
  });

  const updateMutation = trpc.laptops.update.useMutation({
    onSuccess: () => {
      toast.success("Laptop updated successfully");
      setEditingId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update laptop");
    },
  });

  const deleteMutation = trpc.laptops.delete.useMutation({
    onSuccess: () => {
      toast.success("Laptop deleted successfully");
      setDeleteId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete laptop");
    },
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && user?.role !== "admin") {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return null;
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Laptop</DialogTitle>
              </DialogHeader>
              <LaptopForm
                onSubmit={(data) => {
                  createMutation.mutate({
                    ...data,
                    category: selectedCategory,
                  });
                }}
                isLoading={createMutation.isPending}
              />
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
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : filteredLaptops.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No laptops in this category. Add one to get started!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Processor</TableHead>
                      <TableHead>RAM</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLaptops.map((laptop) => (
                      <TableRow key={laptop.id}>
                        <TableCell className="font-medium">{laptop.name}</TableCell>
                        <TableCell>{laptop.processor}</TableCell>
                        <TableCell>{laptop.ram}</TableCell>
                        <TableCell>{laptop.price.toLocaleString("pl-PL")} zł</TableCell>
                        <TableCell>{laptop.condition}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog open={editingId === laptop.id} onOpenChange={(open) => {
                            if (!open) setEditingId(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setEditingId(laptop.id)}
                                variant="outline"
                                size="sm"
                                className="gap-1"
                              >
                                <Edit2 className="h-4 w-4" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Laptop</DialogTitle>
                              </DialogHeader>
                              <LaptopForm
                                initialData={laptop}
                                onSubmit={(data) => {
                                  updateMutation.mutate({
                                    id: laptop.id,
                                    ...data,
                                    category: selectedCategory,
                                  });
                                }}
                                isLoading={updateMutation.isPending}
                              />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog open={deleteId === laptop.id} onOpenChange={(open) => {
                            if (!open) setDeleteId(null);
                          }}>
                            <Button
                              onClick={() => setDeleteId(laptop.id)}
                              variant="destructive"
                              size="sm"
                              className="gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                            <AlertDialogContent>
                              <AlertDialogTitle>Delete Laptop</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{laptop.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                              <div className="flex gap-2 justify-end">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate({ id: laptop.id })}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </div>
  );
}
