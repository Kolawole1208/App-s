const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const homePage = document.getElementById('homePage');
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const profilePage = document.getElementById('profilePage');

const homeLink = document.getElementById('homeLink');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');
const profileLink = document.getElementById('profileLink');
const logoutLink = document.getElementById('logoutLink');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const podcastsList = document.getElementById('podcastsList');
const profileInfo = document.getElementById('profileInfo');

let currentUser = null;

// Event Listeners for navigation
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('home');
    loadPodcasts();
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('login');
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('register');
});

profileLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('profile');
    loadProfile();
});

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

// Form submissions
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateNavigation();
            showPage('home');
            loadPodcasts();
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateNavigation();
            showPage('home');
            loadPodcasts();
        } else {
            alert('Registration failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration');
    }
});

// Functions
function showPage(page) {
    homePage.style.display = 'none';
    loginPage.style.display = 'none';
    registerPage.style.display = 'none';
    profilePage.style.display = 'none';

    if (page === 'home') {
        homePage.style.display = 'block';
    } else if (page === 'login') {
        loginPage.style.display = 'block';
    } else if (page === 'register') {
        registerPage.style.display = 'block';
    } else if (page === 'profile') {
        profilePage.style.display = 'block';
    }
}

function updateNavigation() {
    if (currentUser) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        profileLink.style.display = 'block';
        logoutLink.style.display = 'block';
        profileLink.textContent = currentUser.username;
    } else {
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        profileLink.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}

async function loadPodcasts() {
    try {
        const response = await fetch(`${API_BASE_URL}/podcasts`);
        const data = await response.json();

        if (data.success) {
            podcastsList.innerHTML = '';
            data.podcasts.forEach(podcast => {
                const podcastElement = document.createElement('div');
                podcastElement.className = 'card podcast-card';
                podcastElement.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${podcast.title}</h5>
                        <p class="card-text">${podcast.description}</p>
                        <p class="card-text"><small class="text-muted">Category: ${podcast.category}</small></p>
                        <p class="card-text"><small class="text-muted">Host: ${podcast.host.username}</small></p>
                        <audio controls class="w-100">
                            <source src="http://localhost:5000${podcast.audioUrl}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                `;
                podcastsList.appendChild(podcastElement);
            });
        } else {
            podcastsList.innerHTML = '<p>Failed to load podcasts.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        podcastsList.innerHTML = '<p>Error loading podcasts.</p>';
    }
}

async function loadProfile() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            profileInfo.innerHTML = `
                <p><strong>Username:</strong> ${data.user.username}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>Role:</strong> ${data.user.role}</p>
            `;
        } else {
            profileInfo.innerHTML = '<p>Failed to load profile.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        profileInfo.innerHTML = '<p>Error loading profile.</p>';
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateNavigation();
    showPage('home');
    loadPodcasts();
}

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        // You might want to validate the token by calling /api/auth/me
        // For simplicity, we assume the token is valid and set a default user
        // In a real app, you should validate the token and get the user data
        currentUser = { username: 'User' }; // Placeholder
    }
    updateNavigation();
    showPage('home');
    loadPodcasts();
});