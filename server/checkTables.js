import database from './database/db.js';

async function checkTables() {
  try {
    const result = await database.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables in database:');
    result.rows.forEach(row => {
      console.log('- ' + row.table_name);
    });
    
    if (result.rows.length === 0) {
      console.log('No tables found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking tables:', error);
    process.exit(1);
  }
}

checkTables();