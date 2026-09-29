const API_BASE_URL = 'http://127.0.0.1:5000/api';

// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

// Show/Hide Forms
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// Login Function
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('login-message');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Save token and user data
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showDashboard(data.user);
        } else {
            showMessage(messageDiv, data.message, 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Login failed. Please try again.', 'error');
    }
});

// Register Function
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        first_name: document.getElementById('signup-firstname').value,
        last_name: document.getElementById('signup-lastname').value,
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password').value,
        role: document.getElementById('signup-role').value
    };
    
    const messageDiv = document.getElementById('signup-message');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(messageDiv, 'Account created successfully! Please login.', 'success');
            // Switch to login form after 2 seconds
            setTimeout(() => {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                document.getElementById('signupForm').reset();
            }, 2000);
        } else {
            showMessage(messageDiv, data.message, 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Registration failed. Please try again.', 'error');
    }
});

// Helper function to show messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

// Show Dashboard
function showDashboard(user) {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    
    // Update user info
    document.getElementById('user-name').textContent = `${user.first_name} ${user.last_name}`;
    
    // Load dashboard data
    loadDashboardData();
}

// Check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        showDashboard(JSON.parse(user));
    }
}

// Initialize auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus);