import database from './database/db.js';

async function addAllCategoryProducts() {
  try {
    const userResult = await database.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['Admin']);
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    const allProducts = [
      // CLOTHING & FASHION
      { name: 'Nike Air Max Sneakers', description: 'Comfortable running shoes with air cushioning technology.', price: 129.99, category: 'Clothing', stock: 45, images: '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"]' },
      { name: 'Levi\'s 501 Jeans', description: 'Classic straight-fit denim jeans in vintage wash.', price: 89.99, category: 'Clothing', stock: 60, images: '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"]' },
      { name: 'Adidas Hoodie', description: 'Comfortable cotton blend hoodie with kangaroo pocket.', price: 59.99, category: 'Clothing', stock: 40, images: '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"]' },

      // HOME & GARDEN
      { name: 'IKEA Sofa Set', description: '3-seater fabric sofa with removable covers and storage.', price: 699.99, category: 'Home & Garden', stock: 8, images: '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"]' },
      { name: 'Dining Table Set', description: 'Wooden dining table with 6 chairs, perfect for family meals.', price: 899.99, category: 'Home & Garden', stock: 5, images: '["https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=500"]' },
      { name: 'Garden Tool Set', description: 'Complete 10-piece gardening tool set with carrying case.', price: 79.99, category: 'Home & Garden', stock: 25, images: '["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500"]' },

      // BOOKS & MEDIA
      { name: 'The Great Gatsby', description: 'Classic American novel by F. Scott Fitzgerald - Hardcover edition.', price: 24.99, category: 'Books', stock: 100, images: '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"]' },
      { name: 'Programming Book Set', description: 'Complete guide to modern web development - 3 book collection.', price: 149.99, category: 'Books', stock: 30, images: '["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"]' },
      { name: 'Vinyl Record Collection', description: 'Classic rock vinyl records - Set of 5 albums.', price: 199.99, category: 'Books', stock: 15, images: '["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"]' },

      // SPORTS & OUTDOORS
      { name: 'Mountain Bike', description: '21-speed mountain bike with aluminum frame and disc brakes.', price: 599.99, category: 'Sports', stock: 12, images: '["https://images.unsplash.com/photo-1544191696-15693072e0b5?w=500"]' },
      { name: 'Yoga Mat Set', description: 'Premium yoga mat with blocks, strap, and carrying bag.', price: 49.99, category: 'Sports', stock: 50, images: '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"]' },
      { name: 'Camping Tent', description: '4-person waterproof camping tent with easy setup.', price: 199.99, category: 'Sports', stock: 20, images: '["https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500"]' },

      // HEALTH & BEAUTY
      { name: 'Skincare Set', description: 'Complete 5-step skincare routine with natural ingredients.', price: 89.99, category: 'Beauty', stock: 35, images: '["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"]' },
      { name: 'Electric Toothbrush', description: 'Rechargeable electric toothbrush with 3 cleaning modes.', price: 79.99, category: 'Beauty', stock: 40, images: '["https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500"]' },
      { name: 'Hair Dryer Pro', description: 'Professional ionic hair dryer with multiple heat settings.', price: 129.99, category: 'Beauty', stock: 25, images: '["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500"]' },

      // AUTOMOTIVE
      { name: 'Car Phone Mount', description: 'Universal magnetic car phone holder with 360° rotation.', price: 29.99, category: 'Automotive', stock: 80, images: '["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500"]' },
      { name: 'Car Dash Cam', description: 'HD dashboard camera with night vision and loop recording.', price: 149.99, category: 'Automotive', stock: 30, images: '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"]' },
      { name: 'Car Care Kit', description: 'Complete car cleaning and detailing kit with 15 items.', price: 69.99, category: 'Automotive', stock: 45, images: '["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500"]' },

      // TOYS & GAMES
      { name: 'LEGO Creator Set', description: 'Advanced LEGO building set with 1000+ pieces for ages 12+.', price: 199.99, category: 'Toys', stock: 25, images: '["https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500"]' },
      { name: 'Board Game Collection', description: 'Family board game bundle with 5 popular games.', price: 89.99, category: 'Toys', stock: 35, images: '["https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500"]' },
      { name: 'Remote Control Drone', description: 'HD camera drone with GPS and 30-minute flight time.', price: 299.99, category: 'Toys', stock: 18, images: '["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500"]' },

      // JEWELRY & WATCHES
      { name: 'Diamond Necklace', description: 'Elegant sterling silver necklace with cubic zirconia pendant.', price: 199.99, category: 'Jewelry', stock: 15, images: '["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500"]' },
      { name: 'Luxury Watch', description: 'Stainless steel automatic watch with leather strap.', price: 599.99, category: 'Jewelry', stock: 10, images: '["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500"]' },
      { name: 'Gold Earrings', description: '14k gold plated stud earrings with crystal accents.', price: 79.99, category: 'Jewelry', stock: 30, images: '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"]' },

      // KITCHEN & APPLIANCES
      { name: 'Coffee Machine', description: 'Automatic espresso machine with milk frother and grinder.', price: 399.99, category: 'Kitchen', stock: 20, images: '["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500"]' },
      { name: 'Air Fryer', description: 'Large capacity air fryer with digital controls and recipes.', price: 149.99, category: 'Kitchen', stock: 35, images: '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"]' },
      { name: 'Knife Set', description: 'Professional 8-piece kitchen knife set with wooden block.', price: 199.99, category: 'Kitchen', stock: 25, images: '["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500"]' },

      // OFFICE SUPPLIES
      { name: 'Office Desk Organizer', description: 'Bamboo desk organizer with multiple compartments.', price: 39.99, category: 'Office', stock: 50, images: '["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500"]' },
      { name: 'Printer All-in-One', description: 'Wireless color printer with scanner and copier functions.', price: 299.99, category: 'Office', stock: 15, images: '["https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500"]' },
      { name: 'Ergonomic Keyboard', description: 'Wireless ergonomic keyboard with wrist rest and backlight.', price: 89.99, category: 'Office', stock: 40, images: '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"]' }
    ];

    console.log('Adding products across all categories...');
    
    for (const product of allProducts) {
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
        Math.random() * 2 + 3
      ]);
      console.log(`✅ Added: ${product.name} (${product.category})`);
    }

    console.log(`\n🎉 Successfully added ${allProducts.length} products across all categories!`);
    
    const result = await database.query('SELECT COUNT(*) as count FROM products');
    console.log(`📦 Total products in database: ${result.rows[0].count}`);
    
    const categories = await database.query('SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY category');
    console.log('\n📂 Products by category:');
    categories.rows.forEach(cat => console.log(`   - ${cat.category}: ${cat.count} products`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

addAllCategoryProducts();