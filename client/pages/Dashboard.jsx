import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import Navigation from "../components/Navigation";

const Dashboard = () => {
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
      changeType: "positive",
      icon: InventoryIcon,
      color: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
    },
    {
      title: "Daily Sales",
      value: "$12,859",
      change: "+12% from yesterday",
      changeType: "positive",
      icon: MoneyIcon,
      color: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    },
    {
      title: "Low Stock Items",
      value: "8",
      change: "3 critical",
      changeType: "negative",
      icon: WarningIcon,
      color: "linear-gradient(45deg, #FF9800 30%, #FFC107 90%)",
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5",
      change: "Above target",
      changeType: "positive",
      icon: TrendingUpIcon,
      color: "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "success";
      case "Low Stock":
        return "warning";
      case "Out of Stock":
        return "error";
      default:
        return "default";
    }
  };

  const quickActions = [
    {
      title: "Add New Product",
      description: "Add items to your inventory",
      icon: AddIcon,
      action: () => navigate("/products"),
      color: "primary",
    },
    {
      title: "Manage Inventory",
      description: "View and edit product details",
      icon: InventoryIcon,
      action: () => navigate("/products"),
      color: "secondary",
    },
    {
      title: "Check Low Stock",
      description: "Review items needing restock",
      icon: WarningIcon,
      action: () => navigate("/products"),
      color: "warning",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Navigation onLogout={handleLogout} />

      <Container
        maxWidth={false}
        sx={{
          ml: { lg: "280px" },
          mt: { xs: 8, lg: 0 },
          p: 3,
          flex: 1,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                background: "linear-gradient(45deg, #4CAF50 30%, #2196F3 90%)",
              }}
            >
              <InventoryIcon />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                background: "linear-gradient(45deg, #4CAF50 30%, #2196F3 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              InvenCare Dashboard
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your supermarket
              inventory.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: {currentTime.toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ background: stat.color, color: "white" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        {stat.title}
                      </Typography>
                      <Icon sx={{ color: "rgba(255,255,255,0.8)" }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {stat.change}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Recent Products and Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Recent Products
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Latest items added to your inventory
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate("/products")}
                  >
                    View All
                  </Button>
                </Box>

                <List>
                  {recentProducts.map((product, index) => (
                    <React.Fragment key={product.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            <ShoppingCartIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={product.name}
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ fontFamily: "monospace" }}
                              >
                                SKU: {product.sku}
                              </Typography>
                              <Typography variant="caption">•</Typography>
                              <Typography variant="caption">
                                Stock: {product.stock}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip
                          label={product.status}
                          color={getStatusColor(product.status)}
                          size="small"
                        />
                      </ListItem>
                      {index < recentProducts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Common tasks to manage your inventory
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outlined"
                        startIcon={<Icon />}
                        onClick={action.action}
                        sx={{
                          justifyContent: "flex-start",
                          textAlign: "left",
                          py: 2,
                          px: 3,
                          flexDirection: "column",
                          alignItems: "flex-start",
                          height: "auto",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {action.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {action.description}
                        </Typography>
                      </Button>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
