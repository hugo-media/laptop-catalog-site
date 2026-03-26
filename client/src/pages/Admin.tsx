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
import { TabletFilters, type TabletFilterOptions } from "@/components/TabletFilters";
import { SmartDeviceFilters, type SmartDeviceFilterOptions } from "@/components/SmartDeviceFilters";
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

type ProductType = "laptops" | "monitors" | "accessories" | "tablets" | "smartDevices";
type LaptopCategory = "promotions" | "refurbished" | "new" | "business";
type MonitorCategory = "promotions" | "refurbished" | "new" | "business";
type AccessoryCategory = "promotions" | "refurbished" | "new" | "business";
type TabletCategory = "promotions" | "refurbished" | "new" | "business";
type SmartDeviceCategory = "promotions" | "refurbished" | "new" | "business";

const LAPTOP_CATEGORIES = [
  { value: "promotions" as LaptopCategory, label: "Акції" },
  { value: "refurbished" as LaptopCategory, label: "Відновлені" },
  { value: "new" as LaptopCategory, label: "Нові" },
  { value: "business" as LaptopCategory, label: "Для компаній" },
];

const MONITOR_CATEGORIES = [
  { value: "promotions" as MonitorCategory, label: "Акції" },
  { value: "refurbished" as MonitorCategory, label: "Відновлені" },
  { value: "new" as MonitorCategory, label: "Нові" },
  { value: "business" as MonitorCategory, label: "Для компаній" },
];

const ACCESSORY_CATEGORIES = [
  { value: "promotions" as AccessoryCategory, label: "Акції" },
  { value: "refurbished" as AccessoryCategory, label: "Відновлені" },
  { value: "new" as AccessoryCategory, label: "Нові" },
  { value: "business" as AccessoryCategory, label: "Для компаній" },
];

const TABLET_CATEGORIES = [
  { value: "promotions" as TabletCategory, label: "Акції" },
  { value: "refurbished" as TabletCategory, label: "Відновлені" },
  { value: "new" as TabletCategory, label: "Нові" },
  { value: "business" as TabletCategory, label: "Для компаній" },
];

