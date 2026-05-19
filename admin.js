/* ============================================================
   ADMIN DASHBOARD - PC HAVEN
   Admin authentication, order management, product management
============================================================ */

// API URL detection
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : '';

// Check admin authentication
function checkAdminAuth() {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    window.location.href = 'admin-login.html';
    return false;
  }
  
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  document.getElementById('adminUsername').textContent = adminData.username || 'Admin';
  return true;
}

// Admin logout
function adminLogout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  window.location.href = 'admin-login.html';
}

// Show section
function showSection(section) {
  // Hide all sections
  document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
  
  // Remove active class from all buttons
  document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
  
  // Show selected section
  document.getElementById(section + 'Section').classList.remove('hidden');
  
  // Add active class to clicked button
  event.target.closest('.admin-nav-btn').classList.add('active');
  
  // Load data for section
  if (section === 'dashboard') loadDashboard();
  if (section === 'orders') loadOrders();
  if (section === 'products') loadProducts();
  if (section === 'customers') loadCustomers();
}

/* ============================================================
   DASHBOARD
============================================================ */
async function loadDashboard() {
  try {
    const token = localStorage.getItem('adminToken');
    
    // Fetch stats
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('totalOrders').textContent = data.stats.totalOrders;
      document.getElementById('totalRevenue').textContent = '₱' + data.stats.totalRevenue.toLocaleString();
      document.getElementById('pendingOrders').textContent = data.stats.pendingOrders;
      document.getElementById('totalProducts').textContent = data.stats.totalProducts;
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

/* ============================================================
   ORDERS MANAGEMENT
============================================================ */
async function loadOrders() {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      renderOrders(data.orders);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    document.getElementById('ordersList').innerHTML = '<p class="text-danger">Failed to load orders</p>';
  }
}

function renderOrders(orders) {
  const container = document.getElementById('ordersList');
  
  if (orders.length === 0) {
    container.innerHTML = '<p class="text-muted">No orders found</p>';
    return;
  }
  
  container.innerHTML = orders.map(order => `
    <div class="order-item">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h6>${order.order_id}</h6>
          <p class="text-muted mb-1">Customer: ${order.customer_name} (${order.customer_email})</p>
          <p class="text-muted mb-0">Date: ${new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div class="text-end">
          <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
          <h5 class="mt-2 mb-0">₱${order.total.toLocaleString()}</h5>
        </div>
      </div>
      
      <div class="mb-2">
        <strong>Items:</strong>
        <ul class="mb-0">
          ${order.items.map(item => `
            <li>${item.product_name} x${item.quantity} - ₱${(item.price * item.quantity).toLocaleString()}</li>
          `).join('')}
        </ul>
      </div>
      
      ${order.status === 'Processing' ? `
        <div class="mt-2">
          <button class="btn-action btn-deliver" onclick="deliverOrder('${order.order_id}')">
            <i class="bi bi-check-circle"></i> Mark as Delivered
          </button>
          <button class="btn-action btn-delete" onclick="cancelOrder('${order.order_id}')">
            <i class="bi bi-x-circle"></i> Cancel Order
          </button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

async function deliverOrder(orderId) {
  if (!confirm('Mark this order as delivered?')) return;
  
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/deliver`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Order marked as delivered!');
      loadOrders();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error delivering order:', error);
    alert('Failed to update order');
  }
}

async function cancelOrder(orderId) {
  if (!confirm('Cancel this order?')) return;
  
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Order cancelled!');
      loadOrders();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    alert('Failed to cancel order');
  }
}

/* ============================================================
   PRODUCTS MANAGEMENT
============================================================ */
async function loadProducts() {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      renderProducts(data.products);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productsTable').innerHTML = '<p class="text-danger">Failed to load products</p>';
  }
}

function renderProducts(products) {
  const container = document.getElementById('productsTable');
  
  if (products.length === 0) {
    container.innerHTML = '<p class="text-muted">No products found</p>';
    return;
  }
  
  container.innerHTML = `
    <table class="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(product => `
          <tr>
            <td>${product.id}</td>
            <td>${product.emoji || ''} ${product.name}</td>
            <td>${product.category}</td>
            <td>₱${product.price.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td>
              <button class="btn-action btn-edit" onclick='editProduct(${JSON.stringify(product)})'>
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn-action btn-delete" onclick="deleteProduct('${product.id}')">
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function showAddProductForm() {
  document.getElementById('productFormContainer').classList.remove('hidden');
  document.getElementById('formTitle').textContent = 'Add New Product';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('productIdInput').disabled = false;
}

function hideProductForm() {
  document.getElementById('productFormContainer').classList.add('hidden');
  document.getElementById('productForm').reset();
}

function editProduct(product) {
  document.getElementById('productFormContainer').classList.remove('hidden');
  document.getElementById('formTitle').textContent = 'Edit Product';
  
  document.getElementById('productId').value = product.id;
  document.getElementById('productIdInput').value = product.id;
  document.getElementById('productIdInput').disabled = true;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productName').value = product.name;
  document.getElementById('productSpec').value = product.spec || '';
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('productLabel').value = product.label || '';
  document.getElementById('productEmoji').value = product.emoji || '';
  document.getElementById('productImage').value = product.image || '';
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const productId = document.getElementById('productId').value;
  const isEdit = productId !== '';
  
  const productData = {
    id: document.getElementById('productIdInput').value,
    category: document.getElementById('productCategory').value,
    name: document.getElementById('productName').value,
    spec: document.getElementById('productSpec').value,
    price: parseFloat(document.getElementById('productPrice').value),
    stock: parseInt(document.getElementById('productStock').value),
    label: document.getElementById('productLabel').value,
    emoji: document.getElementById('productEmoji').value,
    image: document.getElementById('productImage').value
  };
  
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/products${isEdit ? '/' + productId : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(isEdit ? 'Product updated!' : 'Product added!');
      hideProductForm();
      loadProducts();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Failed to save product');
  }
});

async function deleteProduct(productId) {
  if (!confirm('Delete this product?')) return;
  
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Product deleted!');
      loadProducts();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Failed to delete product');
  }
}

/* ============================================================
   CUSTOMERS MANAGEMENT
============================================================ */
async function loadCustomers() {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/customers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      renderCustomers(data.customers);
    }
  } catch (error) {
    console.error('Error loading customers:', error);
    document.getElementById('customersList').innerHTML = '<p class="text-danger">Failed to load customers</p>';
  }
}

function renderCustomers(customers) {
  const container = document.getElementById('customersList');
  
  if (customers.length === 0) {
    container.innerHTML = '<p class="text-muted">No customers found</p>';
    return;
  }
  
  container.innerHTML = `
    <table class="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Orders</th>
          <th>Total Spent</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        ${customers.map(customer => `
          <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.order_count}</td>
            <td>₱${customer.total_spent.toLocaleString()}</td>
            <td>${new Date(customer.created_at).toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* ============================================================
   INITIALIZATION
============================================================ */
if (checkAdminAuth()) {
  loadDashboard();
}
