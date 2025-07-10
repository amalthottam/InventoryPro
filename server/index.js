import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";

// AWS Lambda Integration
// import serverless from 'serverless-http';

// AWS RDS Integration
// import mysql from 'mysql2/promise';
// import { RDSClient, DescribeDBInstancesCommand } from '@aws-sdk/client-rds';
//
// RDS Connection Configuration
// const dbConfig = {
//   host: process.env.RDS_HOSTNAME || 'your-rds-endpoint.region.rds.amazonaws.com',
//   user: process.env.RDS_USERNAME || 'admin',
//   password: process.env.RDS_PASSWORD || 'your-password',
//   database: process.env.RDS_DB_NAME || 'invencare',
//   port: process.env.RDS_PORT || 3306,
//   ssl: {
//     rejectUnauthorized: false
//   }
// };
//
// Create RDS connection pool
// const pool = mysql.createPool({
//   ...dbConfig,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });
//
// RDS Health Check Function
// const checkRDSConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     await connection.ping();
//     connection.release();
//     console.log('RDS connection successful');
//     return true;
//   } catch (error) {
//     console.error('RDS connection failed:', error);
//     return false;
//   }
// };

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // AWS RDS Database middleware
  // app.use(async (req, res, next) => {
  //   try {
  //     req.db = pool;
  //     next();
  //   } catch (error) {
  //     console.error('Database middleware error:', error);
  //     res.status(500).json({ error: 'Database connection failed' });
  //   }
  // });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  // AWS RDS Health Check endpoint
  // app.get("/api/health", async (req, res) => {
  //   try {
  //     const dbHealthy = await checkRDSConnection();
  //     res.json({
  //       status: 'ok',
  //       database: dbHealthy ? 'connected' : 'disconnected',
  //       timestamp: new Date().toISOString()
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: 'error',
  //       error: error.message
  //     });
  //   }
  // });

  // AWS RDS Product Management endpoints
  // app.get("/api/products", async (req, res) => {
  //   try {
  //     const [rows] = await req.db.execute(
  //       'SELECT * FROM products ORDER BY created_at DESC'
  //     );
  //     res.json({ products: rows });
  //   } catch (error) {
  //     console.error('Products fetch error:', error);
  //     res.status(500).json({ error: 'Failed to fetch products' });
  //   }
  // });
  //
  // app.post("/api/products", async (req, res) => {
  //   try {
  //     const { name, description, price, quantity, category } = req.body;
  //     const [result] = await req.db.execute(
  //       'INSERT INTO products (name, description, price, quantity, category) VALUES (?, ?, ?, ?, ?)',
  //       [name, description, price, quantity, category]
  //     );
  //     res.json({
  //       message: 'Product created successfully',
  //       productId: result.insertId
  //     });
  //   } catch (error) {
  //     console.error('Product creation error:', error);
  //     res.status(500).json({ error: 'Failed to create product' });
  //   }
  // });
  //
  // app.put("/api/products/:id", async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { name, description, price, quantity, category } = req.body;
  //     await req.db.execute(
  //       'UPDATE products SET name=?, description=?, price=?, quantity=?, category=? WHERE id=?',
  //       [name, description, price, quantity, category, id]
  //     );
  //     res.json({ message: 'Product updated successfully' });
  //   } catch (error) {
  //     console.error('Product update error:', error);
  //     res.status(500).json({ error: 'Failed to update product' });
  //   }
  // });
  //
  // app.delete("/api/products/:id", async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     await req.db.execute('DELETE FROM products WHERE id=?', [id]);
  //     res.json({ message: 'Product deleted successfully' });
  //   } catch (error) {
  //     console.error('Product deletion error:', error);
  //     res.status(500).json({ error: 'Failed to delete product' });
  //   }
  // });

  // AWS RDS Inventory Analytics
  // app.get("/api/analytics/inventory", async (req, res) => {
  //   try {
  //     const [lowStockItems] = await req.db.execute(
  //       'SELECT * FROM products WHERE quantity < 10 ORDER BY quantity ASC'
  //     );
  //
  //     const [totalProducts] = await req.db.execute(
  //       'SELECT COUNT(*) as total FROM products'
  //     );
  //
  //     const [totalValue] = await req.db.execute(
  //       'SELECT SUM(price * quantity) as total_value FROM products'
  //     );
  //
  //     res.json({
  //       lowStockItems,
  //       totalProducts: totalProducts[0].total,
  //       totalValue: totalValue[0].total_value || 0
  //     });
  //   } catch (error) {
  //     console.error('Analytics error:', error);
  //     res.status(500).json({ error: 'Failed to fetch analytics' });
  //   }
  // });

  app.get("/api/demo", handleDemo);

  // AWS Lambda Error handling middleware
  // app.use((error, req, res, next) => {
  //   console.error('Server error:', error);
  //   res.status(500).json({
  //     error: 'Internal server error',
  //     message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  //   });
  // });

  return app;
}

