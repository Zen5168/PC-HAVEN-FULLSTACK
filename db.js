/* ============================================================
   DATABASE CONNECTION (MySQL)
============================================================ */
const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
// Railway uses MYSQLHOST, MYSQLUSER, etc.
// Local development uses DB_HOST, DB_USER, etc.
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'password',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'pchaven_db',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please check your .env file and ensure MySQL is running');
    return;
  }
  console.log('✅ Database connected successfully');
  connection.release();
});

module.exports = promisePool;
