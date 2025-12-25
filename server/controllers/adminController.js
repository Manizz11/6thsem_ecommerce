import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  const [totalUsersResult] = await database.execute(
    "SELECT COUNT(*) as count FROM users WHERE role = ?",
    ["user"]
  );

  const totalUsers = parseInt(totalUsersResult[0].count);
  const offset = (page - 1) * 10;

  const [users] = await database.execute(
    "SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    ["user", 10, offset]
  );

  res.status(200).json({
    success: true,
    totalUsers,
    currentPage: page,
    users,
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const [user] = await database.execute(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  if (user.length === 0) {
    return next(new ErrorHandler("User not found", 404));
  }

  await database.execute(
    "DELETE FROM users WHERE id = ?",
    [id]
  );

  const avatar = user[0].avatar ? JSON.parse(user[0].avatar) : null;
  if (avatar?.public_id) {
    await cloudinary.uploader.destroy(avatar.public_id);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const dashboardStats = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split("T")[0];

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  // Total Revenue All Time
  const [totalRevenueAllTimeQuery] = await database.execute(`
    SELECT SUM(total_amount) as total FROM orders WHERE paid_at IS NOT NULL    
  `);
  const totalRevenueAllTime = parseFloat(totalRevenueAllTimeQuery[0].total) || 0;

  // Total Users
  const [totalUsersCountQuery] = await database.execute(`
    SELECT COUNT(*) as count FROM users WHERE role = 'user'
  `);
  const totalUsersCount = parseInt(totalUsersCountQuery[0].count) || 0;

  // Order Status Counts
  const [orderStatusCountsQuery] = await database.execute(`
    SELECT status, COUNT(*) as count FROM orders WHERE paid_at IS NOT NULL GROUP BY status
  `);

  const orderStatusCounts = {
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  
  orderStatusCountsQuery.forEach((row) => {
    orderStatusCounts[row.status] = parseInt(row.count);
  });

  // Today's Revenue
  const [todayRevenueQuery] = await database.execute(`
    SELECT SUM(total_amount) as total FROM orders WHERE DATE(created_at) = ? AND paid_at IS NOT NULL
  `, [todayDate]);
  const todayRevenue = parseFloat(todayRevenueQuery[0].total) || 0;

  // Yesterday's Revenue
  const [yesterdayRevenueQuery] = await database.execute(`
    SELECT SUM(total_amount) as total FROM orders WHERE DATE(created_at) = ? AND paid_at IS NOT NULL  
  `, [yesterdayDate]);
  const yesterdayRevenue = parseFloat(yesterdayRevenueQuery[0].total) || 0;

  // Monthly Sales For Line Chart
  const [monthlySalesQuery] = await database.execute(`
    SELECT
    DATE_FORMAT(created_at, '%b %Y') AS month,
    SUM(total_amount) as totalsales
    FROM orders WHERE paid_at IS NOT NULL
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY created_at ASC
  `);

  const monthlySales = monthlySalesQuery.map((row) => ({
    month: row.month,
    totalsales: parseFloat(row.totalsales) || 0,
  }));

  // Top 5 Most Sold Products
  const [topSellingProductsQuery] = await database.execute(`
    SELECT p.name,
    JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0].url')) AS image,
    p.category_id,
    SUM(oi.quantity) AS total_sold
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN orders o ON o.id = oi.order_id
    WHERE o.paid_at IS NOT NULL
    GROUP BY p.name, p.images, p.category_id
    ORDER BY total_sold DESC
    LIMIT 5
  `);

  const topSellingProducts = topSellingProductsQuery;

  // Current Month Sales
  const [currentMonthSalesQuery] = await database.execute(`
    SELECT SUM(total_amount) AS total 
    FROM orders 
    WHERE paid_at IS NOT NULL AND created_at BETWEEN ? AND ?  
  `, [currentMonthStart, currentMonthEnd]);

  const currentMonthSales = parseFloat(currentMonthSalesQuery[0].total) || 0;

  // Low Stock Products
  const [lowStockProductsQuery] = await database.execute(`
    SELECT name, stock FROM products WHERE stock <= 5 
  `);

  const lowStockProducts = lowStockProductsQuery;

  // Last Month Revenue
  const [lastMonthRevenueQuery] = await database.execute(`
    SELECT SUM(total_amount) AS total 
    FROM orders
    WHERE paid_at IS NOT NULL AND created_at BETWEEN ? AND ?
  `, [previousMonthStart, previousMonthEnd]);

  const lastMonthRevenue = parseFloat(lastMonthRevenueQuery[0].total) || 0;

  let revenueGrowth = "0%";
  if (lastMonthRevenue > 0) {
    const growthRate = ((currentMonthSales - lastMonthRevenue) / lastMonthRevenue) * 100;
    revenueGrowth = `${growthRate >= 0 ? "+" : ""}${growthRate.toFixed(2)}%`;
  }

  // New Users This Month
  const [newUsersThisMonthQuery] = await database.execute(`
    SELECT COUNT(*) as count FROM users WHERE created_at >= ? AND role = 'user'
  `, [currentMonthStart]);

  const newUsersThisMonth = parseInt(newUsersThisMonthQuery[0].count) || 0;

  res.status(200).json({
    success: true,
    message: "Dashboard Stats Fetched Successfully",
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    totalUsersCount,
    orderStatusCounts,
    monthlySales,
    currentMonthSales,
    topSellingProducts,
    lowStockProducts,
    revenueGrowth,
    newUsersThisMonth,
  });
});