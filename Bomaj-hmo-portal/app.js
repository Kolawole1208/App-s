// Sample Benefits Data - You can replace this with your full list
const benefitsData = [
    { benefit: "24 Hour Creatinine Clearance", status: "Covered" },
    { benefit: "ALT (Sgpt) Serum", status: "Covered" },
    { benefit: "Access To Gyms For Regular Exercise", status: "COVERED (1 SESSIONS PER WEEK)" },
    { benefit: "Access To Prescribed Drugs", status: "COVERED" },
    { benefit: "Advanced Ocular Tests", status: "NOT COVERED" },
    { benefit: "After-Demise Compensation", status: "COVERED (UP TO 50,000 NAIRA LIMIT)" },
    { benefit: "Annual Visual Acuity Check", status: "Covered" },
    { benefit: "Arthroscopy", status: "NOT COVERED" },
    { benefit: "Blood Group Check", status: "NOT COVERED" },
    { benefit: "CT Scan", status: "COVERED (1 SESSION PER ANNUM)" },
    { benefit: "Dialysis And All Related Care", status: "COVERED (3 SESSIONS PER YEAR)" },
];

// Function to display benefits in the table
function displayBenefits(benefitsArray) {
    const tableBody = document.getElementById('benefitsTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (benefitsArray.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="2" style="text-align: center;">No benefits found matching your search.</td></tr>';
        return;
    }

    benefitsArray.forEach(item => {
        const row = document.createElement('tr');
        
        // Determine status class and display text
        let statusClass, statusText;
        if (item.status.toUpperCase().includes('NOT COVERED')) {
            statusClass = 'status-not-covered';
            statusText = 'Not Covered';
        } else {
            statusClass = 'status-covered';
            statusText = item.status;
        }

        row.innerHTML = `
            <td>${item.benefit}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to handle search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        const filteredBenefits = benefitsData.filter(item => 
            item.benefit.toLowerCase().includes(searchTerm) || 
            item.status.toLowerCase().includes(searchTerm)
        );
        
        displayBenefits(filteredBenefits);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Display all benefits initially
    displayBenefits(benefitsData);
    
    // Setup the search functionality
    setupSearch();
    
    console.log('Bomaj HMO Member Portal loaded successfully!');
});