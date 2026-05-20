/* ============================================================
   ADMIN DASHBOARD - PC HAVEN
   Admin authentication, order management, product management
============================================================ */

// API URL detection
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : '';

// Custom Modal Functions
function showModal(title, message, type = 'info') {
  const modal = document.createElement('div');
  modal.className = 'custom-modal-overlay';
  
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle';
  const iconColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : 'var(--accent)';
  
  modal.innerHTML = `
    <div class="custom-modal">
      <div class="custom-modal-header">
        <h3><i class="bi bi-${icon}" style="color: ${iconColor};"></i> ${title}</h3>
      </div>
      <div class="custom-modal-body">
        <p>${message}</p>
      </div>
      <div class="custom-modal-footer">
        <button class="btn-modal-confirm" onclick="this.closest('.custom-modal-overlay').remove()">
          <i class="bi bi-check-lg"></i> OK
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function showConfirm(title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel') {
  const modal = document.createElement('div');
  modal.className = 'custom-modal-overlay';
  
  const confirmId = 'confirm_' + Date.now();
  
  modal.innerHTML = `
    <div class="custom-modal">
      <div class="custom-modal-header">
        <h3><i class="bi bi-question-circle" style="color: var(--accent);"></i> ${title}</h3>
      </div>
      <div class="custom-modal-body">
        <p>${message}</p>
      </div>
      <div class="custom-modal-footer">
        <button class="btn-modal-cancel" onclick="this.closest('.custom-modal-overlay').remove()">
          <i class="bi bi-x-circle"></i> ${cancelText}
        </button>
        <button class="btn-modal-confirm" id="${confirmId}">
          <i class="bi bi-check-circle"></i> ${confirmText}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById(confirmId).addEventListener('click', () => {
    modal.remove();
    onConfirm();
  });
}

// Check admin authentication
function checkAdminAuth() {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    window.location.href = 'index.html';
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
  window.location.href = 'index.html';
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
  if (section === 'requests') loadComponentRequests();
}

/* ============================================================
   DASHBOARD
============================================================ */
async function loadDashboard() {
  try {
    const token = localStorage.getItem('adminToken');
    
    console.log('📊 Loading dashboard stats...');
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('API URL:', `${API_URL}/api/admin/stats`);
    
    // Fetch stats
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success) {
      document.getElementById('totalOrders').textContent = data.stats.totalOrders;
      document.getElementById('totalRevenue').textContent = '₱' + data.stats.totalRevenue.toLocaleString();
      document.getElementById('pendingOrders').textContent = data.stats.pendingOrders;
      document.getElementById('totalProducts').textContent = data.stats.totalProducts;
      console.log('✅ Dashboard loaded successfully');
    } else {
      console.error('❌ API returned success: false', data);
      showModal('Error', 'Failed to load dashboard stats: ' + (data.message || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('❌ Error loading dashboard:', error);
    showModal('Error', 'Failed to connect to server. Please check your connection.', 'error');
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
      
      <div class="mb-2 p-3" style="background: var(--bg-muted); border-radius: 8px; border-left: 3px solid var(--accent);">
        <strong><i class="bi bi-geo-alt"></i> Delivery Address:</strong>
        <p class="mb-1 mt-2">${order.delivery_address}</p>
        <p class="mb-1">${order.delivery_city}, ${order.delivery_postal_code}</p>
        <p class="mb-1"><strong>Contact:</strong> ${order.delivery_phone}</p>
        ${order.delivery_notes ? `<p class="mb-0"><strong>Notes:</strong> ${order.delivery_notes}</p>` : ''}
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
  showConfirm(
    'Mark as Delivered',
    'Mark this order as delivered?',
    async () => {
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
          showModal('Success', 'Order marked as delivered!', 'success');
          loadOrders();
          loadDashboard(); // Refresh stats
        } else {
          showModal('Error', data.message, 'error');
        }
      } catch (error) {
        console.error('Error delivering order:', error);
        showModal('Error', 'Failed to update order', 'error');
      }
    },
    'Mark as Delivered',
    'Cancel'
  );
}

async function cancelOrder(orderId) {
  showConfirm(
    'Cancel Order',
    'Are you sure you want to cancel this order?',
    async () => {
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
          showModal('Success', 'Order cancelled!', 'success');
          loadOrders();
          loadDashboard(); // Refresh stats
        } else {
          showModal('Error', data.message, 'error');
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        showModal('Error', 'Failed to cancel order', 'error');
      }
    },
    'Yes, Cancel Order',
    'No, Keep Order'
  );
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
      showModal('Success', isEdit ? 'Product updated!' : 'Product added!', 'success');
      hideProductForm();
      loadProducts();
      loadDashboard(); // Refresh stats
    } else {
      showModal('Error', data.message, 'error');
    }
  } catch (error) {
    console.error('Error saving product:', error);
    showModal('Error', 'Failed to save product', 'error');
  }
});

