import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  StatusBadge,
  RoleBadge,
  DepartmentBadge,
} from "@/components/ui/status-badges";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings as SettingsIcon,
  UserPlus,
  Users,
  Shield,
  Bell,
  Database,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Manager" | "Staff";
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
  permissions: string[];
  department: string;
  joinDate: string;
}

interface SystemSettings {
  autoReorder: boolean;
  lowStockThreshold: number;
  notificationEmails: boolean;
  backupFrequency: string;
  sessionTimeout: number;
  twoFactorAuth: boolean;
  auditLogging: boolean;
  priceAlerts: boolean;
}

export default function Settings() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
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
    permissions: [] as string[],
  });

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load sample users - In real app, this would be AWS Lambda API call to DynamoDB
    setUsers([
      {
        id: "1",
        name: "John Anderson",
        email: "john.anderson@invencare.com",
        role: "Super Admin",
        status: "Active",
        lastLogin: "2024-01-15 09:30",
        permissions: ["all"],
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
        permissions: ["inventory", "reports", "users"],
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
        permissions: ["inventory", "reports"],
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
        permissions: ["inventory"],
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
        permissions: ["inventory", "reports"],
        department: "Purchasing",
        joinDate: "2024-01-14",
      },
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userFormData.name,
      email: userFormData.email,
      role: userFormData.role as User["role"],
      status: "Pending",
      lastLogin: "Never",
      permissions: userFormData.permissions,
      department: userFormData.department,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUser]);
    setUserFormData({
      name: "",
      email: "",
      role: "",
      department: "",
      permissions: [],
    });
    setIsAddUserDialogOpen(false);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUser: User = {
      ...editingUser,
      name: userFormData.name,
      email: userFormData.email,
      role: userFormData.role as User["role"],
      department: userFormData.department,
      permissions: userFormData.permissions,
    };

    setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
    setUserFormData({
      name: "",
      email: "",
      role: "",
      department: "",
      permissions: [],
    });
    setIsEditUserDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      permissions: user.permissions,
    });
    setIsEditUserDialogOpen(true);
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const UserForm = ({
    onSubmit,
    isEdit = false,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={userFormData.name}
            onChange={(e) =>
              setUserFormData({ ...userFormData, name: e.target.value })
            }
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={userFormData.email}
            onChange={(e) =>
              setUserFormData({ ...userFormData, email: e.target.value })
            }
            placeholder="john.doe@invencare.com"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={userFormData.role}
            onValueChange={(value) =>
              setUserFormData({ ...userFormData, role: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={userFormData.department}
            onValueChange={(value) =>
              setUserFormData({ ...userFormData, department: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Warehouse">Warehouse</SelectItem>
              <SelectItem value="Store">Store</SelectItem>
              <SelectItem value="Purchasing">Purchasing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsAddUserDialogOpen(false);
            setIsEditUserDialogOpen(false);
            setUserFormData({
              name: "",
              email: "",
              role: "",
              department: "",
              permissions: [],
            });
          }}
        >
          Cancel
        </Button>
        <Button type="submit">{isEdit ? "Update User" : "Add User"}</Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navigation onLogout={handleLogout} />

      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Settings
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage users, system settings, and security configurations
            </p>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                System
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">{users.length}</div>
                    <div className="text-blue-100">Total Users</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">
                      {users.filter((u) => u.status === "Active").length}
                    </div>
                    <div className="text-green-100">Active Users</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">
                      {users.filter((u) => u.status === "Pending").length}
                    </div>
                    <div className="text-yellow-100">Pending Users</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">
                      {
                        users.filter(
                          (u) => u.role === "Admin" || u.role === "Super Admin",
                        ).length
                      }
                    </div>
                    <div className="text-purple-100">Admins</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      Manage user accounts, roles, and permissions
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isAddUserDialogOpen}
                    onOpenChange={setIsAddUserDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new user account with appropriate
                          permissions.
                        </DialogDescription>
                      </DialogHeader>
                      <UserForm onSubmit={handleAddUser} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-slate-50 to-indigo-50">
                          <TableHead className="font-semibold">User</TableHead>
                          <TableHead className="font-semibold">Role</TableHead>
                          <TableHead className="font-semibold">
                            Department
                          </TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold">
                            Last Login
                          </TableHead>
                          <TableHead className="font-semibold">
                            Join Date
                          </TableHead>
                          <TableHead className="w-[70px] font-semibold">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow
                            key={user.id}
                            className="hover:bg-slate-50/50"
                          >
                            <TableCell>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <RoleBadge role={user.role} />
                            </TableCell>
                            <TableCell>
                              <DepartmentBadge department={user.department} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={user.status} />
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {user.lastLogin}
                            </TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => openEditDialog(user)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Inventory Settings
                    </CardTitle>
                    <CardDescription>
                      Configure automatic inventory management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Reorder</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically reorder when stock is low
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.autoReorder}
                        onCheckedChange={(checked) =>
                          handleSettingChange("autoReorder", checked)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Low Stock Threshold</Label>
                      <Input
                        type="number"
                        value={systemSettings.lowStockThreshold}
                        onChange={(e) =>
                          handleSettingChange(
                            "lowStockThreshold",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Price Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Alert when supplier prices change
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.priceAlerts}
                        onCheckedChange={(checked) =>
                          handleSettingChange("priceAlerts", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Settings
                    </CardTitle>
                    <CardDescription>
                      Configure how you receive alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts via email
                        </p>
                      </div>
                      <Switch
                        checked={systemSettings.notificationEmails}
                        onCheckedChange={(checked) =>
                          handleSettingChange("notificationEmails", checked)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Backup Frequency</Label>
                      <Select
                        value={systemSettings.backupFrequency}
                        onValueChange={(value) =>
                          handleSettingChange("backupFrequency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Configuration
                  </CardTitle>
                  <CardDescription>
                    Manage security settings and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Require 2FA for all admin accounts
                          </p>
                        </div>
                        <Switch
                          checked={systemSettings.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            handleSettingChange("twoFactorAuth", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Audit Logging</Label>
                          <p className="text-sm text-muted-foreground">
                            Log all user actions for compliance
                          </p>
                        </div>
                        <Switch
                          checked={systemSettings.auditLogging}
                          onCheckedChange={(checked) =>
                            handleSettingChange("auditLogging", checked)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Session Timeout (minutes)</Label>
                        <Input
                          type="number"
                          value={systemSettings.sessionTimeout}
                          onChange={(e) =>
                            handleSettingChange(
                              "sessionTimeout",
                              parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">
                              Security Reminder
                            </h4>
                            <p className="text-sm text-yellow-700">
                              Regular security audits are recommended every 90
                              days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="text-blue-700">
                      🧠 AI-Powered Insights
                    </CardTitle>
                    <CardDescription>
                      Advanced analytics from your inventory data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-3">
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold text-green-700 mb-2">
                          📈 Demand Patterns
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Weekend dairy sales increase by 23%. Consider
                          pre-stocking Friday afternoons.
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold text-blue-700 mb-2">
                          🎯 Optimization Opportunities
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Shelf space reallocation could improve produce
                          turnover by 15%.
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border">
                        <h4 className="font-semibold text-purple-700 mb-2">
                          ⚡ Operational Efficiency
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Staff productivity peaks between 10-11 AM. Schedule
                          restocking accordingly.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-green-700">
                      💡 Industry Best Practices
                    </CardTitle>
                    <CardDescription>
                      Research-backed recommendations for supermarket management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">Temperature Monitoring</p>
                          <p className="text-sm text-muted-foreground">
                            IoT sensors can reduce food waste by 12% through
                            real-time cold chain monitoring
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">Dynamic Pricing</p>
                          <p className="text-sm text-muted-foreground">
                            AI-driven price adjustments can increase margins by
                            8% while maintaining customer satisfaction
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">Customer Analytics</p>
                          <p className="text-sm text-muted-foreground">
                            Basket analysis reveals 67% of customers buying
                            bread also purchase spreads within 3 days
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">Seasonal Optimization</p>
                          <p className="text-sm text-muted-foreground">
                            Pre-holiday inventory should increase by 35% for
                            dairy, 45% for beverages, and 28% for snacks
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Edit User Dialog */}
          <Dialog
            open={isEditUserDialogOpen}
            onOpenChange={setIsEditUserDialogOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user account details and permissions.
                </DialogDescription>
              </DialogHeader>
              <UserForm onSubmit={handleEditUser} isEdit />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
