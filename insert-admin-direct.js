/* ============================================================
   INSERT ADMIN DIRECTLY INTO RAILWAY DATABASE
   This bypasses SQL escaping issues
   Usage: node insert-admin-direct.js
============================================================ */

const bcrypt = require('bcrypt');
const db = require('./db');

async function insertAdmin() {
  try {
    const username = 'Talotalo';
    const email = 'Talotalo@pchaven.com';
    const password = 'WaesTakeOutOrTakeMe';

    console.log('🔐 Generating password hash...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Hash generated:', hashedPassword);
    console.log('');

    // Delete existing admin if exists
    console.log('🗑️  Deleting existing admin...');
    await db.query('DELETE FROM admins WHERE username = ?', [username]);
    
    // Insert new admin with hashed password
    console.log('➕ Inserting admin into database...');
    await db.query(
      'INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );

    console.log('✅ Admin inserted successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Email: Talotalo@pchaven.com');
    console.log('  Password: WaesTakeOutOrTakeMe');
    console.log('');
    
    // Verify
    const [admins] = await db.query('SELECT username, email, LEFT(password, 20) as password_preview FROM admins WHERE username = ?', [username]);
    console.log('✅ Verification:', admins[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

insertAdmin();
