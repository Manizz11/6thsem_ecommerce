import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import database from "../database/db.js";
import { getAIRecommendation } from "../utils/getAIRecommendation.js";

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const created_by = req.user.id;

  if (!name || !description || !price || !category || !stock) {
    return next(new ErrorHandler("Please provide complete product details.", 400));
  }

  let uploadedImages = [];
  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Ecommerce_Product_Images",
        width: 1000,
        crop: "scale",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  const [product] = await database.execute(
    `INSERT INTO products (name, description, price, category_id, stock, images) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, description, price / 283, category, stock, JSON.stringify(uploadedImages)]
  );

  const [newProduct] = await database.execute(
    "SELECT * FROM products WHERE id = ?",
    [product.insertId]
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    product: newProduct[0],
  });
});

export const fetchAllProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const { availability, price, category, ratings, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const conditions = [];
    let values = [];

    // Filter products by availability
    if (availability === "in-stock") {
      conditions.push(`stock > 5`);
    } else if (availability === "limited") {
      conditions.push(`stock > 0 AND stock <= 5`);
    } else if (availability === "out-of-stock") {
      conditions.push(`stock = 0`);
    }

    // Filter products by price
    if (price) {
      const [minPrice, maxPrice] = price.split("-");
      if (minPrice && maxPrice) {
        conditions.push(`price BETWEEN ? AND ?`);
        values.push(minPrice, maxPrice);
      }
    }

    // Filter products by category
    if (category) {
      conditions.push(`category_id = ?`);
      values.push(category);
    }

    // Add search query
    if (search) {
      conditions.push(`(name LIKE ? OR description LIKE ?)`);
      values.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get count of filtered products
    const [totalProductsResult] = await database.execute(
      `SELECT COUNT(*) as count FROM products ${whereClause}`,
      values
    );

    const totalProducts = parseInt(totalProductsResult[0].count);

    // Fetch products with pagination
    const [result] = await database.execute(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    // Parse images for each product
    const productsWithImages = result.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    // Fetch new products (last 30 days)
    const [newProductsResult] = await database.execute(`
      SELECT * FROM products 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ORDER BY created_at DESC
      LIMIT 8
    `);

    // Fetch top rated products
    const [topRatedResult] = await database.execute(`
      SELECT * FROM products 
      ORDER BY created_at DESC
      LIMIT 8
    `);

    res.status(200).json({
      success: true,
      products: productsWithImages,
      totalProducts,
      newProducts: newProductsResult.map(p => ({...p, images: p.images ? JSON.parse(p.images) : []})),
      topRatedProducts: topRatedResult.map(p => ({...p, images: p.images ? JSON.parse(p.images) : []})),
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    return next(new ErrorHandler("Please provide complete product details.", 400));
  }

  const [product] = await database.execute("SELECT * FROM products WHERE id = ?", [productId]);
  if (product.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  await database.execute(
    `UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock = ? WHERE id = ?`,
    [name, description, price / 283, category, stock, productId]
  );

  const [result] = await database.execute("SELECT * FROM products WHERE id = ?", [productId]);

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    updatedProduct: result[0],
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const [product] = await database.execute("SELECT * FROM products WHERE id = ?", [productId]);
  if (product.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const images = product[0].images ? JSON.parse(product[0].images) : [];

  await database.execute("DELETE FROM products WHERE id = ?", [productId]);

  // Delete images from Cloudinary
  if (images && images.length > 0) {
    for (const image of images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});

export const fetchSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  try {
    const [product] = await database.execute(
      `SELECT * FROM products WHERE id = ?`,
      [productId]
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    // Get reviews for this product
    const [reviews] = await database.execute(
      `SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar 
       FROM reviews r 
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = ?`,
      [productId]
    );

    const productWithReviews = {
      ...product[0],
      images: product[0].images ? JSON.parse(product[0].images) : [],
      reviews: reviews.map(review => ({
        review_id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewer: {
          id: review.user_id,
          name: review.reviewer_name,
          avatar: review.reviewer_avatar ? JSON.parse(review.reviewer_avatar) : null
        }
      }))
    };

    res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      product: productWithReviews,
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message
    });
  }
});

export const postProductReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  
  if (!rating || !comment) {
    return next(new ErrorHandler("Please provide rating and comment.", 400));
  }

  // Check if user has purchased this product
  const [purchaseCheck] = await database.execute(`
    SELECT oi.product_id
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN payments p ON p.order_id = o.id
    WHERE o.user_id = ?
    AND oi.product_id = ?
    AND p.payment_status = 'Completed'
    LIMIT 1 
  `, [req.user.id, productId]);

  if (purchaseCheck.length === 0) {
    return res.status(403).json({
      success: false,
      message: "You can only review a product you've purchased.",
    });
  }

  const [product] = await database.execute("SELECT * FROM products WHERE id = ?", [productId]);
  if (product.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const [isAlreadyReviewed] = await database.execute(
    `SELECT * FROM reviews WHERE product_id = ? AND user_id = ?`,
    [productId, req.user.id]
  );

  if (isAlreadyReviewed.length > 0) {
    await database.execute(
      "UPDATE reviews SET rating = ?, comment = ? WHERE product_id = ? AND user_id = ?",
      [rating, comment, productId, req.user.id]
    );
  } else {
    await database.execute(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [productId, req.user.id, rating, comment]
    );
  }

  // Update product average rating
  const [allReviews] = await database.execute(
    `SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = ?`,
    [productId]
  );

  const newAvgRating = allReviews[0].avg_rating;

  await database.execute(
    `UPDATE products SET ratings = ? WHERE id = ?`,
    [newAvgRating, productId]
  );

  const [updatedProduct] = await database.execute(
    `SELECT * FROM products WHERE id = ?`,
    [productId]
  );

  res.status(200).json({
    success: true,
    message: "Review posted.",
    product: updatedProduct[0],
  });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  
  const [review] = await database.execute(
    "SELECT * FROM reviews WHERE product_id = ? AND user_id = ?",
    [productId, req.user.id]
  );

  if (review.length === 0) {
    return next(new ErrorHandler("Review not found.", 404));
  }

  await database.execute(
    "DELETE FROM reviews WHERE product_id = ? AND user_id = ?",
    [productId, req.user.id]
  );

  // Update product average rating
  const [allReviews] = await database.execute(
    `SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = ?`,
    [productId]
  );

  const newAvgRating = allReviews[0].avg_rating || 0;

  await database.execute(
    `UPDATE products SET ratings = ? WHERE id = ?`,
    [newAvgRating, productId]
  );

  const [updatedProduct] = await database.execute(
    `SELECT * FROM products WHERE id = ?`,
    [productId]
  );

  res.status(200).json({
    success: true,
    message: "Your review has been deleted.",
    product: updatedProduct[0],
  });
});

export const fetchAIFilteredProducts = catchAsyncErrors(async (req, res, next) => {
  const { userPrompt } = req.body;
  if (!userPrompt) {
    return next(new ErrorHandler("Provide a valid prompt.", 400));
  }

  const filterKeywords = (query) => {
    const stopWords = new Set([
      "the", "they", "them", "then", "I", "we", "you", "he", "she", "it", "is", "a", "an", "of", "and", "or", "to", "for", "from", "on", "who", "whom", "why", "when", "which", "with", "this", "that", "in", "at", "by", "be", "not", "was", "were", "has", "have", "had", "do", "does", "did", "so", "some", "any", "how", "can", "could", "should", "would", "there", "here", "just", "than", "because", "but", "its", "it's", "if", ".", ",", "!", "?", ">", "<", ";", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    ]);

    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => !stopWords.has(word))
      .map((word) => `%${word}%`);
  };

  const keywords = filterKeywords(userPrompt);
  const placeholders = keywords.map(() => 'name LIKE ? OR description LIKE ?').join(' OR ');
  const values = keywords.flatMap(keyword => [keyword, keyword]);

  const [result] = await database.execute(
    `SELECT * FROM products WHERE ${placeholders} LIMIT 200`,
    values
  );

  const filteredProducts = result;

  if (filteredProducts.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No products found matching your prompt.",
      products: [],
    });
  }

  // AI FILTERING (if getAIRecommendation function exists)
  try {
    const { success, products } = await getAIRecommendation(req, res, userPrompt, filteredProducts);
    
    res.status(200).json({
      success: success,
      message: "AI filtered products.",
      products,
    });
  } catch (error) {
    // Fallback to basic filtering if AI recommendation fails
    res.status(200).json({
      success: true,
      message: "Products filtered.",
      products: filteredProducts,
    });
  }
});