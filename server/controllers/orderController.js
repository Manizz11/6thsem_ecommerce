import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

export const placeNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    full_name,
    state,
    city,
    country,
    address,
    pincode,
    phone,
    orderedItems,
  } = req.body;
  
  if (!full_name || !state || !city || !country || !address || !pincode || !phone) {
    return next(new ErrorHandler("Please provide complete shipping details.", 400));
  }

  const items = Array.isArray(orderedItems) ? orderedItems : JSON.parse(orderedItems);

  if (!items || items.length === 0) {
    return next(new ErrorHandler("No items in cart.", 400));
  }

  const productIds = items.map((item) => item.product.id);
  const placeholders = productIds.map(() => '?').join(',');
  
  const [products] = await database.execute(
    `SELECT id, price, stock, name FROM products WHERE id IN (${placeholders})`,
    productIds
  );

  let total_price = 0;
  const orderItems = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.product.id);

    if (!product) {
      return next(new ErrorHandler(`Product not found for ID: ${item.product.id}`, 404));
    }

    if (item.quantity > product.stock) {
      return next(new ErrorHandler(`Only ${product.stock} units available for ${product.name}`, 400));
    }

    const itemTotal = product.price * item.quantity;
    total_price += itemTotal;

    orderItems.push({
      product_id: product.id,
      quantity: item.quantity,
      price: product.price,
      image: item.product.images[0]?.url || "",
      title: product.name
    });
  }

  const tax_price = 0.18;
  const shipping_price = total_price >= 50 ? 0 : 2;
  total_price = Math.round(total_price + total_price * tax_price + shipping_price);

  const [orderResult] = await database.execute(
    `INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price) VALUES (?, ?, ?, ?)`,
    [req.user.id, total_price, tax_price, shipping_price]
  );

  const orderId = orderResult.insertId;

  // Insert order items
  for (const item of orderItems) {
    await database.execute(
      `INSERT INTO order_items (order_id, product_id, quantity, price, image, title) VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, item.product_id, item.quantity, item.price, item.image, item.title]
    );
  }

  // Insert shipping info
  await database.execute(
    `INSERT INTO shipping_info (order_id, full_name, state, city, country, address, pincode, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [orderId, full_name, state, city, country, address, pincode, phone]
  );

  res.status(200).json({
    success: true,
    message: "Order placed successfully.",
    orderId,
    total_price,
  });
});

export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  
  const [orders] = await database.execute(
    `SELECT * FROM orders WHERE id = ?`,
    [orderId]
  );

  if (orders.length === 0) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  const [orderItems] = await database.execute(
    `SELECT * FROM order_items WHERE order_id = ?`,
    [orderId]
  );

  const [shippingInfo] = await database.execute(
    `SELECT * FROM shipping_info WHERE order_id = ?`,
    [orderId]
  );

  res.status(200).json({
    success: true,
    message: "Order fetched.",
    order: {
      ...orders[0],
      order_items: orderItems,
      shipping_info: shippingInfo[0] || null
    },
  });
});

export const fetchMyOrders = catchAsyncErrors(async (req, res, next) => {
  const [orders] = await database.execute(
    `SELECT * FROM orders WHERE buyer_id = ? AND paid_at IS NOT NULL ORDER BY created_at DESC`,
    [req.user.id]
  );

  const ordersWithItems = [];
  for (const order of orders) {
    const [orderItems] = await database.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    );
    
    const [shippingInfo] = await database.execute(
      `SELECT * FROM shipping_info WHERE order_id = ?`,
      [order.id]
    );

    ordersWithItems.push({
      ...order,
      order_items: orderItems,
      shipping_info: shippingInfo[0] || null
    });
  }

  res.status(200).json({
    success: true,
    message: "All your orders are fetched.",
    myOrders: ordersWithItems,
  });
});

export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
  const [orders] = await database.execute(
    `SELECT * FROM orders WHERE paid_at IS NOT NULL ORDER BY created_at DESC`
  );

  const ordersWithItems = [];
  for (const order of orders) {
    const [orderItems] = await database.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    );
    
    const [shippingInfo] = await database.execute(
      `SELECT * FROM shipping_info WHERE order_id = ?`,
      [order.id]
    );

    ordersWithItems.push({
      ...order,
      order_items: orderItems,
      shipping_info: shippingInfo[0] || null
    });
  }

  res.status(200).json({
    success: true,
    message: "All orders fetched.",
    orders: ordersWithItems,
  });
});

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  if (!status) {
    return next(new ErrorHandler("Provide a valid status for order.", 400));
  }
  
  const { orderId } = req.params;
  const [results] = await database.execute(
    `SELECT * FROM orders WHERE id = ?`,
    [orderId]
  );

  if (results.length === 0) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  await database.execute(
    `UPDATE orders SET order_status = ? WHERE id = ?`,
    [status, orderId]
  );

  const [updatedOrder] = await database.execute(
    `SELECT * FROM orders WHERE id = ?`,
    [orderId]
  );

  res.status(200).json({
    success: true,
    message: "Order status updated.",
    updatedOrder: updatedOrder[0],
  });
});

export const confirmPayment = catchAsyncErrors(async (req, res, next) => {
  const { orderId, paymentIntentId } = req.body;

  if (!orderId || !paymentIntentId) {
    return next(new ErrorHandler("Order ID and Payment Intent ID are required.", 400));
  }

  const [result] = await database.execute(
    "UPDATE orders SET paid_at = NOW() WHERE id = ?",
    [orderId]
  );

  if (result.affectedRows === 0) {
    return next(new ErrorHandler("Order not found.", 404));
  }

  await database.execute(
    "UPDATE payments SET payment_status = ? WHERE order_id = ?",
    ["Completed", orderId]
  );

  const [order] = await database.execute(
    "SELECT * FROM orders WHERE id = ?",
    [orderId]
  );

  res.status(200).json({
    success: true,
    message: "Payment confirmed successfully.",
    order: order[0],
  });
});

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  
  const [results] = await database.execute(
    `SELECT * FROM orders WHERE id = ?`,
    [orderId]
  );
  
  if (results.length === 0) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  await database.execute(
    `DELETE FROM orders WHERE id = ?`,
    [orderId]
  );

  res.status(200).json({
    success: true,
    message: "Order deleted.",
    order: results[0],
  });
});