import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (isAuthenticated) {
      // Redirect to products page if already logged in (as per new navigation order)
      navigate("/products");
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress
          size={32}
          sx={{
            color: "primary.main",
            mb: 2,
          }}
        />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    </Box>
  );
};

export default Index;
