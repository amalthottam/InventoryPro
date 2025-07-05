/**
 * Shared code between client and server
 * Useful to share interfaces and types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// AWS Cognito User Types
// export interface CognitoUser {
//   username: string;
//   email: string;
//   email_verified: boolean;
//   sub: string;
//   given_name?: string;
//   family_name?: string;
//   phone_number?: string;
//   picture?: string;
//   'custom:role'?: 'admin' | 'manager' | 'employee';
//   'custom:store_id'?: string;
// }

// AWS API Response Types
export const createApiResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const createApiError = (error, statusCode = 500) => ({
  success: false,
  error: error.message || error,
  statusCode,
  timestamp: new Date().toISOString(),
});

// Product Management Types
export const ProductStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DISCONTINUED: "discontinued",
};

export const TransactionType = {
  IN: "in",
  OUT: "out",
  ADJUSTMENT: "adjustment",
};

// AWS Lambda Event Types
// export interface InventoryAnalyticsEvent {
//   action: 'generateInventoryReport' | 'lowStockAlert' | 'salesAnalysis';
//   storeId?: string;
//   dateRange?: '7days' | '30days' | '90days';
//   categoryFilter?: string;
//   userId?: string;
// }

// export interface AutoReorderEvent {
//   storeId?: string;
//   forceReorder?: boolean;
//   productIds?: number[];
//   supplierId?: number;
// }

// export interface PriceOptimizationEvent {
//   storeId?: string;
//   categoryFilter?: string;
//   analysisType: 'demand' | 'competition' | 'margin' | 'all';
//   timeframe?: number;
// }

// AWS RDS Data Types
// export interface Product {
//   id: number;
//   name: string;
//   description?: string;
//   price: number;
//   quantity: number;
//   category?: string;
//   sku?: string;
//   barcode?: string;
//   minimum_stock: number;
//   maximum_stock: number;
//   supplier_id?: number;
//   location?: string;
//   status: 'active' | 'inactive' | 'discontinued';
//   created_at: string;
//   updated_at: string;
// }

// export interface Supplier {
//   id: number;
//   name: string;
//   contact_person?: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface InventoryTransaction {
//   id: number;
//   product_id: number;
//   transaction_type: 'in' | 'out' | 'adjustment';
//   quantity: number;
//   reference_number?: string;
//   notes?: string;
//   user_id?: string;
//   created_at: string;
// }

// export interface ReorderRequest {
//   id: number;
//   product_id: number;
//   requested_quantity: number;
//   estimated_cost: number;
//   status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
//   supplier_id?: number;
//   notes?: string;
//   created_at: string;
//   updated_at: string;
// }

// API Response Interfaces
// export interface DemoResponse {
//   message: string;
//   timestamp: string;
//   analytics?: {
//     totalProducts: number;
//     lowStockItems: number;
//     topSellingCategories: Array<{
//       name: string;
//       sales: number;
//     }>;
//     revenueThisMonth: number;
//     inventoryTurnover: number;
//   };
// }

// export interface ProductListResponse {
//   products: Product[];
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
//   filters?: {
//     category?: string;
//     status?: string;
//     lowStock?: boolean;
//   };
// }

// export interface AnalyticsResponse {
//   lowStockItems: Product[];
//   totalProducts: number;
//   totalValue: number;
//   categoryBreakdown: Array<{
//     category: string;
//     product_count: number;
//     total_quantity: number;
//     total_value: number;
//     avg_price: number;
//   }>;
//   salesTrends?: Array<{
//     date: string;
//     total_sales: number;
//     transaction_count: number;
//   }>;
// }

// export interface ReorderAnalysisResponse {
//   message: string;
//   requests: Array<{
//     productId: number;
//     productName: string;
//     currentStock: number;
//     reorderQuantity: number;
//     supplierId?: number;
//     supplierEmail?: string;
//     estimatedCost: number;
//   }>;
// }

// export interface PriceOptimizationResponse {
//   message: string;
//   recommendations: Array<{
//     productId: number;
//     productName: string;
//     category: string;
//     currentPrice: number;
//     recommendedPrice: number;
//     action: 'increase' | 'decrease' | 'maintain';
//     reason: string;
//     salesVelocity: number;
//   }>;
// }

// Validation Functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // AWS Cognito password requirements
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^a-zA-Z\d]/.test(password)
  );
};

export const validateSKU = (sku) => {
  // Basic SKU validation (alphanumeric, hyphens, underscores)
  const skuRegex = /^[A-Z0-9_-]+$/i;
  return skuRegex.test(sku) && sku.length >= 3 && sku.length <= 50;
};

export const validatePrice = (price) => {
  return typeof price === "number" && price > 0 && price < 999999.99;
};

export const validateQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity >= 0;
};

// Utility Functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const calculateInventoryValue = (products) => {
  return products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
};

export const generateSKU = (productName, category) => {
  const namePrefix = productName.substring(0, 3).toUpperCase();
  const categoryPrefix = category
    ? category.substring(0, 2).toUpperCase()
    : "GN";
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${categoryPrefix}-${namePrefix}-${randomSuffix}`;
};

// AWS Configuration Helpers
export const getAWSConfig = () => ({
  region: process.env.AWS_REGION || "us-east-1",
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
  },
  rds: {
    hostname: process.env.RDS_HOSTNAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    port: process.env.RDS_PORT || 3306,
  },
  lambda: {
    analyticsFunction: process.env.LAMBDA_ANALYTICS_FUNCTION,
    reorderFunction: process.env.LAMBDA_REORDER_FUNCTION,
    priceOptimizationFunction: process.env.LAMBDA_PRICE_OPTIMIZATION_FUNCTION,
  },
});

// Error Messages
export const ErrorMessages = {
  INVALID_EMAIL: "Please enter a valid email address",
  WEAK_PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, number and special character",
  INVALID_SKU:
    "SKU must be 3-50 characters, alphanumeric with hyphens/underscores only",
  INVALID_PRICE: "Price must be a positive number less than $999,999.99",
  INVALID_QUANTITY: "Quantity must be a non-negative integer",
  PRODUCT_NOT_FOUND: "Product not found",
  SUPPLIER_NOT_FOUND: "Supplier not found",
  INSUFFICIENT_STOCK: "Insufficient stock for this operation",
  DUPLICATE_SKU: "A product with this SKU already exists",
  DATABASE_ERROR: "Database operation failed",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  COGNITO_ERROR: "Authentication service error",
  LAMBDA_ERROR: "Analytics service temporarily unavailable",
  RDS_CONNECTION_ERROR: "Database connection failed",
};
