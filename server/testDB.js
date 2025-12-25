const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config/config.env' });

const testConnection = async () => {
  try {
    console.log('🔄 Testing database connection...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shopmate_db',
      port: process.env.DB_PORT || 3306
    });

    // Get current database name
    const [result] = await connection.execute('SELECT DATABASE() as current_db');
    const currentDB = result[0].current_db;

    console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
    console.log(`🗄️  CONNECTED TO DATABASE: ${currentDB}`);
    console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
    console.log(`🔌 Port: ${process.env.DB_PORT || 3306}`);
    
    await connection.end();
    
  } catch (error) {
    console.log('❌ DATABASE CONNECTION FAILED!');
    console.log(`Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 MySQL server is not running. Start MySQL service.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database does not exist. Create "shopmate_db" database.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Wrong username/password. Check your credentials.');
    }
  }
};

testConnection();