import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  ErrorOutline as ErrorIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ textAlign: "center", p: 4 }}>
          <CardContent>
            <Avatar
              sx={{
                mx: "auto",
                mb: 3,
                bgcolor: "error.main",
                width: 80,
                height: 80,
              }}
            >
              <ErrorIcon sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography variant="h3" component="h1" gutterBottom>
              404
            </Typography>

            <Typography variant="h5" component="h2" gutterBottom>
              Page Not Found
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
            >
              Sorry, the page you are looking for doesn't exist or has been
              moved. Please check the URL or return to the homepage.
            </Typography>

            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              }}
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default NotFound;
