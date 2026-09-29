// Add this to check for common issues
function debugSetup() {
    console.log('=== DEBUG INFO ===');
    console.log('LocalStorage available:', typeof(Storage) !== "undefined");
    console.log('Form element found:', !!document.getElementById('loginForm'));
    console.log('Current URL:', window.location.href);
    console.log('Index.html exists:', checkPageExists('index.html'));
    console.log('==================');
}

function checkPageExists(page) {
    // Simple check - you can enhance this
    return true; // Assume it exists for now
}

// Run debug on load
debugSetup();