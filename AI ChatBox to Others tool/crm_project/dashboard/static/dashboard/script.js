// Extracted from <script> in CRM.html
// AI Chat Widget Toggle Logic
const aiToggle = document.getElementById('aiToggle');
const aiChat = document.getElementById('aiChat');
const aiClose = document.getElementById('aiClose');
const aiInput = document.getElementById('aiInput');
const aiSend = document.getElementById('aiSend');
const aiMessages = document.getElementById('aiMessages');
const aiSuggestions = document.querySelectorAll('.ai-suggestion');

aiToggle.addEventListener('click', () => {
    aiChat.classList.add('open');
    setTimeout(() => aiInput.focus(), 200);
});
aiClose.addEventListener('click', () => {
    aiChat.classList.remove('open');
});

aiSend.addEventListener('click', sendMessage);
aiInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sendMessage();
});

aiSuggestions.forEach(suggestion => {
    suggestion.addEventListener('click', function() {
        aiInput.value = this.getAttribute('data-prompt');
        aiInput.focus();
    });
});

function sendMessage() {
    const text = aiInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    aiInput.value = '';
    // Simulate AI response
    setTimeout(() => {
        let response = '';
        if (text.toLowerCase().includes('top')) {
            response = 'Your top performing customers are: TechCorp Inc., Global Solutions, and DataSystems.';
        } else if (text.toLowerCase().includes('trend')) {
            response = 'Sales trends for this quarter show a 12% increase in revenue and a 9% increase in new leads.';
        } else if (text.toLowerCase().includes('follow')) {
            response = 'Leads needing follow-up: Michael Chen, Emma Rodriguez, and David Kim.';
        } else if (text.toLowerCase().includes('pipeline')) {
            response = 'Pipeline analysis: 68% conversion rate, 247 active deals, and 57 closed won.';
        } else {
            response = 'I have received your request: "' + text + '". (This is a simulated response.)';
        }
        appendMessage(response, 'assistant');
    }, 1200);
}

function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = 'ai-message ' + sender;
    msg.innerHTML = text;
    aiMessages.appendChild(msg);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}
