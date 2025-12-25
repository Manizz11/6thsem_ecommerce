import database from './database/db.js';

async function checkProducts() {
  try {
    const result = await database.query('SELECT COUNT(*) as count FROM products');
    const productCount = result.rows[0].count;
    
    console.log(`Total products in database: ${productCount}`);
    
    if (productCount > 0) {
      const products = await database.query('SELECT id, name, price, category FROM products LIMIT 5');
      console.log('\nFirst 5 products:');
      products.rows.forEach(product => {
        console.log(`- ${product.name} ($${product.price}) - ${product.category}`);
      });
    } else {
      console.log('No products found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking products:', error);
    process.exit(1);
  }
}

checkProducts();