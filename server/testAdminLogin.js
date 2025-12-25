const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './config/config.env' });

const testAdminLogin = async () => {
  let connection;
  
  try {
    console.log('🔄 Testing database connection...');
    
    // Test database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Database connection successful!');
    console.log(`📍 Connected to: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

    // Check if users table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'users'"
    );

    if (tables.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('💡 Creating users table...');
      
      await connection.execute(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('User', 'Admin') DEFAULT 'User',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      console.log('✅ Users table created!');
    }

    // Test admin credentials
    const testEmail = 'admin@shopmate.com';
    const testPassword = 'admin123';

    console.log('\n🔍 Checking for admin user...');
    
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [testEmail, 'Admin']
    );

    if (users.length === 0) {
      console.log('❌ Admin user not found! Creating admin user...');
      
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', testEmail, hashedPassword, 'Admin']
      );
      
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user found!');
    }

    // Verify login credentials
    console.log('\n🔐 Testing login credentials...');
    
    const [adminUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [testEmail, 'Admin']
    );

    if (adminUser.length > 0) {
      const user = adminUser[0];
      const passwordMatch = await bcrypt.compare(testPassword, user.password);
      
      if (passwordMatch) {
        console.log('✅ LOGIN SUCCESS!');
        console.log('🎉 Admin credentials are valid!');
        console.log('\n📋 Admin Details:');
        console.log(`👤 Name: ${user.name}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Role: ${user.role}`);
        console.log(`📅 Created: ${user.created_at}`);
        
        console.log('\n🚀 You can now login to admin panel with:');
        console.log(`📧 Email: ${testEmail}`);
        console.log(`🔐 Password: ${testPassword}`);
      } else {
        console.log('❌ LOGIN FAILED! Password does not match.');
      }
    } else {
      console.log('❌ LOGIN FAILED! Admin user not found.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure MySQL server is running on localhost:3306');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database "shopmate_db" does not exist. Please create it first.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Check your database credentials in config.env');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed.');
    }
  }
};

// Run the test
testAdminLogin();