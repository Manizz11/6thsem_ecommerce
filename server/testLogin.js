const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './config/config.env' });

const testAdminLogin = async () => {
  try {
    console.log('🔄 Testing admin login process...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'shopmate_db',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Database connected');

    // Test credentials
    const testEmail = 'admin@shopmate.com';
    const testPassword = 'admin123';

    console.log(`\n🔍 Searching for user with email: ${testEmail}`);
    
    // Step 1: Check if user exists
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [testEmail]
    );

    if (users.length === 0) {
      console.log('❌ No user found with this email!');
      console.log('💡 Creating admin user...');
      
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', testEmail, hashedPassword, 'Admin']
      );
      
      console.log('✅ Admin user created!');
      
      // Get the newly created user
      const [newUsers] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [testEmail]
      );
      
      if (newUsers.length > 0) {
        console.log('✅ Admin user found after creation');
        console.log(`👤 User ID: ${newUsers[0].id}`);
        console.log(`📧 Email: ${newUsers[0].email}`);
        console.log(`🔑 Role: ${newUsers[0].role || 'User'}`);
      }
    } else {
      console.log('✅ User found in database!');
      const user = users[0];
      console.log(`👤 User ID: ${user.id}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔑 Role: ${user.role || 'User'}`);
      
      // Step 2: Test password
      console.log(`\n🔐 Testing password: ${testPassword}`);
      
      const isPasswordMatch = await bcrypt.compare(testPassword, user.password);
      
      if (isPasswordMatch) {
        console.log('✅ PASSWORD CORRECT! Login should work');
        
        if (user.role === 'Admin') {
          console.log('✅ User has Admin role - can access dashboard');
        } else {
          console.log('⚠️  User role is not Admin - may not access dashboard');
          console.log('💡 Updating user role to Admin...');
          
          await connection.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            ['Admin', user.id]
          );
          
          console.log('✅ User role updated to Admin');
        }
      } else {
        console.log('❌ PASSWORD INCORRECT!');
        console.log('💡 Updating password...');
        
        const newHashedPassword = await bcrypt.hash(testPassword, 10);
        
        await connection.execute(
          'UPDATE users SET password = ?, role = ? WHERE id = ?',
          [newHashedPassword, 'Admin', user.id]
        );
        
        console.log('✅ Password and role updated');
      }
    }

    console.log('\n🎉 LOGIN TEST COMPLETE!');
    console.log('📧 Email: admin@shopmate.com');
    console.log('🔐 Password: admin123');
    console.log('🚀 Try logging in now!');

    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testAdminLogin();