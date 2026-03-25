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
import MonitorForm from "@/components/MonitorForm";
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
type ProductType = "laptops" | "monitors";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "promotions", label: "Акції" },
  { value: "refurbished", label: "Ноутбуки після оренди" },
  { value: "new", label: "Нові ноутбуки" },
  { value: "monitors", label: "Монітори" },
  { value: "accessories", label: "Аксесуари" },
  { value: "business", label: "Пропозиція для компаній" },
];

const MONITOR_CATEGORIES = [
  { value: "new", label: "Нові монітори" },
  { value: "refurbished", label: "Відновлені монітори" },
  { value: "gaming", label: "Ігрові монітори" },
  { value: "professional", label: "Професійні монітори" },
  { value: "budget", label: "Бюджетні монітори" },
  { value: "promotions", label: "Акції" },
];

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("new");
  const [productType, setProductType] = useState<ProductType>("laptops");
  const [selectedMonitorCategory, setSelectedMonitorCategory] = useState("new");

  const { data: laptops, isLoading: laptopsLoading } = trpc.laptops.list.useQuery();
  const { data: monitors, isLoading: monitorsLoading } = trpc.monitors.list.useQuery();
  const utils = trpc.useUtils();
  const isLoading = productType === "laptops" ? laptopsLoading : monitorsLoading;

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

  const deleteLaptopMutation = trpc.laptops.delete.useMutation({
    onSuccess: () => {
      toast.success("Laptop deleted successfully");
      setDeleteId(null);
      utils.laptops.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete laptop");
    },
  });

  const deleteMonitorMutation = trpc.monitors.delete.useMutation({
    onSuccess: () => {
      toast.success("Monitor deleted successfully");
      setDeleteId(null);
      utils.monitors.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete monitor");
    },
  });

  const deleteMutation = productType === "laptops" ? deleteLaptopMutation : deleteMonitorMutation;

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
  const filteredMonitors = monitors?.filter((m) => m.category === selectedMonitorCategory) || [];
  const currentItems = productType === "laptops" ? filteredLaptops : filteredMonitors;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage your inventory</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setProductType("laptops");
                  setIsAddOpen(false);
                }}
                variant={productType === "laptops" ? "default" : "outline"}
                size="sm"
              >
                Laptops
              </Button>
              <Button 
                onClick={() => {
                  setProductType("monitors");
                  setIsAddOpen(false);
                }}
                variant={productType === "monitors" ? "default" : "outline"}
                size="sm"
              >
                Monitors
              </Button>
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
            {productType === "laptops" ? (
              CATEGORIES.map((cat) => (
                <Button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  variant={selectedCategory === cat.value ? "default" : "ghost"}
                  size="sm"
                  className="whitespace-nowrap text-sm"
                >
                  {cat.label}
                </Button>
              ))
            ) : (
              MONITOR_CATEGORIES.map((cat) => (
                <Button
                  key={cat.value}
                  onClick={() => setSelectedMonitorCategory(cat.value)}
                  variant={selectedMonitorCategory === cat.value ? "default" : "ghost"}
                  size="sm"
                  className="whitespace-nowrap text-sm"
                >
                  {cat.label}
                </Button>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        {/* Add New Product Button */}
        <div className="mb-8">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4" />
                {productType === "laptops" ? "Add New Laptop" : "Add New Monitor"}
              </Button>
            </DialogTrigger>
            <DialogContent key={`add-${productType}`} className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{productType === "laptops" ? "Add New Laptop" : "Add New Monitor"}</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto pr-4">
                {productType === "laptops" ? (
                  <LaptopForm
                    onSubmit={(data) => {
                      createMutation.mutate({
                        ...data,
                        category: selectedCategory,
                      });
                    }}
                    isLoading={createMutation.isPending}
                  />
                ) : (
                  <MonitorForm 
                    selectedCategory={selectedMonitorCategory}
                    onSubmit={(data) => {
                      createMutation.mutate(data);
                    }}
                    isLoading={createMutation.isPending}
                    onSuccess={() => setIsAddOpen(false)}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {productType === "laptops" 
                ? CATEGORIES.find((c) => c.value === selectedCategory)?.label 
                : MONITOR_CATEGORIES.find((c) => c.value === selectedMonitorCategory)?.label} ({currentItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : currentItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No products in this category</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>{productType === "laptops" ? "Processor" : "Resolution"}</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-sm">{productType === "laptops" ? item.processor : item.resolution}</TableCell>
                        <TableCell>{item.price} zł</TableCell>
                        <TableCell>{item.condition}</TableCell>
                        <TableCell className="space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingId(item.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit {productType === "laptops" ? "Laptop" : "Monitor"}</DialogTitle>
                              </DialogHeader>
                              <div className="overflow-y-auto pr-4">
                                {productType === "laptops" ? (
                                  <LaptopForm
                                    initialData={item}
                                    onSubmit={(data) => {
                                      updateMutation.mutate({
                                        id: item.id,
                                        ...data,
                                      });
                                    }}
                                    isLoading={updateMutation.isPending}
                                  />
                                ) : (
                                  <MonitorForm 
                                    monitorId={item.id} 
                                    selectedCategory={selectedMonitorCategory}
                                    onSuccess={() => setEditingId(null)} 
                                  />
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteId(item.id)}
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
          <AlertDialogTitle>Delete {productType === "laptops" ? "Laptop" : "Monitor"}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {productType === "laptops" ? "laptop" : "monitor"}? This action cannot be undone.
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
