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
  ShoppingCart,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

const products = [
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
];

export default function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.storeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter]);

  const categories = [...new Set(products.map((p) => p.category))];

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
                Manage your supermarket inventory and track stock levels
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/dashboard")}>
                <Eye className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
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
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {filteredProducts.length}
                </div>
                <div className="text-blue-100">Total Products</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, store names, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products Inventory</CardTitle>
              <CardDescription>
                Complete list of products in your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">
                        Product Name
                      </th>
                      <th className="text-left p-4 font-semibold">
                        Product ID
                      </th>
                      <th className="text-left p-4 font-semibold">Category</th>
                      <th className="text-left p-4 font-semibold">
                        Store Name
                      </th>
                      <th className="text-left p-4 font-semibold">Stock</th>
                      <th className="text-left p-4 font-semibold">Unit</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-slate-50/50"
                      >
                        <td className="p-4 font-medium">
                          {product.productName}
                        </td>
                        <td className="p-4 font-mono text-sm text-blue-600">
                          {product.productId}
                        </td>
                        <td className="p-4">
                          <CategoryBadge category={product.category} />
                        </td>
                        <td className="p-4">{product.storeName}</td>
                        <td className="p-4 font-semibold">{product.stock}</td>
                        <td className="p-4">{product.unit}</td>
                        <td className="p-4">
                          <StatusBadge status={product.status} />
                        </td>
                        <td className="p-4">{product.lastUpdated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
