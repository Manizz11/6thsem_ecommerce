const mysql = require('mysql2/promise');

const testYourConfig = async () => {
  try {
    console.log('🔄 Testing YOUR database config...');
    console.log('📋 Config:');
    console.log('   Host: localhost');
    console.log('   User: root');
    console.log('   Password: (empty)');
    console.log('   Database: shopmate_db');
    console.log('   Port: 3306');
    console.log('');

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'shopmate_db',
      port: 3306
    });

    const [result] = await connection.execute('SELECT DATABASE() as current_db');
    
    console.log('✅ SUCCESS! Connected to database: ' + result[0].current_db);
    
    await connection.end();
    
  } catch (error) {
    console.log('❌ FAILED! Error: ' + error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 MySQL server is not running');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database "shopmate_db" does not exist');
    }
  }
};

testYourConfig();