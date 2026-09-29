// main.js
document.addEventListener('DOMContentLoaded', function() {
    const studentNameInput = document.getElementById('studentName');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(:disabled)');
    const startBtn = document.getElementById('startBtn');
    
    // Load saved data if exists
    const savedName = localStorage.getItem('studentName');
    const savedSubjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    
    if (savedName) {
        studentNameInput.value = savedName;
    }
    
    // Check saved subjects
    savedSubjects.forEach(subject => {
        const checkbox = document.querySelector(`input[value="${subject}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    // Validate subject selection
    function validateForm() {
        const name = studentNameInput.value.trim();
        const selectedSubjects = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        // English is mandatory and automatically included
        const allSubjects = ['English', ...selectedSubjects];
        
        if (name.length < 2) {
            alert('Please enter your full name');
            return false;
        }
        
        if (allSubjects.length !== 4) {
            alert('Please select exactly 3 additional subjects (total 4 subjects including English)');
            return false;
        }
        
        return { name, subjects: allSubjects };
    }
    
    // Start exam
    startBtn.addEventListener('click', function() {
        const validation = validateForm();
        if (validation) {
            // Save to localStorage
            localStorage.setItem('studentName', validation.name);
            localStorage.setItem('subjects', JSON.stringify(validation.subjects));
            
            // Show loading state
            startBtn.innerHTML = '<div class="spinner"></div> Starting...';
            startBtn.disabled = true;
            
            // Redirect to exam page
            setTimeout(() => {
                window.location.href = 'exam.html';
            }, 1000);
        }
    });
    
    // Limit to 3 additional subjects
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            if (checkedCount > 3) {
                this.checked = false;
                alert('You can only select 3 additional subjects (4 total including English)');
            }
        });
    });
    
    // Enter key support
    studentNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startBtn.click();
        }
    });
});