import database from './database/db.js';

async function addMoreProducts() {
  try {
    // Get existing admin user
    const userResult = await database.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['Admin']);
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    const newProducts = [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
        price: 999.99,
        category: 'Smartphones',
        stock: 30,
        images: '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"]'
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features.',
        price: 1199.99,
        category: 'Smartphones',
        stock: 25,
        images: '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"]'
      },
      {
        name: 'MacBook Pro 14"',
        description: 'Powerful laptop with M3 chip, Liquid Retina XDR display, and all-day battery.',
        price: 1999.99,
        category: 'Laptops',
        stock: 15,
        images: '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"]'
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-portable laptop with Intel Core i7, 16GB RAM, and premium build quality.',
        price: 1299.99,
        category: 'Laptops',
        stock: 20,
        images: '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"]'
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones with 30-hour battery.',
        price: 399.99,
        category: 'Audio',
        stock: 40,
        images: '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"]'
      },
      {
        name: 'AirPods Pro 2',
        description: 'Active noise cancellation, spatial audio, and adaptive transparency.',
        price: 249.99,
        category: 'Audio',
        stock: 60,
        images: '["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500"]'
      },
      {
        name: 'iPad Air 5th Gen',
        description: 'Powerful tablet with M1 chip, 10.9-inch display, and Apple Pencil support.',
        price: 599.99,
        category: 'Tablets',
        stock: 35,
        images: '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"]'
      },
      {
        name: 'Samsung Galaxy Tab S9',
        description: 'Premium Android tablet with S Pen, AMOLED display, and DeX mode.',
        price: 799.99,
        category: 'Tablets',
        stock: 28,
        images: '["https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500"]'
      },
      {
        name: 'Apple Watch Series 9',
        description: 'Advanced smartwatch with health monitoring, GPS, and cellular connectivity.',
        price: 399.99,
        category: 'Wearables',
        stock: 45,
        images: '["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500"]'
      },
      {
        name: 'Fitbit Charge 6',
        description: 'Fitness tracker with heart rate monitoring, GPS, and 7-day battery life.',
        price: 159.99,
        category: 'Wearables',
        stock: 55,
        images: '["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500"]'
      },
      {
        name: 'Nintendo Switch OLED',
        description: 'Portable gaming console with vibrant OLED screen and enhanced audio.',
        price: 349.99,
        category: 'Gaming',
        stock: 40,
        images: '["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500"]'
      },
      {
        name: 'PlayStation 5',
        description: 'Next-gen gaming console with ultra-fast SSD and ray tracing support.',
        price: 499.99,
        category: 'Gaming',
        stock: 12,
        images: '["https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500"]'
      },
      {
        name: 'LG 27" 4K Monitor',
        description: 'Ultra HD monitor with HDR10 support, USB-C connectivity, and ergonomic stand.',
        price: 449.99,
        category: 'Monitors',
        stock: 22,
        images: '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"]'
      },
      {
        name: 'ASUS ROG Gaming Monitor',
        description: '27" 144Hz gaming monitor with G-Sync, 1ms response time, and RGB lighting.',
        price: 599.99,
        category: 'Monitors',
        stock: 18,
        images: '["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500"]'
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Premium wireless mouse with ultra-fast scrolling and multi-device connectivity.',
        price: 99.99,
        category: 'Accessories',
        stock: 65,
        images: '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"]'
      }
    ];

    console.log('Adding new products to database...');
    
    for (const product of newProducts) {
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
        Math.random() * 2 + 3 // Random rating between 3-5
      ]);
      console.log(`✅ Added: ${product.name}`);
    }

    console.log(`\n🎉 Successfully added ${newProducts.length} new products!`);
    
    // Show updated count
    const result = await database.query('SELECT COUNT(*) as count FROM products');
    console.log(`📦 Total products in database: ${result.rows[0].count}`);
    
    // Show categories
    const categories = await database.query('SELECT DISTINCT category FROM products ORDER BY category');
    console.log('\n📂 Available categories:');
    categories.rows.forEach(cat => console.log(`   - ${cat.category}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

addMoreProducts();