// AWS Lambda Handler Export
// export const handler = serverless(createServer());

// RDS Database Schema (run this SQL to create tables)
// CREATE TABLE stores (
//   id VARCHAR(50) PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   address TEXT,
//   city VARCHAR(100),
//   state VARCHAR(100),
//   zip_code VARCHAR(20),
//   phone VARCHAR(20),
//   manager_id VARCHAR(255), -- Cognito user ID
//   status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
//   timezone VARCHAR(50) DEFAULT 'UTC',
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   INDEX idx_status (status),
//   INDEX idx_manager (manager_id)
// );
//
// CREATE TABLE products (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   description TEXT,
//   price DECIMAL(10, 2) NOT NULL,
//   quantity INT NOT NULL DEFAULT 0,
//   category VARCHAR(100),
//   sku VARCHAR(100),
//   barcode VARCHAR(100),
//   minimum_stock INT DEFAULT 5,
//   maximum_stock INT DEFAULT 100,
//   supplier_id INT,
//   store_id VARCHAR(50) NOT NULL, -- Links to stores table
//   location_in_store VARCHAR(100), -- Aisle/shelf location within store
//   status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
//   INDEX idx_store_category (store_id, category),
//   INDEX idx_store_sku (store_id, sku),
//   INDEX idx_status (status),
//   UNIQUE KEY unique_sku_per_store (sku, store_id) -- SKU unique per store
// );
//
// CREATE TABLE suppliers (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   contact_person VARCHAR(255),
//   email VARCHAR(255),
//   phone VARCHAR(50),
//   address TEXT,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
//
// CREATE TABLE user_store_access (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   user_id VARCHAR(255) NOT NULL, -- Cognito user ID
//   store_id VARCHAR(50) NOT NULL,
//   role ENUM('admin', 'manager', 'employee', 'viewer') NOT NULL,
//   granted_by VARCHAR(255), -- Cognito user ID who granted access
//   granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   expires_at TIMESTAMP NULL, -- Optional expiration
//   status ENUM('active', 'suspended', 'revoked') DEFAULT 'active',
//   FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
//   INDEX idx_user_store (user_id, store_id),
//   INDEX idx_store (store_id),
//   INDEX idx_status (status),
//   UNIQUE KEY unique_user_store (user_id, store_id)
// );
//
// CREATE TABLE inventory_transactions (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   product_id INT NOT NULL,
//   store_id VARCHAR(50) NOT NULL, -- Store where transaction occurred
//   transaction_type ENUM('sale', 'restock', 'adjustment', 'transfer') NOT NULL, -- Updated for Transaction page types
//   quantity INT NOT NULL, -- Positive for inbound, negative for outbound/adjustments
//   unit_price DECIMAL(10, 2) NOT NULL, -- Price per unit at time of transaction
//   total_amount DECIMAL(12, 2) NOT NULL, -- Total transaction value (quantity * unit_price)
//   reference_number VARCHAR(100) UNIQUE, -- Auto-generated reference (SALE-2024-001, RST-2024-002, etc.)
//   notes TEXT,
//   user_id VARCHAR(255), -- Cognito user ID who performed transaction
//   user_name VARCHAR(255), -- User's display name from Cognito attributes
//   transfer_to_store_id VARCHAR(50) NULL, -- For store-to-store transfers
//   transfer_to_store_name VARCHAR(255) NULL, -- Destination store name for transfers
//   category VARCHAR(100), -- Product category for analytics aggregation
//   product_name VARCHAR(255), -- Product name snapshot for historical records
//   audit_trail JSON, -- Additional metadata: IP address, session info, approval chain
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
//   FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
//   FOREIGN KEY (transfer_to_store_id) REFERENCES stores(id) ON DELETE SET NULL,
//   INDEX idx_product_store (product_id, store_id),
//   INDEX idx_store (store_id),
//   INDEX idx_transaction_type (transaction_type),
//   INDEX idx_created_at (created_at),
//   INDEX idx_user (user_id),
//   INDEX idx_reference_number (reference_number),
//   INDEX idx_category (category),
//   INDEX idx_transfer_stores (store_id, transfer_to_store_id),
//   INDEX idx_analytics (store_id, transaction_type, created_at) -- For Lambda analytics queries
// );
//
// -- Transaction Audit Log Table
// CREATE TABLE transaction_audit_log (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   transaction_id INT NOT NULL,
//   action ENUM('created', 'modified', 'approved', 'rejected', 'voided') NOT NULL,
//   performed_by VARCHAR(255) NOT NULL, -- Cognito user ID
//   old_values JSON, -- Previous values before modification
//   new_values JSON, -- New values after modification
//   reason TEXT, -- Reason for modification/approval/rejection
//   ip_address VARCHAR(45),
//   user_agent TEXT,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id) ON DELETE CASCADE,
//   INDEX idx_transaction (transaction_id),
//   INDEX idx_user (performed_by),
//   INDEX idx_action (action),
//   INDEX idx_created_at (created_at)
// );
