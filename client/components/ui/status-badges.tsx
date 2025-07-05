import { Badge } from "./badge";

// Status Badge Component for uniform status styling
export function StatusBadge({ status }: { status: string }) {
  const getStatusVariant = (status: string) => {
    const statusMap = {
      // Product statuses
      Available: "default",
      "Low Stock": "secondary",
      "Out of Stock": "destructive",

      // User statuses
      Active: "default",
      Inactive: "secondary",
      Pending: "secondary",

      // Forecast statuses
      Normal: "default",
      Warning: "secondary",
      Critical: "destructive",
      "Out of Stock": "destructive",

      // General statuses
      Online: "default",
      Offline: "secondary",
      Error: "destructive",
      Success: "default",
    } as const;

    return statusMap[status as keyof typeof statusMap] || "outline";
  };

  return (
    <Badge variant={getStatusVariant(status)} className="whitespace-nowrap">
      {status}
    </Badge>
  );
}

// Category Badge Component for uniform category styling
export function CategoryBadge({ category }: { category: string }) {
  const getCategoryVariant = (category: string) => {
    const categoryMap = {
      // Product categories
      "Fruits & Vegetables": "default",
      Dairy: "secondary",
      Bakery: "outline",
      "Meat & Poultry": "default",
      Seafood: "secondary",
      "Grains & Cereals": "outline",
      "Cooking Essentials": "default",
      Beverages: "secondary",
      Snacks: "outline",

      // User departments/roles
      Admin: "destructive",
      Manager: "default",
      Employee: "secondary",
      Supervisor: "default",

      // General categories
      Sales: "default",
      Inventory: "secondary",
      Finance: "outline",
      HR: "secondary",
      IT: "outline",
    } as const;

    return categoryMap[category as keyof typeof categoryMap] || "outline";
  };

  const getCategoryColor = (category: string) => {
    // Add specific styling for better visual distinction
    const colorMap = {
      "Fruits & Vegetables":
        "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      Dairy: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      Bakery: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
      "Meat & Poultry":
        "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      Seafood: "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200",
      "Grains & Cereals":
        "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      "Cooking Essentials":
        "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
      Beverages:
        "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
      Snacks:
        "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    } as const;

    return colorMap[category as keyof typeof colorMap];
  };

  const customColor = getCategoryColor(category);

  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap ${customColor || ""}`}
    >
      {category}
    </Badge>
  );
}

// Role Badge Component for user roles
export function RoleBadge({ role }: { role: string }) {
  const getRoleVariant = (role: string) => {
    const roleMap = {
      Admin: "destructive",
      Manager: "default",
      Employee: "secondary",
      Supervisor: "default",
      Guest: "outline",
    } as const;

    return roleMap[role as keyof typeof roleMap] || "secondary";
  };

  return (
    <Badge variant={getRoleVariant(role)} className="whitespace-nowrap">
      {role}
    </Badge>
  );
}

// Department Badge Component
export function DepartmentBadge({ department }: { department: string }) {
  const getDepartmentColor = (department: string) => {
    const colorMap = {
      Sales:
        "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
      Inventory:
        "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200",
      Finance: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      HR: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
      IT: "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200",
      Operations: "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200",
    } as const;

    return colorMap[department as keyof typeof colorMap];
  };

  const customColor = getDepartmentColor(department);

  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap ${customColor || ""}`}
    >
      {department}
    </Badge>
  );
}
