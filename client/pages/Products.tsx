import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, CategoryBadge } from "@/components/ui/status-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  MoreHorizontal,
  ShoppingCart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  productName: string;
  productId: string;
  category: string;
  stock: number;
  storeName: string;
  unit: string;
  status: "Available" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addFormData, setAddFormData] = useState({
    productName: "",
    productId: "",
    category: "",
    stock: "",
    storeName: "",
    unit: "",
  });
  const [editFormData, setEditFormData] = useState({
    productName: "",
    productId: "",
    category: "",
    stock: "",
    storeName: "",
    unit: "",
  });

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load sample grocery products - In real app, this would be AWS Lambda API call
    setProducts([
      {
        id: "1",
        productName: "Organic Bananas",
        productId: "ORG-BAN-001",
        category: "Fruits & Vegetables",
        stock: 120,
        storeName: "Fresh Farm",
        unit: "kg",
        status: "Available",
        lastUpdated: "2024-01-15",
      },
      {
        id: "2",
        productName: "Whole Milk",
        productId: "WHL-MLK-002",
        category: "Dairy",
        stock: 8,
        storeName: "Pure Dairy",
        unit: "liter",
        status: "Low Stock",
        lastUpdated: "2024-01-14",
      },
      {
        id: "3",
        productName: "Brown Bread",
        productId: "BRN-BRD-003",
        category: "Bakery",
        stock: 0,
        storeName: "Baker's Best",
        unit: "loaf",
        status: "Out of Stock",
        lastUpdated: "2024-01-13",
      },
      {
        id: "4",
        productName: "Jasmine Rice",
        productId: "JAS-RIC-004",
        category: "Grains & Cereals",
        stock: 45,
        storeName: "Golden Harvest",
        unit: "kg",
        status: "Available",
        lastUpdated: "2024-01-15",
      },
      {
        id: "5",
        productName: "Fresh Chicken Breast",
        productId: "FCH-BRS-005",
        category: "Meat & Poultry",
        stock: 15,
        storeName: "Farm Fresh",
        unit: "kg",
        status: "Available",
        lastUpdated: "2024-01-15",
      },
      {
        id: "6",
        productName: "Greek Yogurt",
        productId: "GRK-YOG-006",
        category: "Dairy",
        stock: 6,
        storeName: "Mediterranean",
        unit: "cup",
        status: "Low Stock",
        lastUpdated: "2024-01-14",
      },
      {
        id: "7",
        productName: "Extra Virgin Olive Oil",
        productId: "EVO-OIL-007",
        category: "Cooking Essentials",
        stock: 32,
        storeName: "Olive Grove",
        unit: "bottle",
        status: "Available",
        lastUpdated: "2024-01-15",
      },
      {
        id: "8",
        productName: "Fresh Salmon Fillet",
        productId: "FSH-SAL-008",
        category: "Seafood",
        stock: 12,
        storeName: "Ocean Fresh",
        unit: "kg",
        status: "Available",
        lastUpdated: "2024-01-15",
      },
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const getStatus = (stock: number): Product["status"] => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "Available";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      productName: addFormData.productName,
      productId: addFormData.productId,
      category: addFormData.category,
      stock: parseInt(addFormData.stock),
      storeName: addFormData.storeName,
      unit: addFormData.unit,
      status: getStatus(parseInt(addFormData.stock)),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setProducts([...products, newProduct]);
    setAddFormData({
      productName: "",
      productId: "",
      category: "",
      stock: "",
      storeName: "",
      unit: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      productName: editFormData.productName,
      productId: editFormData.productId,
      category: editFormData.category,
      stock: parseInt(editFormData.stock),
      storeName: editFormData.storeName,
      unit: editFormData.unit,
      status: getStatus(parseInt(editFormData.stock)),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setProducts(
      products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)),
    );
    setEditFormData({
      productName: "",
      productId: "",
      category: "",
      stock: "",
      storeName: "",
      unit: "",
    });
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      productName: product.productName,
      productId: product.productId,
      category: product.category,
      stock: product.stock.toString(),
      storeName: product.storeName,
      unit: product.unit,
    });
    setIsEditDialogOpen(true);
  };

  const ProductForm = ({
    onSubmit,
    isEdit = false,
    formData,
    setFormData,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
    formData: {
      productName: string;
      productId: string;
      category: string;
      stock: string;
      storeName: string;
      unit: string;
    };
    setFormData: React.Dispatch<
      React.SetStateAction<{
        productName: string;
        productId: string;
        category: string;
        stock: string;
        storeName: string;
        unit: string;
      }>
    >;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
            placeholder="e.g., Organic Bananas"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productId">Product ID</Label>
          <Input
            id="productId"
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
            }
            placeholder="e.g., ORG-BAN-001"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fruits & Vegetables">
                Fruits & Vegetables
              </SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Bakery">Bakery</SelectItem>
              <SelectItem value="Meat & Poultry">Meat & Poultry</SelectItem>
              <SelectItem value="Seafood">Seafood</SelectItem>
              <SelectItem value="Grains & Cereals">Grains & Cereals</SelectItem>
              <SelectItem value="Cooking Essentials">
                Cooking Essentials
              </SelectItem>
              <SelectItem value="Beverages">Beverages</SelectItem>
              <SelectItem value="Snacks">Snacks</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            id="storeName"
            value={formData.storeName}
            onChange={(e) =>
              setFormData({ ...formData, storeName: e.target.value })
            }
            placeholder="e.g., Fresh Farm"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) => setFormData({ ...formData, unit: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="liter">liter</SelectItem>
              <SelectItem value="piece">piece</SelectItem>
              <SelectItem value="bottle">bottle</SelectItem>
              <SelectItem value="can">can</SelectItem>
              <SelectItem value="pack">pack</SelectItem>
              <SelectItem value="box">box</SelectItem>
              <SelectItem value="loaf">loaf</SelectItem>
              <SelectItem value="cup">cup</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setEditFormData({
                productName: "",
                productId: "",
                category: "",
                stock: "",
                storeName: "",
                unit: "",
              });
            } else {
              setIsAddDialogOpen(false);
              setAddFormData({
                productName: "",
                productId: "",
                category: "",
                stock: "",
                storeName: "",
                unit: "",
              });
            }
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation onLogout={handleLogout} />

      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Grocery Products
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage your supermarket inventory and product catalog
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new grocery item.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm
                  onSubmit={handleAddProduct}
                  formData={addFormData}
                  setFormData={setAddFormData}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {
                    filteredProducts.filter((p) => p.status === "Available")
                      .length
                  }
                </div>
                <div className="text-green-100">Available Products</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {
                    filteredProducts.filter((p) => p.status === "Low Stock")
                      .length
                  }
                </div>
                <div className="text-yellow-100">Low Stock Items</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {
                    filteredProducts.filter((p) => p.status === "Out of Stock")
                      .length
                  }
                </div>
                <div className="text-red-100">Out of Stock</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {filteredProducts.length}
                </div>
                <div className="text-blue-100">Total Products</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products, store names, or IDs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>
                Product Inventory ({filteredProducts.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <TableHead className="font-semibold">
                        Product Name
                      </TableHead>
                      <TableHead className="font-semibold">
                        Product ID
                      </TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">
                        Store Name
                      </TableHead>
                      <TableHead className="font-semibold">Stock</TableHead>
                      <TableHead className="font-semibold">Unit</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">
                        Last Updated
                      </TableHead>
                      <TableHead className="w-[70px] font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="hover:bg-slate-50/50"
                      >
                        <TableCell className="font-medium">
                          {product.productName}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-blue-600">
                          {product.productId}
                        </TableCell>
                        <TableCell>
                          <CategoryBadge category={product.category} />
                        </TableCell>
                        <TableCell>{product.storeName}</TableCell>
                        <TableCell className="font-semibold">
                          {product.stock}
                        </TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>
                          <StatusBadge status={product.status} />
                        </TableCell>
                        <TableCell>{product.lastUpdated}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openEditDialog(product)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Update the product details.
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                onSubmit={handleEditProduct}
                isEdit
                formData={editFormData}
                setFormData={setEditFormData}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