const SMARTDEVICE_CATEGORIES = [
  { value: "promotions" as SmartDeviceCategory, label: "Акції" },
  { value: "refurbished" as SmartDeviceCategory, label: "Відновлені" },
  { value: "new" as SmartDeviceCategory, label: "Нові" },
  { value: "business" as SmartDeviceCategory, label: "Для компаній" },
];

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [productType, setProductType] = useState<ProductType>("laptops");
  const [laptopCategory, setLaptopCategory] = useState<LaptopCategory>("new");
  const [monitorCategory, setMonitorCategory] = useState<MonitorCategory>("new");
  const [accessoryCategory, setAccessoryCategory] = useState<AccessoryCategory>("new");
  const [tabletCategory, setTabletCategory] = useState<TabletCategory>("new");
  const [smartDeviceCategory, setSmartDeviceCategory] = useState<SmartDeviceCategory>("new");

  // Queries
  const { data: laptops, isLoading: laptopsLoading } = trpc.laptops.list.useQuery();
  const { data: monitors, isLoading: monitorsLoading } = trpc.monitors.list.useQuery();
  const { data: accessories, isLoading: accessoriesLoading } = trpc.accessories.list.useQuery();
  const { data: tablets, isLoading: tabletsLoading } = trpc.tablets.list.useQuery();
  const { data: smartDevices, isLoading: smartDevicesLoading } = trpc.smartDevices.list.useQuery();
  const utils = trpc.useUtils();

  // Get current category and items
  const getCurrentCategory = () => {
    switch (productType) {
      case "laptops": return laptopCategory;
      case "monitors": return monitorCategory;
      case "accessories": return accessoryCategory;
      case "tablets": return tabletCategory;
      case "smartDevices": return smartDeviceCategory;
    }
  };

  const getCurrentItems = () => {
    const category = getCurrentCategory();
    switch (productType) {
      case "laptops": return laptops?.filter((l) => l.category === category) || [];
      case "monitors": return monitors?.filter((m) => m.category === category) || [];
      case "accessories": return accessories?.filter((a) => a.category === category) || [];
      case "tablets": return tablets?.filter((t) => t.category === category) || [];
      case "smartDevices": return smartDevices?.filter((s) => s.category === category) || [];
    }
  };

  const getCurrentLoading = () => {
    switch (productType) {
      case "laptops": return laptopsLoading;
      case "monitors": return monitorsLoading;
      case "accessories": return accessoriesLoading;
      case "tablets": return tabletsLoading;
      case "smartDevices": return smartDevicesLoading;
    }
  };

  const getCurrentCategoryList = () => {
    switch (productType) {
      case "laptops": return LAPTOP_CATEGORIES;
      case "monitors": return MONITOR_CATEGORIES;
      case "accessories": return ACCESSORY_CATEGORIES;
      case "tablets": return TABLET_CATEGORIES;
      case "smartDevices": return SMARTDEVICE_CATEGORIES;
    }
  };

  const setCurrentCategory = (cat: any) => {
    switch (productType) {
      case "laptops": setLaptopCategory(cat); break;
      case "monitors": setMonitorCategory(cat); break;
      case "accessories": setAccessoryCategory(cat); break;
      case "tablets": setTabletCategory(cat); break;
      case "smartDevices": setSmartDeviceCategory(cat); break;
    }
  };

  // Mutations
  const createLaptopMutation = trpc.laptops.create.useMutation({
    onSuccess: () => {
      toast.success("Laptop added");
      setIsAddOpen(false);
      utils.laptops.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const createMonitorMutation = trpc.monitors.create.useMutation({
    onSuccess: () => {
      toast.success("Monitor added");
      setIsAddOpen(false);
      utils.monitors.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const createAccessoryMutation = trpc.accessories.create.useMutation({
    onSuccess: () => {
      toast.success("Accessory added");
      setIsAddOpen(false);
      utils.accessories.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const createTabletMutation = trpc.tablets.create.useMutation({
    onSuccess: () => {
      toast.success("Tablet added");
      setIsAddOpen(false);
      utils.tablets.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const createSmartDeviceMutation = trpc.smartDevices.create.useMutation({
    onSuccess: () => {
      toast.success("Smart device added");
      setIsAddOpen(false);
      utils.smartDevices.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const deleteLaptopMutation = trpc.laptops.delete.useMutation({
    onSuccess: () => {
      toast.success("Laptop deleted");
      setDeleteId(null);
      utils.laptops.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const deleteMonitorMutation = trpc.monitors.delete.useMutation({
    onSuccess: () => {
      toast.success("Monitor deleted");
      setDeleteId(null);
      utils.monitors.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const deleteAccessoryMutation = trpc.accessories.delete.useMutation({
    onSuccess: () => {
      toast.success("Accessory deleted");
      setDeleteId(null);
      utils.accessories.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const deleteTabletMutation = trpc.tablets.delete.useMutation({
    onSuccess: () => {
      toast.success("Tablet deleted");
      setDeleteId(null);
      utils.tablets.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const deleteSmartDeviceMutation = trpc.smartDevices.delete.useMutation({
    onSuccess: () => {
      toast.success("Smart device deleted");
      setDeleteId(null);
      utils.smartDevices.list.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed"),
  });

  const getDeleteMutation = () => {
    switch (productType) {
      case "laptops": return deleteLaptopMutation;
      case "monitors": return deleteMonitorMutation;
      case "accessories": return deleteAccessoryMutation;
      case "tablets": return deleteTabletMutation;
      case "smartDevices": return deleteSmartDeviceMutation;
    }
  };

  const getCreateMutation = () => {
    switch (productType) {
      case "laptops": return createLaptopMutation;
      case "monitors": return createMonitorMutation;
      case "accessories": return createAccessoryMutation;
      case "tablets": return createTabletMutation;
      case "smartDevices": return createSmartDeviceMutation;
    }
  };

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

  const currentItems = getCurrentItems();
  const currentLoading = getCurrentLoading();
  const currentCategoryList = getCurrentCategoryList();
  const currentCategory = getCurrentCategory();
  const createMutation = getCreateMutation();
  const deleteMutation = getDeleteMutation();

  const getProductTypeLabel = () => {
    switch (productType) {
      case "laptops": return "Ноутбуки";
      case "monitors": return "Монітори";
      case "accessories": return "Аксесуари";
      case "tablets": return "Планшети";
      case "smartDevices": return "Смарт девайси";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage your inventory</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["laptops", "monitors", "accessories", "tablets", "smartDevices"] as ProductType[]).map((type) => (
                <Button
                  key={type}
                  onClick={() => {
                    setProductType(type);
                    setIsAddOpen(false);
                  }}
                  variant={productType === type ? "default" : "outline"}
                  size="sm"
                >
                  {type === "laptops" && "Ноутбуки"}
                  {type === "monitors" && "Монітори"}
                  {type === "accessories" && "Аксесуари"}
                  {type === "tablets" && "Планшети"}
                  {type === "smartDevices" && "Смарт девайси"}
                </Button>
              ))}
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

      {/* Category Navigation - Show subcategories for selected product type */}
      {productType && (
        <nav className="border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-16 z-40">
          <div className="container">
            <div className="flex overflow-x-auto gap-1 py-3 -mx-4 px-4 md:mx-0 md:px-0">
              {currentCategoryList.map((cat) => (
                <Button
                  key={cat.value}
                  onClick={() => setCurrentCategory(cat.value)}
                  variant={currentCategory === cat.value ? "default" : "ghost"}
                  size="sm"
                  className="whitespace-nowrap text-sm"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="container py-8">
        {/* Add New Product Button */}
        <div className="mb-8">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4" />
                Add New {getProductTypeLabel()}
              </Button>
            </DialogTrigger>
            <DialogContent key={`add-${productType}`} className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New {getProductTypeLabel()}</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto pr-4">
                {productType === "laptops" && (
                  <LaptopForm
                    onSubmit={(data) => {
                      createMutation.mutate({
                        ...data,
                        category: laptopCategory,
                      } as any);
                    }}
                    isLoading={createMutation.isPending}
                  />
                )}
                {productType === "monitors" && (
                  <MonitorForm
                    selectedCategory={monitorCategory}
                    onSubmit={(data) => {
                      createMutation.mutate({
                        ...data,
                        category: monitorCategory,
                      });
                    }}
                    isLoading={createMutation.isPending}
                    onSuccess={() => setIsAddOpen(false)}
                  />
                )}
                {(productType === "accessories" || productType === "tablets" || productType === "smartDevices") && (
                  <div className="text-center py-8 text-muted-foreground">
                    Form for {getProductTypeLabel()} coming soon
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentCategoryList.find((c) => c.value === currentCategory)?.label} ({currentItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentLoading ? (
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
                      <TableHead>Price</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.price} zł</TableCell>
                        <TableCell>{item.condition}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" size="sm" disabled>
                            <Edit2 className="h-4 w-4" />
                          </Button>
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteId) {
                    deleteMutation.mutate({ id: deleteId });
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
