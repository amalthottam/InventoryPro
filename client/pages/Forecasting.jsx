import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Target as TargetIcon,
  ShoppingCart as ShoppingCartIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon,
  Lightbulb as LightbulbIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import Navigation from "../components/Navigation";

const Forecasting = () => {
  const navigate = useNavigate();
  const [forecastPeriod, setForecastPeriod] = useState("7");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load sample forecast data
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
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "increasing":
        return <TrendingUpIcon sx={{ color: "success.main" }} />;
      case "decreasing":
        return <TrendingDownIcon sx={{ color: "error.main" }} />;
      default:
        return <TimelineIcon sx={{ color: "primary.main" }} />;
    }
  };

  const getUrgencyColor = (daysUntilStockout) => {
    if (daysUntilStockout === 0) return "error";
    if (daysUntilStockout <= 3) return "error";
    if (daysUntilStockout <= 7) return "warning";
    return "success";
  };

  const getUrgencyLabel = (daysUntilStockout) => {
    if (daysUntilStockout === 0) return "Out of Stock";
    if (daysUntilStockout <= 3) return "Critical";
    if (daysUntilStockout <= 7) return "Warning";
    return "Normal";
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

  const stats = [
    {
      title: "Predicted Demand",
      value: totalPredictedDemand,
      subtitle: `Next ${forecastPeriod} days`,
      icon: TargetIcon,
      color: "linear-gradient(45deg, #2196F3 30%, #00BCD4 90%)",
    },
    {
      title: "Recommended Orders",
      value: totalRecommendedOrder,
      subtitle: "Units to order",
      icon: ShoppingCartIcon,
      color: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
    },
    {
      title: "Critical Items",
      value: criticalItems,
      subtitle: "Need immediate attention",
      icon: WarningIcon,
      color: "linear-gradient(45deg, #F44336 30%, #E91E63 90%)",
    },
    {
      title: "Forecast Accuracy",
      value: `${averageConfidence}%`,
      subtitle: "Model confidence",
      icon: AssessmentIcon,
      color: "linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)",
    },
  ];

  const insights = [
    {
      title: "High Demand Categories",
      description: "Dairy and Fresh Produce showing 15% increase",
      color: "success.main",
    },
    {
      title: "Seasonal Trends",
      description: "Weekend spikes expected for bakery items",
      color: "warning.main",
    },
    {
      title: "Critical Stock Levels",
      description: "3 items need immediate restocking",
      color: "error.main",
    },
  ];

  const recommendations = [
    {
      title: "Order Priority",
      description: "Place urgent orders for dairy products today",
      color: "success.main",
    },
    {
      title: "Supplier Diversification",
      description: "Consider backup suppliers for high-demand items",
      color: "primary.main",
    },
    {
      title: "Price Optimization",
      description: "Review pricing for slow-moving items",
      color: "secondary.main",
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
                background: "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
              }}
            >
              <TrendingUpIcon />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                background: "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Demand Forecasting
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              AI-powered predictions for your grocery inventory needs
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={forecastPeriod}
                  onChange={(e) => setForecastPeriod(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="7">Next 7 days</MenuItem>
                  <MenuItem value="14">Next 14 days</MenuItem>
                  <MenuItem value="30">Next 30 days</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
                      {stat.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Forecast Data */}
        <Card sx={{ mb: 3 }}>
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
                  Demand Forecast ({filteredForecast.length} products)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Predictive analytics for inventory planning and procurement
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
                }}
              >
                Export Report
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              {filteredForecast.map((item) => (
                <Card
                  key={item.productId}
                  variant="outlined"
                  sx={{ mb: 2, "&:hover": { boxShadow: 2 } }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6">
                            {item.productName}
                          </Typography>
                          {getTrendIcon(item.trend)}
                          <Chip
                            label={getUrgencyLabel(item.daysUntilStockout)}
                            color={getUrgencyColor(item.daysUntilStockout)}
                            size="small"
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontFamily: "monospace" }}
                          >
                            {item.productId}
                          </Typography>
                          <Chip
                            label={item.category}
                            variant="outlined"
                            size="small"
                          />
                          <Typography variant="caption">
                            Confidence: {item.confidence}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.confidence}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            color="primary.main"
                            fontWeight="bold"
                          >
                            {item.currentStock}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Current Stock
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            color="secondary.main"
                            fontWeight="bold"
                          >
                            {item.predictedDemand}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Predicted Demand
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            color="success.main"
                            fontWeight="bold"
                          >
                            {item.recommendedOrder}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Recommended Order
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            color="warning.main"
                            fontWeight="bold"
                          >
                            {item.daysUntilStockout}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Days Until Stockout
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Insights and Recommendations */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <AnalyticsIcon color="primary" />
                  <Typography variant="h6">Key Insights</Typography>
                </Box>
                {insights.map((insight, index) => (
                  <Alert
                    key={index}
                    severity="info"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    <AlertTitle>{insight.title}</AlertTitle>
                    {insight.description}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <LightbulbIcon color="secondary" />
                  <Typography variant="h6">Recommendations</Typography>
                </Box>
                {recommendations.map((rec, index) => (
                  <Alert
                    key={index}
                    severity="success"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    <AlertTitle>{rec.title}</AlertTitle>
                    {rec.description}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Forecasting;
