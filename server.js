/* ============================================================
   PC HAVEN BACKEND SERVER
   Node.js + Express + MySQL + bcrypt
============================================================ */
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your front-end)
app.use(express.static(__dirname));

/* ============================================================
   AUTHENTICATION ROUTES
============================================================ */

// Register endpoint
app.post('/api/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('email').custom(value => {
    if (!value.toLowerCase().endsWith('@gmail.com')) {
      throw new Error('Please use a Gmail address');
    }
    return true;
  }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success with user data
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: userId,
        name,
        email
      },
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// Login endpoint
app.post('/api/login', [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }

    const { email, password } = req.body;

    // Find user
    const [users] = await db.query(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'No account found with this email. Please register first.' 
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password. Please try again.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success with user data
    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

/* ============================================================
   MIDDLEWARE - JWT Authentication
============================================================ */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token.' 
      });
    }
    req.user = user;
    next();
  });
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err || !admin.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin only.' 
      });
    }
    req.admin = admin;
    next();
  });
};

/* ============================================================
   ADMIN ROUTES
============================================================ */

// Admin login
app.post('/api/admin/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg 
      });
    }

    const { username, password } = req.body;

    const [admins] = await db.query(
      'SELECT id, username, email, password FROM admins WHERE username = ?',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    const admin = admins[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      },
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get dashboard stats
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const [orderStats] = await db.query(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(total) as totalRevenue,
        SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) as pendingOrders
      FROM orders
    `);

    const [productStats] = await db.query('SELECT COUNT(*) as totalProducts FROM products');

    res.json({
      success: true,
      stats: {
        totalOrders: orderStats[0].totalOrders,
        totalRevenue: parseFloat(orderStats[0].totalRevenue || 0),
        pendingOrders: orderStats[0].pendingOrders,
        totalProducts: productStats[0].totalProducts
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch stats' 
    });
  }
});

// Get all orders
app.get('/api/admin/orders', authenticateAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.id,
        o.order_id,
        o.total,
        o.status,
        o.created_at,
        o.cancelled_at,
        u.name as customer_name,
        u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    for (let order of orders) {
      const [items] = await db.query(`
        SELECT 
          product_id,
          product_name,
          price,
          quantity
        FROM order_items
        WHERE order_id = ?
      `, [order.id]);
      
      order.items = items;
    }

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders' 
    });
  }
});

// Mark order as delivered
app.patch('/api/admin/orders/:orderId/deliver', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await db.query(
      'SELECT id, status FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    await db.query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      ['Delivered', orderId]
    );

    res.json({
      success: true,
      message: 'Order marked as delivered'
    });

  } catch (error) {
    console.error('Deliver order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update order' 
    });
  }
});

// Cancel order (admin)
app.patch('/api/admin/orders/:orderId/cancel', authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await db.query(
      'SELECT id, status FROM orders WHERE order_id = ?',
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    await db.query(
      'UPDATE orders SET status = ?, cancelled_at = NOW() WHERE order_id = ?',
      ['Cancelled', orderId]
    );

    res.json({
      success: true,
      message: 'Order cancelled'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel order' 
    });
  }
});

// Get all products
app.get('/api/admin/products', authenticateAdmin, async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY category, name');

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products' 
    });
  }
});

// Add product
app.post('/api/admin/products', authenticateAdmin, async (req, res) => {
  try {
    const { id, category, name, spec, price, stock, label, emoji, image } = req.body;

    await db.query(
      'INSERT INTO products (id, category, name, spec, price, stock, label, emoji, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, category, name, spec, price, stock, label, emoji, image]
    );

    res.status(201).json({
      success: true,
      message: 'Product added successfully'
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add product' 
    });
  }
});

// Update product
app.put('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, spec, price, stock, label, emoji, image } = req.body;

    await db.query(
      'UPDATE products SET category = ?, name = ?, spec = ?, price = ?, stock = ?, label = ?, emoji = ?, image = ? WHERE id = ?',
      [category, name, spec, price, stock, label, emoji, image, id]
    );

    res.json({
      success: true,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update product' 
    });
  }
});

// Delete product
app.delete('/api/admin/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete product' 
    });
  }
});

// Get all customers
app.get('/api/admin/customers', authenticateAdmin, async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.created_at,
        COUNT(o.id) as order_count,
        COALESCE(SUM(o.total), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({
      success: true,
      customers
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch customers' 
    });
  }
});

/* ============================================================
   ORDERS ROUTES
============================================================ */

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [orders] = await db.query(`
      SELECT 
        o.id,
        o.order_id,
        o.total,
        o.status,
        o.created_at,
        o.cancelled_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    // Get items for each order
    for (let order of orders) {
      const [items] = await db.query(`
        SELECT 
          product_id as id,
          product_name as name,
          price,
          quantity as qty,
          emoji
        FROM order_items
        WHERE order_id = ?
      `, [order.id]);
      
      order.items = items;
      order.date = order.created_at;
    }

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders' 
    });
  }
});

// Create order (checkout)
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    const orderId = 'ORD-' + Date.now();

    // Insert order
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, order_id, total, status) VALUES (?, ?, ?, ?)',
      [userId, orderId, total, 'Processing']
    );

    const orderDbId = orderResult.insertId;

    // Insert order items
    for (let item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, emoji) VALUES (?, ?, ?, ?, ?, ?)',
        [orderDbId, item.id, item.name, item.price, item.qty, item.emoji || '']
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: orderId,
        total,
        status: 'Processing'
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order' 
    });
  }
});

// Cancel order
app.patch('/api/orders/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;

    // Check if order exists and belongs to user
    const [orders] = await db.query(
      'SELECT id, status FROM orders WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const order = orders[0];

    if (order.status === 'Cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is already cancelled' 
      });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel delivered order' 
      });
    }

    // Update order status
    await db.query(
      'UPDATE orders SET status = ?, cancelled_at = NOW() WHERE id = ?',
      ['Cancelled', order.id]
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel order' 
    });
  }
});

/* ============================================================
   SERVER START
============================================================ */
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║           🖥️  PC HAVEN BACKEND SERVER 🖥️              ║
║                                                        ║
║  Server running on: http://localhost:${PORT}           ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                        ║
║  Customer API Endpoints:                               ║
║  • POST /api/register  - User registration            ║
║  • POST /api/login     - User login                   ║
║  • GET  /api/orders    - Get user orders              ║
║  • POST /api/orders    - Create order                 ║
║  • PATCH /api/orders/:id/cancel - Cancel order        ║
║                                                        ║
║  Admin API Endpoints:                                  ║
║  • POST /api/admin/login - Admin login                ║
║  • GET  /api/admin/stats - Dashboard stats            ║
║  • GET  /api/admin/orders - All orders                ║
║  • PATCH /api/admin/orders/:id/deliver - Deliver      ║
║  • GET  /api/admin/products - All products            ║
║  • POST /api/admin/products - Add product             ║
║  • PUT  /api/admin/products/:id - Update product      ║
║  • DELETE /api/admin/products/:id - Delete product    ║
║  • GET  /api/admin/customers - All customers          ║
║                                                        ║
║  Admin Dashboard: http://localhost:${PORT}/admin-login.html  ║
║  Default Admin: username=admin, password=admin123     ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});
