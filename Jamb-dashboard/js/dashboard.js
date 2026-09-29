// dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    const auth = new AuthSystem();
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info in the dashboard
    document.getElementById('userName').textContent = currentUser.fullName;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('welcomeName').textContent = currentUser.fullName;
    
    // Update progress
    const progressText = document.getElementById('progressText');
    if (currentUser.examsTaken > 0) {
        progressText.textContent = `${currentUser.examsTaken} exam(s) taken`;
        progressText.style.color = 'var(--good)';
        progressText.style.fontWeight = '600';
    }
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            auth.logout();
        }
    });
});

function viewResults() {
    alert('Previous results feature coming soon!');
    // This would typically show a history of previous exam results
}