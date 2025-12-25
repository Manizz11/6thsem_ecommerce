import database from './database/db.js';

async function updateProducts() {
  try {
    // Clear existing products
    await database.query('DELETE FROM products');
    
    // Get admin user
    const userResult = await database.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
    const userId = userResult.rows[0].id;

    const products = [
      {
        name: 'AirPods Pro Max',
        description: 'Premium wireless headphones with active noise cancellation, spatial audio, and premium build quality. Perfect for audiophiles and professionals.',
        price: 7999.00,
        category: 'Electronics',
        stock: 25,
        images: '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"]'
      },
      {
        name: 'MacBook Pro 14"',
        description: 'Powerful laptop with M2 chip, stunning Retina display, and all-day battery life. Ideal for creative professionals and developers.',
        price: 189999.00,
        category: 'Electronics',
        stock: 15,
        images: '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop"]'
      },
      {
        name: 'Herman Miller Aeron Chair',
        description: 'Ergonomic office chair with premium materials, adjustable lumbar support, and breathable mesh design for maximum comfort.',
        price: 45999.00,
        category: 'Furniture',
        stock: 12,
        images: '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop"]'
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Latest flagship smartphone with titanium design, advanced camera system, and powerful A17 Pro chip for exceptional performance.',
        price: 134999.00,
        category: 'Electronics',
        stock: 30,
        images: '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop"]'
      },
      {
        name: 'Minimalist Standing Desk',
        description: 'Electric height-adjustable desk with memory presets, cable management, and premium oak finish. Transform your workspace.',
        price: 29999.00,
        category: 'Furniture',
        stock: 18,
        images: '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop"]'
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling headphones with exceptional sound quality, 30-hour battery life, and premium comfort.',
        price: 24999.00,
        category: 'Electronics',
        stock: 40,
        images: '["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop"]'
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Advanced wireless mouse with precision tracking, customizable buttons, and ergonomic design for productivity professionals.',
        price: 8999.00,
        category: 'Electronics',
        stock: 50,
        images: '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop"]'
      },
      {
        name: 'Keychron K8 Mechanical Keyboard',
        description: 'Premium wireless mechanical keyboard with hot-swappable switches, RGB backlighting, and Mac/Windows compatibility.',
        price: 12999.00,
        category: 'Electronics',
        stock: 35,
        images: '["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop"]'
      }
    ];

    for (const product of products) {
      await database.query(`
        INSERT INTO products (name, description, price, category, stock, images, created_by, ratings)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
      `, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.stock,
        product.images,
        userId,
        (Math.random() * 1.5 + 3.5).toFixed(1) // Random rating between 3.5-5.0
      ]);
    }

    console.log('✅ Successfully updated products with premium theme');
    
    const result = await database.query('SELECT COUNT(*) as count FROM products');
    console.log(`Total products in database: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating products:', error);
    process.exit(1);
  }
}

updateProducts();