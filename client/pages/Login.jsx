import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Container,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (formData.email && formData.password) {
      localStorage.setItem("isAuthenticated", "true");
      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/products");
    } else {
      enqueueSnackbar("Please fill in all fields", { variant: "error" });
    }

    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              mx: "auto",
              mb: 2,
              bgcolor: "primary.main",
              width: 64,
              height: 64,
            }}
          >
            <InventoryIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h3" component="h1" gutterBottom color="white">
            InvenCare
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.9 }}>
            Sign in to your supermarket inventory system
          </Typography>
        </Box>

        <Card sx={{ p: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your credentials to access your account
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign in"
                )}
              </Button>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  Demo credentials: Use any email and password
                </Typography>
              </Alert>
            </Box>
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ mt: 3, color: "white", opacity: 0.7 }}
        >
          © 2024 InvenCare. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
