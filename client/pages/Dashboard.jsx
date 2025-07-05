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

// AWS Cognito and Lambda Integration
// import { getCurrentUser, signOut } from 'aws-amplify/auth';
// import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthentication();
    fetchDashboardData();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const checkAuthentication = async () => {
    try {
      // AWS Cognito Authentication Check
      // const currentUser = await getCurrentUser();
      // setUser(currentUser);

      // Demo authentication check (remove when implementing Cognito)
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      // Demo user data (remove when implementing Cognito)
      setUser({
        username: "demo@invencare.com",
        attributes: {
          given_name: "Demo",
          family_name: "User",
          "custom:role": "manager",
          "custom:store_id": "store_001",
        },
      });
    } catch (error) {
      console.log("Authentication check failed:", error);
      navigate("/login");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // AWS Lambda Analytics Function Invocation
      // const lambdaClient = new LambdaClient({
      //   region: process.env.REACT_APP_AWS_REGION || 'us-east-1'
      // });
      //
      // const lambdaParams = {
      //   FunctionName: process.env.REACT_APP_LAMBDA_ANALYTICS_FUNCTION,
      //   InvocationType: 'RequestResponse',
      //   Payload: JSON.stringify({
      //     action: 'getDashboardAnalytics',
      //     storeId: user?.attributes?.['custom:store_id'] || 'default',
      //     timeframe: '30days'
      //   })
      // };
      //
      // const command = new InvokeCommand(lambdaParams);
      // const response = await lambdaClient.send(command);
      // const responsePayload = JSON.parse(
      //   new TextDecoder().decode(response.Payload)
      // );
      // setAnalyticsData(responsePayload);

      // Demo API call (remove when implementing Lambda)
      const response = await fetch("/api/demo?action=getDashboardAnalytics");
      const data = await response.json();
      setAnalyticsData(data.analytics);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Set fallback data
      setAnalyticsData({
        totalProducts: 0,
        lowStockItems: 0,
        topSellingCategories: [],
        revenueThisMonth: 0,
        inventoryTurnover: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // AWS Cognito Sign Out
      // await signOut();

      // Demo logout (remove when implementing Cognito)
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout on error
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Products",
      value: analyticsData?.totalProducts?.toLocaleString() || "0",
      description: "Items in inventory",
      icon: Package,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Revenue (Month)",
      value: `$${analyticsData?.revenueThisMonth?.toLocaleString() || "0"}`,
      description: "Total sales this month",
      icon: DollarSign,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Low Stock Items",
      value: analyticsData?.lowStockItems?.toString() || "0",
      description: "Items below minimum",
      icon: AlertTriangle,
      trend: "-3",
      trendUp: false,
    },
    {
      title: "Inventory Turnover",
      value: analyticsData?.inventoryTurnover?.toFixed(1) || "0.0",
      description: "Times per year",
      icon: TrendingUp,
      trend: "+0.3",
      trendUp: true,
    },
  ];

  const lowStockItems = [
    { name: "Organic Bananas", current: 5, minimum: 10, category: "Produce" },
    { name: "Whole Milk Gallon", current: 3, minimum: 5, category: "Dairy" },
    { name: "Coca Cola 12pk", current: 2, minimum: 5, category: "Beverages" },
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      type: "Sale",
      product: "Lay's Potato Chips",
      quantity: 15,
      amount: 74.85,
      time: "2 hours ago",
    },
    {
      id: "TXN-002",
      type: "Restock",
      product: "Wonder Bread",
      quantity: 24,
      amount: 59.76,
      time: "4 hours ago",
    },
    {
      id: "TXN-003",
      type: "Sale",
      product: "Organic Bananas",
      quantity: 8,
      amount: 15.92,
      time: "6 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation onLogout={handleLogout} />

      <div className="lg:pl-64">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.attributes?.given_name || "User"}!
              </h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                •{" "}
                {currentTime.toLocaleTimeString("en-US", {
                  timeStyle: "short",
                })}
              </p>
              {user?.attributes?.["custom:store_id"] && (
                <Badge variant="secondary" className="mt-2">
                  Store: {user.attributes["custom:store_id"]}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate("/products")}>
                <Eye className="h-4 w-4 mr-2" />
                View Inventory
              </Button>
              <Button onClick={() => navigate("/products?action=add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Low Stock Alert */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Low Stock Alert</CardTitle>
                  <CardDescription>
                    Items that need immediate attention
                  </CardDescription>
                </div>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockItems.length > 0 ? (
                    lowStockItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-destructive">
                            {item.current} / {item.minimum}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            current / minimum
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      All items are well stocked! 🎉
                    </p>
                  )}
                </div>
                {lowStockItems.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate("/products?filter=lowstock")}
                  >
                    View All Low Stock Items
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Latest inventory transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{transaction.product}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type} • {transaction.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {transaction.type === "Sale" ? "-" : "+"}
                          {transaction.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/transactions")}
                >
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">
                  Top Selling Categories
                </CardTitle>
                <CardDescription>
                  Best performing product categories this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analyticsData?.topSellingCategories?.map(
                    (category, index) => (
                      <div
                        key={index}
                        className="p-4 bg-muted/50 rounded-lg text-center"
                      >
                        <p className="font-semibold text-lg">{category.name}</p>
                        <p className="text-2xl font-bold text-primary">
                          {category.sales}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          units sold
                        </p>
                      </div>
                    ),
                  ) || (
                    <div className="col-span-3 text-center text-muted-foreground py-8">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Analytics data will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
