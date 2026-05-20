/* ============================================================
   PASSWORD HASH GENERATOR
   Run: node generate-password.js YOUR_PASSWORD
   Example: node generate-password.js WaesTakeOutOrTakeMe
============================================================ */
const bcrypt = require('bcrypt');

const password = process.argv[2];

if (!password) {
  console.log('\n❌ Usage: node generate-password.js YOUR_PASSWORD');
  console.log('Example: node generate-password.js WaesTakeOutOrTakeMe\n');
  process.exit(1);
}

(async () => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ Password hashed successfully!\n');
    console.log('Original password:', password);
    console.log('Bcrypt hash:', hash);
    console.log('\n📋 Copy this hash to your database.sql file\n');
    
  } catch (error) {
    console.error('❌ Error generating hash:', error.message);
  }
})();
