/* ============================================================
   GENERATE BCRYPT HASH FOR PASSWORD
   Usage: node hash-password.js YourPasswordHere
============================================================ */

const bcrypt = require('bcrypt');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Please provide a password');
  console.log('Usage: node hash-password.js YourPasswordHere');
  process.exit(1);
}

async function hashPassword() {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ Password hashed successfully!\n');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n📋 Copy this hash and use it in your SQL INSERT statement:');
    console.log(hash);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    process.exit(1);
  }
}

hashPassword();
