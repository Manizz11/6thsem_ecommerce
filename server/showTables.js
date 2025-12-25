const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config/config.env' });

const showDatabaseTables = async () => {
  try {
    console.log('🔄 Connecting to XAMPP MySQL...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shopmate_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to XAMPP MySQL successfully!');
    console.log(`📍 Database: ${process.env.DB_NAME || 'shopmate_db'}`);
    console.log('');

    // Show all tables
    console.log('📋 DATABASE TABLES:');
    console.log('==================');
    
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('❌ No tables found in database');
      await connection.end();
      return;
    }

    // Display each table with row count
    for (let i = 0; i < tables.length; i++) {
      const tableName = Object.values(tables[i])[0];
      
      // Get row count
      const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      const rowCount = countResult[0].count;
      
      console.log(`${i + 1}. ${tableName} (${rowCount} rows)`);
    }

    console.log('');
    console.log('🔍 TABLE STRUCTURES:');
    console.log('====================');

    // Show structure of each table
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n📊 Table: ${tableName.toUpperCase()}`);
      console.log('-'.repeat(50));
      
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      
      columns.forEach(col => {
        console.log(`  ${col.Field} | ${col.Type} | ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} | ${col.Key || ''}`);
      });
    }

    await connection.end();
    console.log('\n✅ Database inspection complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure XAMPP MySQL is running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database "shopmate_db" does not exist');
    }
  }
};

showDatabaseTables();