async function deleteProduct(productId) {
  showConfirm(
    'Delete Product',
    'Are you sure you want to delete this product? This action cannot be undone.',
    async () => {
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
          showModal('Success', 'Product deleted!', 'success');
          loadProducts();
          loadDashboard(); // Refresh stats
        } else {
          showModal('Error', data.message, 'error');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showModal('Error', 'Failed to delete product', 'error');
      }
    },
    'Yes, Delete',
    'Cancel'
  );
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
   COMPONENT REQUESTS MANAGEMENT
============================================================ */
async function loadComponentRequests() {
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/component-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      renderComponentRequests(data.requests);
    }
  } catch (error) {
    console.error('Error loading component requests:', error);
    document.getElementById('requestsList').innerHTML = '<p class="text-danger">Failed to load requests</p>';
  }
}

function renderComponentRequests(requests) {
  const container = document.getElementById('requestsList');
  
  if (requests.length === 0) {
    container.innerHTML = '<p class="text-muted">No component requests found</p>';
    return;
  }
  
  const statusColors = {
    'Pending': 'warning',
    'Reviewed': 'info',
    'Fulfilled': 'success',
    'Rejected': 'danger'
  };
  
  container.innerHTML = `
    <div class="requests-grid">
      ${requests.map(req => {
        const statusColor = statusColors[req.status] || 'secondary';
        const date = new Date(req.created_at).toLocaleDateString();
        
        return `
          <div class="request-card" style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 15px;">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 class="mb-1" style="color: var(--text-primary);">${req.user_name}</h6>
                <small class="text-muted">${req.user_email}</small>
              </div>
              <div class="text-end">
                <span class="badge bg-${statusColor} mb-2">${req.status}</span>
                <br>
                <small class="text-muted">${date}</small>
              </div>
            </div>
            
            <div class="mb-3 p-3" style="background: var(--bg-muted); border-radius: 6px; border-left: 3px solid var(--accent);">
              <small class="text-secondary d-block mb-1"><i class="bi bi-chat-left-text"></i> Request:</small>
              <p class="mb-0" style="color: var(--text-primary);">${req.request_message}</p>
            </div>
            
            ${req.admin_response ? `
              <div class="mb-3 p-3" style="background: var(--bg-muted); border-radius: 6px; border-left: 3px solid #28a745;">
                <small class="text-secondary d-block mb-1"><i class="bi bi-reply"></i> Your Response:</small>
                <p class="mb-0" style="color: var(--text-primary);">${req.admin_response}</p>
              </div>
            ` : ''}
            
            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-sm btn-primary" onclick="respondToRequest(${req.id}, '${req.user_name}', '${req.request_message.replace(/'/g, "\\'")}')">
                <i class="bi bi-reply"></i> Respond
              </button>
              ${req.status !== 'Fulfilled' ? `
                <button class="btn btn-sm btn-success" onclick="updateRequestStatus(${req.id}, 'Fulfilled')">
                  <i class="bi bi-check-circle"></i> Mark Fulfilled
                </button>
              ` : ''}
              ${req.status !== 'Rejected' ? `
                <button class="btn btn-sm btn-danger" onclick="updateRequestStatus(${req.id}, 'Rejected')">
                  <i class="bi bi-x-circle"></i> Reject
                </button>
              ` : ''}
              ${req.status !== 'Reviewed' ? `
                <button class="btn btn-sm btn-info" onclick="updateRequestStatus(${req.id}, 'Reviewed')">
                  <i class="bi bi-eye"></i> Mark Reviewed
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function respondToRequest(requestId, userName, requestMessage) {
  const modal = document.createElement('div');
  modal.className = 'custom-modal-overlay';
  modal.innerHTML = `
    <div class="custom-modal">
      <div class="custom-modal-header">
        <h3><i class="bi bi-reply"></i> Respond to ${userName}</h3>
      </div>
      <div class="custom-modal-body">
        <div class="mb-3 p-3" style="background: var(--bg-muted); border-radius: 6px;">
          <small class="text-secondary d-block mb-1">Request:</small>
          <p class="mb-0">${requestMessage}</p>
        </div>
        <label class="form-label">Your Response:</label>
        <textarea 
          id="adminResponseText" 
          class="form-control" 
          rows="4" 
          placeholder="Enter your response to the customer..."
          style="background: var(--bg-base); color: var(--text-primary); border-color: var(--border);"
        ></textarea>
      </div>
      <div class="custom-modal-footer">
        <button class="btn-modal-cancel" onclick="this.closest('.custom-modal-overlay').remove()">
          <i class="bi bi-x-lg"></i> Cancel
        </button>
        <button class="btn-modal-confirm" onclick="submitResponse(${requestId})">
          <i class="bi bi-send"></i> Send Response
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

async function submitResponse(requestId) {
  const responseText = document.getElementById('adminResponseText').value.trim();
  
  if (!responseText) {
    alert('Please enter a response');
    return;
  }
  
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/component-requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'Reviewed',
        admin_response: responseText
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      document.querySelector('.custom-modal-overlay').remove();
      loadComponentRequests();
      showToast('Response sent successfully', 'success');
    } else {
      alert(data.message || 'Failed to send response');
    }
  } catch (error) {
    console.error('Error sending response:', error);
    alert('Failed to send response');
  }
}

