/* ============================================================
   AUTHENTICATION SYSTEM (MySQL Backend)
============================================================ */

// API Base URL
const getApiUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000/api';
  }
  return `${window.location.protocol}//${window.location.host}/api`;
};
const API_URL = getApiUrl();

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('pchaven_theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('pchaven_theme', target);
  updateThemeIcon(target);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'light') {
    icon.className = 'bi bi-sun-fill';
  } else {
    icon.className = 'bi bi-moon-stars-fill';
  }
}

// Tab switching
function switchTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  
  tabs.forEach(t => t.classList.remove('active'));
  forms.forEach(f => f.classList.remove('active'));
  
  if (tab === 'login') {
    tabs[0].classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else {
    tabs[1].classList.add('active');
    document.getElementById('registerForm').classList.add('active');
  }
  
  hideAlert();
}

// Alert system
function showAlert(message, type = 'error') {
  const alertBox = document.getElementById('alertMessage');
  alertBox.textContent = message;
  alertBox.className = `alert-message alert-${type} show`;
  
  setTimeout(() => {
    hideAlert();
  }, 5000);
}

function hideAlert() {
  const alertBox = document.getElementById('alertMessage');
  alertBox.classList.remove('show');
}

// Password strength checker
const registerPassword = document.getElementById('registerPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

registerPassword.addEventListener('input', (e) => {
  const password = e.target.value;
  const strength = checkPasswordStrength(password);
  
  strengthFill.className = 'strength-fill';
  
  if (password.length === 0) {
    strengthFill.style.width = '0%';
    strengthText.textContent = 'Password strength';
    strengthText.className = 'text-muted';
  } else if (strength.score === 1) {
    strengthFill.classList.add('strength-weak');
    strengthText.textContent = 'Weak password';
    strengthText.className = 'text-danger';
  } else if (strength.score === 2) {
    strengthFill.classList.add('strength-medium');
    strengthText.textContent = 'Medium password';
    strengthText.className = 'text-warning';
  } else {
    strengthFill.classList.add('strength-strong');
    strengthText.textContent = 'Strong password';
    strengthText.className = 'text-success';
  }
});

function checkPasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;
  
  return {
    score: Math.min(Math.floor(score / 2), 3)
  };
}

// Get all registered users
function getUsers() {
  const users = localStorage.getItem('pchaven_users');
  return users ? JSON.parse(users) : [];
}

// Save users
function saveUsers(users) {
  localStorage.setItem('pchaven_users', JSON.stringify(users));
}

// Check if email exists
function emailExists(email) {
  const users = getUsers();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Register form handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Creating account...';
  
  // Validation
  if (name.length < 2) {
    showAlert('Please enter a valid name (at least 2 characters)', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Create Account';
    return;
  }
  
  if (!isValidEmail(email)) {
    showAlert('Please enter a valid email address', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Create Account';
    return;
  }
  
  // Check if email ends with @gmail.com
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    showAlert('Please use a Gmail address (@gmail.com)', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Create Account';
    return;
  }
  
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters long', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Create Account';
    return;
  }
  
  if (password !== confirmPassword) {
    showAlert('Passwords do not match', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Create Account';
    return;
  }
  
  try {
    // Call API
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showAlert(data.message || 'Registration failed', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Create Account';
      return;
    }
    
    // Save session
    const session = {
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      token: data.token,
      loggedIn: true,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('pchaven_session', JSON.stringify(session));
    
    showAlert(`Welcome, ${data.user.name}! Account created successfully!`, 'success');
    
    // Clear form
    document.getElementById('registerForm').reset();
    strengthFill.style.width = '0%';
    strengthText.textContent = 'Password strength';
    strengthText.className = 'text-muted';
    
    // Redirect to main page after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1500);
    
  } catch (error) {
    console.error('Registration error:', error);
    showAlert('Unable to connect to server. Please try again later.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-person-plus-fill"></i> Create Account';
  }
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Logging in...';
  
  // Validation
  if (email.length === 0) {
    showAlert('Please enter your email or username', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
    return;
  }
  
  // Only validate email format if it contains @
  if (email.includes('@') && !isValidEmail(email)) {
    showAlert('Please enter a valid email address', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
    return;
  }
  
  if (password.length === 0) {
    showAlert('Please enter your password', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
    return;
  }
  
  try {
    // Try admin login first (check by username or email)
    const adminResponse = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: email, password })
    });
    
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      
      if (adminData.success) {
        // Save admin session
        localStorage.setItem('adminToken', adminData.token);
        localStorage.setItem('adminData', JSON.stringify(adminData.admin));
        
        showAlert('Welcome Admin! Redirecting to dashboard...', 'success');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 1000);
        return;
      }
    }
    
    // If admin login failed, try customer login
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      showAlert(data.message || 'Invalid email or password', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
      return;
    }
    
    // Save customer session
    const session = {
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      token: data.token,
      loggedIn: true,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('pchaven_session', JSON.stringify(session));
    
    if (rememberMe) {
      localStorage.setItem('pchaven_remember', 'true');
    }
    
    showAlert(data.message, 'success');
    
    // Redirect to customer page
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    showAlert('Unable to connect to server. Please try again later.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Login';
  }
});

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
  const session = localStorage.getItem('pchaven_session');
  if (session) {
    const user = JSON.parse(session);
    if (user.loggedIn) {
      // User is already logged in, redirect to main page
      window.location.href = 'home.html';
    }
  }
});

// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(inputId + '-icon');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'bi bi-eye';
  }
}
