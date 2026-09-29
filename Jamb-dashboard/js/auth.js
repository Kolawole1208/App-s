// auth.js - Authentication system
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('utme_users') || '{}');
        this.currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
        
        this.checkAuthentication();
    }
    
    checkAuthentication() {
        // If user is logged in and on auth pages, redirect to dashboard
        if (this.currentUser && (window.location.pathname.includes('login.html') || 
                                window.location.pathname.includes('signup.html'))) {
            window.location.href = 'dashboard.html';
        }
        
        // If user is not logged in and on protected pages, redirect to login
        if (!this.currentUser && this.isProtectedPage()) {
            window.location.href = 'login.html';
        }
    }
    
    isProtectedPage() {
        const protectedPages = ['dashboard.html', 'index.html', 'exam.html', 'result.html'];
        return protectedPages.some(page => window.location.pathname.includes(page));
    }
    
    signUp(fullName, email, password) {
        // Validate inputs
        if (!fullName || !email || !password) {
            throw new Error('All fields are required');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        
        if (this.users[email]) {
            throw new Error('User already exists with this email');
        }
        
        // Create new user
        this.users[email] = {
            fullName: fullName,
            email: email,
            password: password, // In real app, this should be hashed
            createdAt: new Date().toISOString(),
            examsTaken: 0,
            averageScore: 0
        };
        
        // Save to localStorage
        localStorage.setItem('utme_users', JSON.stringify(this.users));
        
        // Auto-login the user
        this.login(email, password);
        
        return true;
    }
    
    login(email, password, rememberMe = false) {
        // Validate inputs
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        const user = this.users[email];
        
        if (!user) {
            throw new Error('No account found with this email');
        }
        
        if (user.password !== password) {
            throw new Error('Invalid password');
        }
        
        // Set current user (without password)
        this.currentUser = {
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            examsTaken: user.examsTaken,
            averageScore: user.averageScore
        };
        
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        
        if (rememberMe) {
            localStorage.setItem('remember_me', 'true');
        }
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
        return true;
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
        window.location.href = 'login.html';
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    updateUserStats() {
        if (this.currentUser) {
            const user = this.users[this.currentUser.email];
            if (user) {
                user.examsTaken += 1;
                
                // Update current user data
                this.currentUser.examsTaken = user.examsTaken;
                this.currentUser.averageScore = user.averageScore;
                
                // Save updates
                localStorage.setItem('utme_users', JSON.stringify(this.users));
                localStorage.setItem('current_user', JSON.stringify(this.currentUser));
            }
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();

// DOM event handlers for login page
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        // Clear previous messages
        errorDiv.classList.add('hidden');
        successDiv.classList.add('hidden');
        
        try {
            auth.login(email, password, rememberMe);
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
}

// DOM event handlers for signup page
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        // Clear previous messages
        errorDiv.classList.add('hidden');
        successDiv.classList.remove('hidden');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        try {
            auth.signUp(fullName, email, password);
            successDiv.textContent = 'Account created successfully! Redirecting...';
            successDiv.classList.remove('hidden');
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
}

// Utility function to show/hide elements
document.addEventListener('DOMContentLoaded', function() {
    // Add hidden class utility
    if (!document.querySelector('.hidden')) {
        const style = document.createElement('style');
        style.textContent = '.hidden { display: none !important; }';
        document.head.appendChild(style);
    }
});