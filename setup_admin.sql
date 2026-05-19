-- ============================================================
-- SETUP ADMIN ACCOUNT
-- Run this in Railway Query tab after running database.sql
-- ============================================================

-- Create default admin account
-- Username: admin
-- Password: admin123
INSERT INTO admins (username, password, email) VALUES 
('admin', 'WaesTakeOutOrTakeMe', 'Talotalo@pchaven.com')
ON DUPLICATE KEY UPDATE username=username;

-- Note: The password hash above is a placeholder.
-- The actual hash will be generated when you first run the server.
-- You can also create admin accounts programmatically through the server.

-- Verify admin was created
SELECT * FROM admins;
