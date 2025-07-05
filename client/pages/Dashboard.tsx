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
      value: "1,247",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Package,
    },
    {
      title: "Total Revenue",
      value: "$54,239",
      change: "+8% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "5 critical",
      changeType: "negative" as const,
      icon: AlertTriangle,
    },
    {
      title: "Growth Rate",
      value: "+15.3%",
      change: "Above target",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  const recentProducts = [
    {
      id: 1,
      name: "MacBook Pro 16-inch",
      sku: "MBP-16-2023",
      stock: 45,
      status: "In Stock",
      category: "Electronics",
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      sku: "IPH-15-PRO",
      stock: 12,
      status: "Low Stock",
      category: "Electronics",
    },
    {
      id: 3,
      name: "Dell Monitor 27-inch",
      sku: "DEL-MON-27",
      stock: 0,
      status: "Out of Stock",
      category: "Electronics",
    },
    {
      id: 4,
      name: "Wireless Mouse",
      sku: "WMS-2023",
      stock: 156,
      status: "In Stock",
      category: "Accessories",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      "In Stock": "default",
      "Low Stock": "secondary",
      "Out of Stock": "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onLogout={handleLogout} />

      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your inventory.
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
                        {getStatusBadge(product.status)}
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
