import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Menu,
  Avatar,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ShoppingCart as ShoppingCartIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import Navigation from "../components/Navigation";

const Products = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productId: "",
    category: "",
    stock: "",
    brand: "",
    unit: "",
  });

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load sample grocery products
    setProducts([
      {
        id: "1",
        productName: "Organic Bananas",
        productId: "ORG-BAN-001",
        category: "Fruits & Vegetables",
        stock: 120,
        brand: "Fresh Farm",
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
        brand: "Pure Dairy",
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
        brand: "Baker's Best",
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
        brand: "Golden Harvest",
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
        brand: "Farm Fresh",
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

  const getStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return "Available";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "success";
      case "Low Stock":
        return "warning";
      case "Out of Stock":
        return "error";
      default:
        return "default";
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      productName: formData.productName,
      productId: formData.productId,
      category: formData.category,
      stock: parseInt(formData.stock),
      brand: formData.brand,
      unit: formData.unit,
      status: getStatus(parseInt(formData.stock)),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setProducts([...products, newProduct]);
    setFormData({
      productName: "",
      productId: "",
      category: "",
      stock: "",
      brand: "",
      unit: "",
    });
    setIsAddDialogOpen(false);
    enqueueSnackbar("Product added successfully!", { variant: "success" });
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProduct = {
      ...editingProduct,
      productName: formData.productName,
      productId: formData.productId,
      category: formData.category,
      stock: parseInt(formData.stock),
      brand: formData.brand,
      unit: formData.unit,
      status: getStatus(parseInt(formData.stock)),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setProducts(
      products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)),
    );
    setFormData({
      productName: "",
      productId: "",
      category: "",
      stock: "",
      brand: "",
      unit: "",
    });
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    enqueueSnackbar("Product updated successfully!", { variant: "success" });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    setMenuAnchor(null);
    enqueueSnackbar("Product deleted successfully!", { variant: "success" });
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productId: product.productId,
      category: product.category,
      stock: product.stock.toString(),
      brand: product.brand,
      unit: product.unit,
    });
    setIsEditDialogOpen(true);
    setMenuAnchor(null);
  };

  const columns = [
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "productId",
      headerName: "Product ID",
      width: 140,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", color: "primary.main" }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} variant="outlined" size="small" />
      ),
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 130,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 80,
      type: "number",
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 80,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "lastUpdated",
      headerName: "Last Updated",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
            setMenuAnchor(e.currentTarget);
            setSelectedProduct(params.row);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  const ProductForm = ({ onSubmit, isEdit = false }) => (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
            placeholder="e.g., Organic Bananas"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Product ID"
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
            }
            placeholder="e.g., ORG-BAN-001"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              label="Category"
            >
              <MenuItem value="Fruits & Vegetables">
                Fruits & Vegetables
              </MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Bakery">Bakery</MenuItem>
              <MenuItem value="Meat & Poultry">Meat & Poultry</MenuItem>
              <MenuItem value="Seafood">Seafood</MenuItem>
              <MenuItem value="Grains & Cereals">Grains & Cereals</MenuItem>
              <MenuItem value="Cooking Essentials">Cooking Essentials</MenuItem>
              <MenuItem value="Beverages">Beverages</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            placeholder="e.g., Fresh Farm"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Stock Quantity"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Unit</InputLabel>
            <Select
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              label="Unit"
            >
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="liter">liter</MenuItem>
              <MenuItem value="piece">piece</MenuItem>
              <MenuItem value="bottle">bottle</MenuItem>
              <MenuItem value="can">can</MenuItem>
              <MenuItem value="pack">pack</MenuItem>
              <MenuItem value="box">box</MenuItem>
              <MenuItem value="loaf">loaf</MenuItem>
              <MenuItem value="cup">cup</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

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
                background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
              }}
            >
              <ShoppingCartIcon />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Grocery Products
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage your supermarket inventory and product catalog
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
              }}
            >
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {
                    filteredProducts.filter((p) => p.status === "Available")
                      .length
                  }
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                >
                  Available Products
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: "linear-gradient(45deg, #FF9800 30%, #FFC107 90%)",
              }}
            >
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {
                    filteredProducts.filter((p) => p.status === "Low Stock")
                      .length
                  }
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                >
                  Low Stock Items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: "linear-gradient(45deg, #F44336 30%, #E91E63 90%)",
              }}
            >
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {
                    filteredProducts.filter((p) => p.status === "Out of Stock")
                      .length
                  }
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                >
                  Out of Stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
              }}
            >
              <CardContent>
                <Typography variant="h4" color="white" fontWeight="bold">
                  {filteredProducts.length}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                >
                  Total Products
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Add Button */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                <TextField
                  placeholder="Search products, brands, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                    startAdornment={<FilterIcon sx={{ mr: 1 }} />}
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
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
                sx={{
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                  whiteSpace: "nowrap",
                }}
              >
                Add Product
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Product Inventory ({filteredProducts.length} items)
            </Typography>
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={filteredProducts}
                columns={columns}
                pageSize={25}
                rowsPerPageOptions={[25, 50, 100]}
                disableSelectionOnClick
                sx={{
                  "& .MuiDataGrid-cell:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Add Product Dialog */}
        <Dialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the details for the new grocery item.
            </Typography>
            <ProductForm onSubmit={handleAddProduct} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct} variant="contained">
              Add Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Update the product details.
            </Typography>
            <ProductForm onSubmit={handleEditProduct} isEdit />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct} variant="contained">
              Update Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Actions Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => openEditDialog(selectedProduct)}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => handleDeleteProduct(selectedProduct?.id)}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default Products;