async function updateRequestStatus(requestId, status) {
  // Create custom confirmation modal
  const modal = document.createElement('div');
  modal.className = 'custom-modal-overlay';
  
  const statusMessages = {
    'Fulfilled': {
      title: 'Mark as Fulfilled',
      message: 'Are you sure you want to mark this request as fulfilled?',
      icon: 'bi-check-circle-fill text-success',
      confirmText: 'Mark Fulfilled',
      confirmClass: 'btn-modal-confirm'
    },
    'Rejected': {
      title: 'Reject Request',
      message: 'Are you sure you want to reject this component request?',
      icon: 'bi-x-circle-fill text-danger',
      confirmText: 'Reject Request',
      confirmClass: 'btn-modal-confirm btn-danger'
    },
    'Reviewed': {
      title: 'Mark as Reviewed',
      message: 'Mark this request as reviewed?',
      icon: 'bi-eye-fill text-info',
      confirmText: 'Mark Reviewed',
      confirmClass: 'btn-modal-confirm'
    }
  };
  
  const statusInfo = statusMessages[status];
  
  modal.innerHTML = `
    <div class="custom-modal">
      <div class="custom-modal-header">
        <h3><i class="bi ${statusInfo.icon}"></i> ${statusInfo.title}</h3>
      </div>
      <div class="custom-modal-body">
        <p>${statusInfo.message}</p>
      </div>
      <div class="custom-modal-footer">
        <button class="btn-modal-cancel" onclick="this.closest('.custom-modal-overlay').remove()">
          <i class="bi bi-x-lg"></i> Cancel
        </button>
        <button class="${statusInfo.confirmClass}" onclick="confirmUpdateRequestStatus(${requestId}, '${status}')">
          <i class="bi bi-check-lg"></i> ${statusInfo.confirmText}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

async function confirmUpdateRequestStatus(requestId, status) {
  // Close confirmation modal
  document.querySelector('.custom-modal-overlay').remove();
  
  try {
    const token = localStorage.getItem('adminToken');
    
    const response = await fetch(`${API_URL}/api/admin/component-requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    const data = await response.json();
    
    if (data.success) {
      loadComponentRequests();
      
      // Show success modal
      const successModal = document.createElement('div');
      successModal.className = 'custom-modal-overlay';
      
      const statusSuccessMessages = {
        'Fulfilled': { icon: 'bi-check-circle-fill text-success', message: 'Request marked as fulfilled successfully!' },
        'Rejected': { icon: 'bi-x-circle-fill text-danger', message: 'Request has been rejected.' },
        'Reviewed': { icon: 'bi-eye-fill text-info', message: 'Request marked as reviewed.' }
      };
      
      const successInfo = statusSuccessMessages[status];
      
      successModal.innerHTML = `
        <div class="custom-modal">
          <div class="custom-modal-header">
            <h3><i class="bi ${successInfo.icon}"></i> Success</h3>
          </div>
          <div class="custom-modal-body">
            <p>${successInfo.message}</p>
          </div>
          <div class="custom-modal-footer">
            <button class="btn-modal-confirm" onclick="this.closest('.custom-modal-overlay').remove()">
              <i class="bi bi-check-lg"></i> OK
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(successModal);
      
      // Close on overlay click
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
          successModal.remove();
        }
      });
      
      // Auto close after 2 seconds
      setTimeout(() => {
        if (document.body.contains(successModal)) {
          successModal.remove();
        }
      }, 2000);
    } else {
      // Show error modal
      const errorModal = document.createElement('div');
      errorModal.className = 'custom-modal-overlay';
      errorModal.innerHTML = `
        <div class="custom-modal">
          <div class="custom-modal-header">
            <h3><i class="bi bi-exclamation-triangle-fill text-warning"></i> Error</h3>
          </div>
          <div class="custom-modal-body">
            <p>${data.message || 'Failed to update status'}</p>
          </div>
          <div class="custom-modal-footer">
            <button class="btn-modal-confirm" onclick="this.closest('.custom-modal-overlay').remove()">
              <i class="bi bi-check-lg"></i> OK
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(errorModal);
      
      errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) {
          errorModal.remove();
        }
      });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    
    // Show error modal
    const errorModal = document.createElement('div');
    errorModal.className = 'custom-modal-overlay';
    errorModal.innerHTML = `
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h3><i class="bi bi-exclamation-triangle-fill text-warning"></i> Error</h3>
        </div>
        <div class="custom-modal-body">
          <p>Failed to update status. Please try again.</p>
        </div>
        <div class="custom-modal-footer">
          <button class="btn-modal-confirm" onclick="this.closest('.custom-modal-overlay').remove()">
            <i class="bi bi-check-lg"></i> OK
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(errorModal);
    
    errorModal.addEventListener('click', (e) => {
      if (e.target === errorModal) {
        errorModal.remove();
      }
    });
  }
}

/* ============================================================
   INITIALIZATION
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (checkAdminAuth()) {
    console.log('✅ Admin authenticated, loading dashboard...');
    loadDashboard();
  } else {
    console.log('❌ Admin not authenticated, redirecting...');
  }
});

// Add error handler for debugging
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.message, e.filename, e.lineno);
});
