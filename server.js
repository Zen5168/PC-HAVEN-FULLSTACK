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
║  API Endpoints:                                        ║
║  • POST /api/register  - User registration            ║
║  • POST /api/login     - User login                   ║
║  • GET  /api/orders    - Get user orders              ║
║  • POST /api/orders    - Create order                 ║
║  • PATCH /api/orders/:id/cancel - Cancel order        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});
