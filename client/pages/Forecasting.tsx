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
import { StatusBadge, CategoryBadge } from "@/components/ui/status-badges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calendar,
  ShoppingCart,
  Activity,
} from "lucide-react";

interface ForecastData {
  productName: string;
  productId: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  trend: "increasing" | "decreasing" | "stable";
  confidence: number;
  category: string;
  daysUntilStockout: number;
}

export default function Forecasting() {
  const navigate = useNavigate();
  const [forecastPeriod, setForecastPeriod] = useState("7");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load sample forecast data - In real app, this would be AWS Lambda API call to DynamoDB
    setForecastData([
      {
        productName: "Organic Bananas",
        productId: "ORG-BAN-001",
        currentStock: 120,
        predictedDemand: 85,
        recommendedOrder: 150,
        trend: "increasing",
        confidence: 87,
        category: "Fruits & Vegetables",
        daysUntilStockout: 14,
      },
      {
        productName: "Whole Milk",
        productId: "WHL-MLK-002",
        currentStock: 8,
        predictedDemand: 45,
        recommendedOrder: 80,
        trend: "stable",
        confidence: 92,
        category: "Dairy",
        daysUntilStockout: 2,
      },
      {
        productName: "Brown Bread",
        productId: "BRN-BRD-003",
        currentStock: 0,
        predictedDemand: 35,
        recommendedOrder: 60,
        trend: "increasing",
        confidence: 78,
        category: "Bakery",
        daysUntilStockout: 0,
      },
      {
        productName: "Jasmine Rice",
        productId: "JAS-RIC-004",
        currentStock: 45,
        predictedDemand: 25,
        recommendedOrder: 40,
        trend: "decreasing",
        confidence: 85,
        category: "Grains & Cereals",
        daysUntilStockout: 18,
      },
      {
        productName: "Fresh Chicken Breast",
        productId: "FCH-BRS-005",
        currentStock: 15,
        predictedDemand: 28,
        recommendedOrder: 50,
        trend: "increasing",
        confidence: 90,
        category: "Meat & Poultry",
        daysUntilStockout: 5,
      },
      {
        productName: "Greek Yogurt",
        productId: "GRK-YOG-006",
        currentStock: 6,
        predictedDemand: 22,
        recommendedOrder: 40,
        trend: "stable",
        confidence: 88,
        category: "Dairy",
        daysUntilStockout: 3,
      },
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getUrgencyBadge = (daysUntilStockout: number) => {
    if (daysUntilStockout === 0) {
      return <StatusBadge status="Out of Stock" />;
    } else if (daysUntilStockout <= 3) {
      return <StatusBadge status="Critical" />;
    } else if (daysUntilStockout <= 7) {
      return <StatusBadge status="Warning" />;
    } else {
      return <StatusBadge status="Normal" />;
    }
  };

  const filteredForecast = forecastData.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const categories = Array.from(
    new Set(forecastData.map((item) => item.category)),
  );

  const totalPredictedDemand = filteredForecast.reduce(
    (sum, item) => sum + item.predictedDemand,
    0,
  );
  const totalRecommendedOrder = filteredForecast.reduce(
    (sum, item) => sum + item.recommendedOrder,
    0,
  );
  const criticalItems = filteredForecast.filter(
    (item) => item.daysUntilStockout <= 3,
  ).length;
  const averageConfidence = Math.round(
    filteredForecast.reduce((sum, item) => sum + item.confidence, 0) /
      filteredForecast.length,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navigation onLogout={handleLogout} />

      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Demand Forecasting
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  AI-powered predictions for your grocery inventory needs
                </p>
              </div>
              <div className="flex gap-3">
                <Select
                  value={forecastPeriod}
                  onValueChange={setForecastPeriod}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Next 7 days</SelectItem>
                    <SelectItem value="14">Next 14 days</SelectItem>
                    <SelectItem value="30">Next 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
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
          </div>

          {/* Forecast Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <StatCard
              title="Predicted Demand"
              value={totalPredictedDemand}
              change={`Next ${forecastPeriod} days`}
              changeType="neutral"
              icon={Target}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0"
            />
            <StatCard
              title="Recommended Orders"
              value={totalRecommendedOrder}
              change="Units to order"
              changeType="positive"
              icon={ShoppingCart}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
            />
            <StatCard
              title="Critical Items"
              value={criticalItems}
              change="Need immediate attention"
              changeType="negative"
              icon={AlertTriangle}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0"
            />
            <StatCard
              title="Forecast Accuracy"
              value={`${averageConfidence}%`}
              change="Model confidence"
              changeType="positive"
              icon={Activity}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0"
            />
          </div>

          {/* Forecast Table */}
          <div className="grid gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Demand Forecast ({filteredForecast.length} products)
                    </CardTitle>
                    <CardDescription>
                      Predictive analytics for inventory planning and
                      procurement
                    </CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredForecast.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {item.productName}
                          </h3>
                          {getTrendIcon(item.trend)}
                          {getUrgencyBadge(item.daysUntilStockout)}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="font-mono">{item.productId}</span>
                          <CategoryBadge category={item.category} />
                          <span>Confidence: {item.confidence}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-6 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {item.currentStock}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Current Stock
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {item.predictedDemand}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Predicted Demand
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {item.recommendedOrder}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Recommended Order
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {item.daysUntilStockout}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Days Until Stockout
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights & Recommendations */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-blue-700">
                    📈 Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">High Demand Categories</p>
                      <p className="text-sm text-muted-foreground">
                        Dairy and Fresh Produce showing 15% increase
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Seasonal Trends</p>
                      <p className="text-sm text-muted-foreground">
                        Weekend spikes expected for bakery items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Critical Stock Levels</p>
                      <p className="text-sm text-muted-foreground">
                        3 items need immediate restocking
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-green-700">
                    💡 Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Order Priority</p>
                      <p className="text-sm text-muted-foreground">
                        Place urgent orders for dairy products today
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Supplier Diversification</p>
                      <p className="text-sm text-muted-foreground">
                        Consider backup suppliers for high-demand items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Price Optimization</p>
                      <p className="text-sm text-muted-foreground">
                        Review pricing for slow-moving items
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
