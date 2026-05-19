/* ============================================================
   CREATE ADMIN ACCOUNT
   Run this once to create the default admin account
   Usage: node create-admin.js
============================================================ */

const bcrypt = require('bcrypt');
const db = require('./db');

async function createAdmin() {
  try {
    const username = 'admin';
    const password = 'admin123';
    const email = 'admin@pchaven.com';

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert admin
    await db.query(
      'INSERT INTO admins (username, password, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?',
      [username, hashedPassword, email, hashedPassword]
    );

    console.log('✅ Admin account created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
