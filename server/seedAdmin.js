const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './config/config.env' });

const createAdminUser = async () => {
  try {
    // Create database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('Connected to MySQL database');

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Check if admin user already exists
    const [existingUser] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@shopmate.com']
    );

    if (existingUser.length > 0) {
      console.log('Admin user already exists!');
      await connection.end();
      return;
    }

    // Insert admin user
    const [result] = await connection.execute(
      `INSERT INTO users (name, email, password, role, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      ['Admin User', 'admin@shopmate.com', hashedPassword, 'Admin']
    );

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@shopmate.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: Admin');

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

createAdminUser();