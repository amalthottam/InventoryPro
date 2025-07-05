// AWS Lambda Integration Example
// import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

// Initialize Lambda client
// const lambdaClient = new LambdaClient({
//   region: process.env.AWS_REGION || 'us-east-1'
// });

export const handleDemo = async (req, res) => {
  try {
    // AWS Lambda Function Invocation Example
    // const lambdaParams = {
    //   FunctionName: 'invencare-analytics-processor',
    //   InvocationType: 'RequestResponse',
    //   Payload: JSON.stringify({
    //     action: 'generateInventoryReport',
    //     storeId: req.query.storeId || 'default',
    //     dateRange: req.query.dateRange || '30days'
    //   })
    // };

    // try {
    //   const lambdaCommand = new InvokeCommand(lambdaParams);
    //   const lambdaResponse = await lambdaClient.send(lambdaCommand);
    //
    //   const responsePayload = JSON.parse(
    //     new TextDecoder().decode(lambdaResponse.Payload)
    //   );
    //
    //   res.status(200).json({
    //     message: "Analytics processed successfully",
    //     data: responsePayload,
    //     source: "aws-lambda"
    //   });
    // } catch (lambdaError) {
    //   console.error('Lambda invocation error:', lambdaError);
    //   res.status(500).json({
    //     error: 'Failed to process analytics',
    //     details: lambdaError.message
    //   });
    // }

    // Demo response (remove when implementing Lambda)
    const response = {
      message: "Hello from Express server",
      timestamp: new Date().toISOString(),
      // Demo analytics data that would come from Lambda
      analytics: {
        totalProducts: 1250,
        lowStockItems: 23,
        topSellingCategories: [
          { name: "Beverages", sales: 850 },
          { name: "Snacks", sales: 720 },
          { name: "Dairy", sales: 650 },
        ],
        revenueThisMonth: 45230.5,
        inventoryTurnover: 4.2,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Demo endpoint error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// AWS Lambda Function Examples for separate deployment

// Lambda Function 1: Inventory Analytics Processor
// export const inventoryAnalyticsHandler = async (event, context) => {
//   try {
//     const { action, storeId, dateRange } = event;
//
//     // Connect to RDS
//     const connection = await mysql.createConnection({
//       host: process.env.RDS_HOSTNAME,
//       user: process.env.RDS_USERNAME,
//       password: process.env.RDS_PASSWORD,
//       database: process.env.RDS_DB_NAME
//     });
//
//     let result;
//
//     switch (action) {
//       case 'generateInventoryReport':
//         const [rows] = await connection.execute(`
//           SELECT
//             p.category,
//             COUNT(*) as product_count,
//             SUM(p.quantity) as total_quantity,
//             SUM(p.price * p.quantity) as total_value,
//             AVG(p.price) as avg_price
//           FROM products p
//           WHERE p.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
//           GROUP BY p.category
//           ORDER BY total_value DESC
//         `, [dateRange === '30days' ? 30 : 7]);
//
//         result = { inventoryReport: rows };
//         break;
//
//       case 'lowStockAlert':
//         const [lowStock] = await connection.execute(`
//           SELECT * FROM products
//           WHERE quantity <= minimum_stock
//           AND status = 'active'
//           ORDER BY quantity ASC
//         `);
//
//         result = { lowStockItems: lowStock };
//         break;
//
//       default:
//         throw new Error('Unknown action');
//     }
//
//     await connection.end();
//
//     return {
//       statusCode: 200,
//       body: JSON.stringify(result)
//     };
//   } catch (error) {
//     console.error('Lambda error:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: error.message })
//     };
//   }
// };

// Lambda Function 2: Automated Reorder System
// export const autoReorderHandler = async (event, context) => {
//   try {
//     // Connect to RDS
//     const connection = await mysql.createConnection({
//       host: process.env.RDS_HOSTNAME,
//       user: process.env.RDS_USERNAME,
//       password: process.env.RDS_PASSWORD,
//       database: process.env.RDS_DB_NAME
//     });
//
//     // Find products below reorder point
//     const [lowStockProducts] = await connection.execute(`
//       SELECT p.*, s.name as supplier_name, s.email as supplier_email
//       FROM products p
//       LEFT JOIN suppliers s ON p.supplier_id = s.id
//       WHERE p.quantity <= p.minimum_stock
//       AND p.status = 'active'
//     `);
//
//     const reorderRequests = [];
//
//     for (const product of lowStockProducts) {
//       // Calculate optimal reorder quantity
//       const reorderQuantity = product.maximum_stock - product.quantity;
//
//       // Create reorder request
//       const reorderRequest = {
//         productId: product.id,
//         productName: product.name,
//         currentStock: product.quantity,
//         reorderQuantity,
//         supplierId: product.supplier_id,
//         supplierEmail: product.supplier_email,
//         estimatedCost: product.price * reorderQuantity
//       };
//
//       reorderRequests.push(reorderRequest);
//
//       // Log reorder request in database
//       await connection.execute(`
//         INSERT INTO reorder_requests
//         (product_id, requested_quantity, estimated_cost, status, created_at)
//         VALUES (?, ?, ?, 'pending', NOW())
//       `, [product.id, reorderQuantity, reorderRequest.estimatedCost]);
//
//       // Send email notification to supplier (integrate with SES)
//       // await sendReorderEmail(reorderRequest);
//     }
//
//     await connection.end();
//
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: `Generated ${reorderRequests.length} reorder requests`,
//         requests: reorderRequests
//       })
//     };
//   } catch (error) {
//     console.error('Auto reorder error:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: error.message })
//     };
//   }
// };

// Lambda Function 3: Price Optimization
// export const priceOptimizationHandler = async (event, context) => {
//   try {
//     // This Lambda could analyze sales data, competitor pricing,
//     // market trends, and suggest optimal pricing strategies
//
//     const connection = await mysql.createConnection({
//       host: process.env.RDS_HOSTNAME,
//       user: process.env.RDS_USERNAME,
//       password: process.env.RDS_PASSWORD,
//       database: process.env.RDS_DB_NAME
//     });
//
//     // Get sales velocity and profit margins
//     const [salesData] = await connection.execute(`
//       SELECT
//         p.id,
//         p.name,
//         p.price,
//         p.category,
//         COALESCE(SUM(it.quantity), 0) as total_sold,
//         COALESCE(AVG(CASE WHEN it.transaction_type = 'out' THEN it.quantity END), 0) as avg_daily_sales
//       FROM products p
//       LEFT JOIN inventory_transactions it ON p.id = it.product_id
//       WHERE it.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
//       GROUP BY p.id
//       HAVING total_sold > 0
//       ORDER BY total_sold DESC
//     `);
//
//     const pricingRecommendations = salesData.map(product => {
//       // Simple pricing algorithm (in reality, this would be more sophisticated)
//       const salesVelocity = product.avg_daily_sales;
//       const currentPrice = product.price;
//
//       let recommendedAction = 'maintain';
//       let recommendedPrice = currentPrice;
//       let reason = 'Current pricing is optimal';
//
//       if (salesVelocity > 10) {
//         // High demand - consider price increase
//         recommendedPrice = currentPrice * 1.05;
//         recommendedAction = 'increase';
//         reason = 'High demand allows for price increase';
//       } else if (salesVelocity < 2) {
//         // Low demand - consider price decrease
//         recommendedPrice = currentPrice * 0.95;
//         recommendedAction = 'decrease';
//         reason = 'Low demand suggests price reduction needed';
//       }
//
//       return {
//         productId: product.id,
//         productName: product.name,
//         category: product.category,
//         currentPrice,
//         recommendedPrice: parseFloat(recommendedPrice.toFixed(2)),
//         action: recommendedAction,
//         reason,
//         salesVelocity: parseFloat(salesVelocity.toFixed(2))
//       };
//     });
//
//     await connection.end();
//
//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Price optimization analysis complete',
//         recommendations: pricingRecommendations
//       })
//     };
//   } catch (error) {
//     console.error('Price optimization error:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: error.message })
//     };
//   }
// };
