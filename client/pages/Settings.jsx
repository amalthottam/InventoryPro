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
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  IconButton,
  Menu,
  Avatar,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Database as DatabaseIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import Navigation from "../components/Navigation";

const Settings = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [systemSettings, setSystemSettings] = useState({
    autoReorder: true,
    lowStockThreshold: 10,
    notificationEmails: true,
    backupFrequency: "daily",
    sessionTimeout: 30,
    twoFactorAuth: false,
    auditLogging: true,
    priceAlerts: true,
  });
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load sample users
    setUsers([
      {
        id: "1",
        name: "John Anderson",
        email: "john.anderson@invencare.com",
        role: "Super Admin",
        status: "Active",
        lastLogin: "2024-01-15 09:30",
        department: "IT",
        joinDate: "2023-01-15",
      },
      {
        id: "2",
        name: "Sarah Martinez",
        email: "sarah.martinez@invencare.com",
        role: "Admin",
        status: "Active",
        lastLogin: "2024-01-15 08:45",
        department: "Operations",
        joinDate: "2023-03-10",
      },
      {
        id: "3",
        name: "Michael Chen",
        email: "michael.chen@invencare.com",
        role: "Manager",
        status: "Active",
        lastLogin: "2024-01-14 16:20",
        department: "Warehouse",
        joinDate: "2023-06-20",
      },
      {
        id: "4",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@invencare.com",
        role: "Staff",
        status: "Inactive",
        lastLogin: "2024-01-10 14:15",
        department: "Store",
        joinDate: "2023-08-05",
      },
      {
        id: "5",
        name: "David Wilson",
        email: "david.wilson@invencare.com",
        role: "Manager",
        status: "Pending",
        lastLogin: "Never",
        department: "Purchasing",
        joinDate: "2024-01-14",
      },
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Super Admin":
        return "error";
      case "Admin":
        return "primary";
      case "Manager":
        return "secondary";
      case "Staff":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircleIcon sx={{ color: "success.main", fontSize: 16 }} />;
      case "Inactive":
        return <CancelIcon sx={{ color: "error.main", fontSize: 16 }} />;
      case "Pending":
        return <ScheduleIcon sx={{ color: "warning.main", fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: userFormData.name,
      email: userFormData.email,
      role: userFormData.role,
      status: "Pending",
      lastLogin: "Never",
      department: userFormData.department,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUser]);
    setUserFormData({ name: "", email: "", role: "", department: "" });
    setIsAddUserDialogOpen(false);
    enqueueSnackbar("User added successfully!", { variant: "success" });
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      name: userFormData.name,
      email: userFormData.email,
      role: userFormData.role,
      department: userFormData.department,
    };

    setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
    setUserFormData({ name: "", email: "", role: "", department: "" });
    setIsEditUserDialogOpen(false);
    setEditingUser(null);
    setMenuAnchor(null);
    enqueueSnackbar("User updated successfully!", { variant: "success" });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    setMenuAnchor(null);
    enqueueSnackbar("User deleted successfully!", { variant: "success" });
  };

  const openEditDialog = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
    setIsEditUserDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleSettingChange = (key, value) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    enqueueSnackbar("Setting updated successfully!", { variant: "success" });
  };

  const UserForm = ({ onSubmit, isEdit = false }) => (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={userFormData.name}
            onChange={(e) =>
              setUserFormData({ ...userFormData, name: e.target.value })
            }
            placeholder="John Doe"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={userFormData.email}
            onChange={(e) =>
              setUserFormData({ ...userFormData, email: e.target.value })
            }
            placeholder="john.doe@invencare.com"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              value={userFormData.role}
              onChange={(e) =>
                setUserFormData({ ...userFormData, role: e.target.value })
              }
              label="Role"
            >
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Department</InputLabel>
            <Select
              value={userFormData.department}
              onChange={(e) =>
                setUserFormData({ ...userFormData, department: e.target.value })
              }
              label="Department"
            >
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Operations">Operations</MenuItem>
              <MenuItem value="Warehouse">Warehouse</MenuItem>
              <MenuItem value="Store">Store</MenuItem>
              <MenuItem value="Purchasing">Purchasing</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const TabPanel = ({ children, value, index }) => (
    <Box hidden={value !== index} sx={{ mt: 3 }}>
      {value === index && children}
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
                background: "linear-gradient(45deg, #673AB7 30%, #9C27B0 90%)",
              }}
            >
              <SettingsIcon />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                background: "linear-gradient(45deg, #673AB7 30%, #9C27B0 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Admin Settings
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage users, system settings, and security configurations
          </Typography>
        </Box>

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
            >
              <Tab icon={<PeopleIcon />} label="Users" />
              <Tab icon={<DatabaseIcon />} label="System" />
              <Tab icon={<SecurityIcon />} label="Security" />
              <Tab icon={<TrendingUpIcon />} label="Insights" />
            </Tabs>
          </Box>

          {/* Users Tab */}
          <TabPanel value={activeTab} index={0}>
            <CardContent>
              {/* User Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #00BCD4 90%)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {users.length}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        Total Users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {users.filter((u) => u.status === "Active").length}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        Active Users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(45deg, #FF9800 30%, #FFC107 90%)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {users.filter((u) => u.status === "Pending").length}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        Pending Users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background:
                        "linear-gradient(45deg, #9C27B0 30%, #E91E63 90%)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {
                          users.filter(
                            (u) =>
                              u.role === "Admin" || u.role === "Super Admin",
                          ).length
                        }
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        Admins
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Add User Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setIsAddUserDialogOpen(true)}
                  sx={{
                    background:
                      "linear-gradient(45deg, #673AB7 30%, #9C27B0 90%)",
                  }}
                >
                  Add User
                </Button>
              </Box>

              {/* Users Table */}
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell>Join Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                width: 32,
                                height: 32,
                              }}
                            >
                              {user.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {user.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.department}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(user.status)}
                            label={user.status}
                            color={getStatusColor(user.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace" }}
                          >
                            {user.lastLogin}
                          </Typography>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) => {
                              setMenuAnchor(e.currentTarget);
                              setSelectedUser(user);
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </TabPanel>

          {/* System Tab */}
          <TabPanel value={activeTab} index={1}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <DatabaseIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Inventory Settings
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Configure automatic inventory management
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={systemSettings.autoReorder}
                              onChange={(e) =>
                                handleSettingChange(
                                  "autoReorder",
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">
                                Auto Reorder
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Automatically reorder when stock is low
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Low Stock Threshold"
                        type="number"
                        value={systemSettings.lowStockThreshold}
                        onChange={(e) =>
                          handleSettingChange(
                            "lowStockThreshold",
                            parseInt(e.target.value),
                          )
                        }
                        sx={{ mb: 3 }}
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.priceAlerts}
                            onChange={(e) =>
                              handleSettingChange(
                                "priceAlerts",
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">
                              Price Alerts
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Alert when supplier prices change
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <NotificationsIcon
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />
                        Notification Settings
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Configure how you receive alerts
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={systemSettings.notificationEmails}
                              onChange={(e) =>
                                handleSettingChange(
                                  "notificationEmails",
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">
                                Email Notifications
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Receive alerts via email
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>

                      <FormControl fullWidth>
                        <InputLabel>Backup Frequency</InputLabel>
                        <Select
                          value={systemSettings.backupFrequency}
                          onChange={(e) =>
                            handleSettingChange(
                              "backupFrequency",
                              e.target.value,
                            )
                          }
                          label="Backup Frequency"
                        >
                          <MenuItem value="hourly">Hourly</MenuItem>
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={2}>
            <CardContent>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Security Configuration
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Manage security settings and access controls
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={systemSettings.twoFactorAuth}
                              onChange={(e) =>
                                handleSettingChange(
                                  "twoFactorAuth",
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">
                                Two-Factor Authentication
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Require 2FA for all admin accounts
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.auditLogging}
                            onChange={(e) =>
                              handleSettingChange(
                                "auditLogging",
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">
                              Audit Logging
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Log all user actions for compliance
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Session Timeout (minutes)"
                        type="number"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange(
                            "sessionTimeout",
                            parseInt(e.target.value),
                          )
                        }
                        sx={{ mb: 3 }}
                      />

                      <Alert severity="warning">
                        <AlertTitle>Security Reminder</AlertTitle>
                        Regular security audits are recommended every 90 days
                      </Alert>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </CardContent>
          </TabPanel>

          {/* Insights Tab */}
          <TabPanel value={activeTab} index={3}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        <PsychologyIcon
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />
                        AI-Powered Insights
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Advanced analytics from your inventory data
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Alert severity="success" sx={{ mb: 2 }}>
                          <AlertTitle>📈 Demand Patterns</AlertTitle>
                          Weekend dairy sales increase by 23%. Consider
                          pre-stocking Friday afternoons.
                        </Alert>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <AlertTitle>🎯 Optimization Opportunities</AlertTitle>
                          Shelf space reallocation could improve produce
                          turnover by 15%.
                        </Alert>
                        <Alert severity="warning">
                          <AlertTitle>⚡ Operational Efficiency</AlertTitle>
                          Staff productivity peaks between 10-11 AM. Schedule
                          restocking accordingly.
                        </Alert>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="secondary">
                        <LightbulbIcon
                          sx={{ mr: 1, verticalAlign: "middle" }}
                        />
                        Industry Best Practices
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Research-backed recommendations for supermarket
                        management
                      </Typography>

                      <Alert severity="info" sx={{ mb: 2 }}>
                        <AlertTitle>Temperature Monitoring</AlertTitle>
                        IoT sensors can reduce food waste by 12% through
                        real-time cold chain monitoring
                      </Alert>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        <AlertTitle>Dynamic Pricing</AlertTitle>
                        AI-driven price adjustments can increase margins by 8%
                        while maintaining customer satisfaction
                      </Alert>
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <AlertTitle>Customer Analytics</AlertTitle>
                        Basket analysis reveals 67% of customers buying bread
                        also purchase spreads within 3 days
                      </Alert>
                      <Alert severity="error">
                        <AlertTitle>Seasonal Optimization</AlertTitle>
                        Pre-holiday inventory should increase by 35% for dairy,
                        45% for beverages, and 28% for snacks
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </TabPanel>
        </Card>

        {/* Dialogs */}
        <Dialog
          open={isAddUserDialogOpen}
          onClose={() => setIsAddUserDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Create a new user account with appropriate permissions.
            </Typography>
            <UserForm onSubmit={handleAddUser} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} variant="contained">
              Add User
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isEditUserDialogOpen}
          onClose={() => setIsEditUserDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Update user account details and permissions.
            </Typography>
            <UserForm onSubmit={handleEditUser} isEdit />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} variant="contained">
              Update User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Actions Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => openEditDialog(selectedUser)}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => handleDeleteUser(selectedUser?.id)}
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

export default Settings;
