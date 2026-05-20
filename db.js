/* ============================================================
   DATABASE CONNECTION (PostgreSQL)
============================================================ */
const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
// Render provides DATABASE_URL
// Local development uses individual variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please check your .env file and ensure PostgreSQL is running');
    return;
  }
  console.log('✅ Database connected successfully');
  release();
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

module.exports = pool;
