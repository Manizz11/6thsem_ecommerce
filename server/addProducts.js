import database from './database/db.js';

async function addSampleProducts() {
  try {
    // First, create a sample user to be the creator
    const userResult = await database.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ('Admin User', 'admin@example.com', 'hashedpassword', 'Admin') 
      ON CONFLICT (email) DO NOTHING 
      RETURNING id
    `);
    
    let userId;
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id;
    } else {
      const existingUser = await database.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
      userId = existingUser.rows[0].id;
    }

    const products = [
      {
        name: 'Wireless Gaming Headset',
        description: 'High-quality wireless gaming headset with 7.1 surround sound and noise cancellation.',
        price: 89.99,
        category: 'Electronics',
        stock: 50,
        images: '["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"]'
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable ergonomic office chair with lumbar support and adjustable height.',
        price: 299.99,
        category: 'Furniture',
        stock: 25,
        images: '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"]'
      },
      {
        name: 'Wireless Mouse',
        description: 'Precision wireless mouse with RGB lighting and programmable buttons.',
        price: 49.99,
        category: 'Electronics',
        stock: 100,
        images: '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"]'
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with blue switches and customizable backlighting.',
        price: 129.99,
        category: 'Electronics',
        stock: 75,
        images: '["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500"]'
      },
      {
        name: 'Standing Desk',
        description: 'Adjustable height standing desk with electric motor and memory presets.',
        price: 399.99,
        category: 'Furniture',
        stock: 15,
        images: '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"]'
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
        Math.random() * 2 + 3 // Random rating between 3-5
      ]);
    }

    console.log('✅ Successfully added 5 sample products to the database');
    
    // Verify products were added
    const result = await database.query('SELECT COUNT(*) as count FROM products');
    console.log(`Total products in database: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

addSampleProducts();