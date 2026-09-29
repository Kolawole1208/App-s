// Dashboard functionality
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Get DOM elements
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Show corresponding section
        const section = item.getAttribute('data-section');
        showSection(section);
    });
});

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Load section-specific data
    if (sectionName === 'overview') {
        loadDashboardData();
    } else if (sectionName === 'appointments') {
        loadAppointments();
    } else if (sectionName === 'profile') {
        loadProfile();
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('No token found');
            return;
        }
        
        const [statsResponse, appointmentsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }),
            fetch(`${API_BASE_URL}/appointments`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
        ]);
        
        // Check if responses are ok
        if (!statsResponse.ok || !appointmentsResponse.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const statsData = await statsResponse.json();
        const appointmentsData = await appointmentsResponse.json();
        
        if (statsData.success) {
            updateStats(statsData.stats);
        } else {
            console.error('Stats error:', statsData.message);
        }
        
        if (appointmentsData.success) {
            updateRecentAppointments(appointmentsData.appointments);
        } else {
            console.error('Appointments error:', appointmentsData.message);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Show user-friendly error message
        const container = document.getElementById('recent-appointments-list');
        if (container) {
            container.innerHTML = '<p>Error loading appointments. Please try again.</p>';
        }
    }
}

function updateStats(stats) {
    const totalEl = document.getElementById('total-appointments');
    const upcomingEl = document.getElementById('upcoming-appointments');
    const completedEl = document.getElementById('completed-appointments');
    
    if (totalEl) totalEl.textContent = stats.total_appointments || 0;
    if (upcomingEl) upcomingEl.textContent = stats.upcoming_appointments || 0;
    if (completedEl) completedEl.textContent = stats.completed_appointments || 0;
}

function updateRecentAppointments(appointments) {
    const container = document.getElementById('recent-appointments-list');
    
    if (!container) return;
    
    if (!appointments || appointments.length === 0) {
        container.innerHTML = '<p>No appointments found.</p>';
        return;
    }
    
    const recentAppointments = appointments.slice(0, 5); // Show only 5 most recent
    
    container.innerHTML = recentAppointments.map(appointment => `
        <div class="appointment-item">
            <div class="appointment-info">
                <strong>${appointment.doctor_name || 'Unknown Doctor'}</strong>
                <span>${appointment.scheduled_date || 'No date'} at ${appointment.scheduled_time || 'No time'}</span>
            </div>
            <span class="status-badge status-${appointment.status || 'scheduled'}">${appointment.status || 'scheduled'}</span>
        </div>
    `).join('');
}

// Load Appointments
async function loadAppointments() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('No token found');
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }
        
        const data = await response.json();
        
        if (data.success) {
            updateAppointmentsTable(data.appointments);
        } else {
            console.error('Appointments error:', data.message);
            updateAppointmentsTable([]);
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        updateAppointmentsTable([]);
    }
}

function updateAppointmentsTable(appointments) {
    const tbody = document.getElementById('appointments-table-body');
    
    if (!tbody) return;
    
    if (!appointments || appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No appointments found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = appointments.map(appointment => `
        <tr>
            <td>${appointment.scheduled_date || 'N/A'}</td>
            <td>${appointment.scheduled_time || 'N/A'}</td>
            <td>${appointment.doctor_name || 'N/A'}</td>
            <td>${appointment.patient_name || 'N/A'}</td>
            <td><span class="status-badge status-${appointment.status || 'scheduled'}">${appointment.status || 'scheduled'}</span></td>
        </tr>
    `).join('');
}

// Load Profile
function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const roleEl = document.getElementById('profile-role');
    
    if (nameEl) nameEl.textContent = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Not available';
    if (emailEl) emailEl.textContent = user.email || 'Not available';
    if (roleEl) roleEl.textContent = user.role || 'Not available';
}

// Logout
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            if (dashboardContainer) dashboardContainer.classList.add('hidden');
            if (authContainer) authContainer.classList.remove('hidden');
            
            // Reset forms
            const loginForm = document.getElementById('loginForm');
            if (loginForm) loginForm.reset();
        });
    }
});

// Add CSS for status badges and appointment items
const style = document.createElement('style');
style.textContent = `
    .appointment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
        background: var(--surface-color);
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .appointment-info {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .appointment-info strong {
        color: var(--text-primary);
        font-weight: 600;
    }
    
    .appointment-info span {
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: capitalize;
    }
    
    .status-scheduled {
        background: #fef3c7;
        color: #92400e;
    }
    
    .status-confirmed {
        background: #d1fae5;
        color: #065f46;
    }
    
    .status-completed {
        background: #dbeafe;
        color: #1e40af;
    }
    
    .status-cancelled {
        background: #fee2e2;
        color: #991b1b;
    }
    
    .appointments-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
`;

// Add the styles to the document head
document.head.appendChild(style);

// Initialize dashboard when loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard
    if (dashboardContainer && !dashboardContainer.classList.contains('hidden')) {
        loadDashboardData();
    }
});