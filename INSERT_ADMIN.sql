-- ============================================================
-- INSERT ADMIN ACCOUNT INTO RAILWAY DATABASE
-- Copy and paste this into Railway Query tab
-- ============================================================

-- Your admin account with bcrypt-hashed password
-- Email: Talotalo@pchaven.com
-- Password: WaesTakeOutOrTakeMe
-- Bcrypt hash generated with 10 salt rounds

INSERT INTO admins (username, password, email) VALUES 
('Talotalo', '$2b$10$8vZ5YqKqXOxGZJ5YJxH8YqKqXOxGZJ5YJxH8YqKqXOxGZJ5YJxH8Yq', 'Talotalo@pchaven.com')
ON DUPLICATE KEY UPDATE 
  password = '$2b$10$8vZ5YqKqXOxGZJ5YJxH8YqKqXOxGZJ5YJxH8YqKqXOxGZJ5YJxH8Yq',
  email = 'Talotalo@pchaven.com';

-- Verify admin was inserted
SELECT id, username, email, created_at FROM admins;

-- ============================================================
-- IMPORTANT NOTES:
-- ============================================================
-- 1. The password hash above is a PLACEHOLDER
-- 2. You need to generate the REAL hash using the script below
-- 3. Run: node hash-password.js WaesTakeOutOrTakeMe
-- 4. Copy the hash and replace it in this SQL
-- ============================================================
