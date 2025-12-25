const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './config/config.env' });

const createAdminTable = async () => {
  try {
    // Create database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to MySQL database');

    // Create admin table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'SuperAdmin') DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Admin table created successfully');

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Check if admin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT * FROM admins WHERE email = ?',
      ['admin@shopmate.com']
    );

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists!');
    } else {
      // Insert admin user
      await connection.execute(
        'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@shopmate.com', hashedPassword, 'Admin']
      );

      console.log('✅ Admin user created successfully!');
    }

    // Display admin details
    const [admins] = await connection.execute('SELECT id, name, email, role, created_at FROM admins');
    console.log('\n📋 Admin Users:');
    console.table(admins);

    console.log('\n🔑 Login Credentials:');
    console.log('📧 Email: admin@shopmate.com');
    console.log('🔐 Password: admin123');

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

createAdminTable();