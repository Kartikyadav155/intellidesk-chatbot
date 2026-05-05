// Generate unique session ID
const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Send Message Function
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const channel = document.getElementById('channelSelect').value;
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    console.log('Sending message:', message);
    
    // Display user message
    displayMessage(message, 'user');
    userInput.value = '';
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = '<p>IntelliDesk is typing...</p>';
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    try {
        console.log('Fetching from: http://localhost:5000/api/chat/send');
        
        // Send to backend
        const response = await fetch('http://localhost:5000/api/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                channel: channel,
                sessionId: sessionId
            })
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        // Remove typing indicator
        chatBox.removeChild(typingDiv);
        
        // Display bot response
        if (data.success) {
            displayMessage(data.response, 'bot');
        } else {
            displayMessage('Sorry, something went wrong. Error: ' + data.error, 'bot');
        }
        
    } catch (error) {
        console.error('Fetch error:', error);
        chatBox.removeChild(typingDiv);
        displayMessage('Connection error. Please check if server is running on port 5000.', 'bot');
    }
}

// Display Message in Chat
function displayMessage(text, sender) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <p>${text}</p>
        <span class="timestamp">${timeString}</span>
    `;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send on Enter key
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

console.log('Script loaded. Session ID:', sessionId);