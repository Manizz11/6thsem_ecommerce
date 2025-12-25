const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config/config.env' });

const checkDatabase = async () => {
  try {
    console.log('🔄 Testing MySQL database connection...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shopmate_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
    console.log(`📍 Database: ${process.env.DB_NAME || 'shopmate_db'}`);
    console.log('');

    // Show all tables
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('❌ NO TABLES FOUND');
      await connection.end();
      return;
    }

    console.log('📋 ALL DATABASE TABLES:');
    console.log('======================');
    
    for (let i = 0; i < tables.length; i++) {
      const tableName = Object.values(tables[i])[0];
      
      // Get row count
      const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      const rowCount = countResult[0].count;
      
      console.log(`${i + 1}. ${tableName} (${rowCount} rows)`);
    }

    console.log('\n🔍 TABLE DETAILS:');
    console.log('=================');

    // Show structure of each table
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n📊 ${tableName.toUpperCase()}:`);
      
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      
      columns.forEach(col => {
        console.log(`  • ${col.Field} | ${col.Type} | ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    }

    await connection.end();
    console.log('\n✅ Database check complete!');
    
  } catch (error) {
    console.error('❌ DATABASE CONNECTION FAILED!');
    console.error(`Error: ${error.message}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Start XAMPP MySQL service');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Create "shopmate_db" database in phpMyAdmin');
    }
  }
};

checkDatabase();