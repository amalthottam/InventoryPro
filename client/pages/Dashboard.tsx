import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { StatCard } from "@/components/ui/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badges";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Plus,
  Eye,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Products",
      value: "1,347",
      change: "+18% from last month",
      changeType: "positive" as const,
      icon: Package,
    },
    {
      title: "Daily Sales",
      value: "$12,859",
      change: "+12% from yesterday",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Low Stock Items",
      value: "8",
      change: "3 critical",
      changeType: "negative" as const,
      icon: AlertTriangle,
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      change: "Above target",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  const recentProducts = [
    {
      id: 1,
      name: "Organic Bananas",
      sku: "ORG-BAN-001",
      stock: 120,
      status: "In Stock",
      category: "Fruits & Vegetables",
    },
    {
      id: 2,
      name: "Whole Milk",
      sku: "WHL-MLK-002",
      stock: 8,
      status: "Low Stock",
      category: "Dairy",
    },
    {
      id: 3,
      name: "Brown Bread",
      sku: "BRN-BRD-003",
      stock: 0,
      status: "Out of Stock",
      category: "Bakery",
    },
    {
      id: 4,
      name: "Fresh Chicken Breast",
      sku: "FCH-BRS-005",
      stock: 15,
      status: "In Stock",
      category: "Meat & Poultry",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation onLogout={handleLogout} />

      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    InvenCare Dashboard
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your supermarket
                  inventory.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Recent Products */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Products</CardTitle>
                  <CardDescription>
                    Latest items added to your inventory
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/products")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku} • Stock: {product.stock}
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={product.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to manage your inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start h-12"
                  onClick={() => navigate("/products")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12"
                  onClick={() => navigate("/products")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manage Inventory
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12"
                  onClick={() => navigate("/products")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Check Low Stock
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
