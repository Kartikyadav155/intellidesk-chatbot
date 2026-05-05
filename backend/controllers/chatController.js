const mongoose = require('mongoose');

// Define Chat Schema directly here
const chatSchema = new mongoose.Schema({
    userMessage: String,
    botResponse: String,
    channel: {
        type: String,
        default: 'website'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    userEmail: String,
    sessionId: String
});

const Chat = mongoose.model('Chat', chatSchema);

console.log('Chat model:', Chat);
console.log('Is constructor?', typeof Chat === 'function');

// Simple AI Response Logic
const generateAIResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return 'Hello! Welcome to IntelliDesk. How can I assist you today?';
    } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
        return 'Our pricing starts at ₹999/month. Would you like detailed information?';
    } else if (lowerMsg.includes('support') || lowerMsg.includes('help')) {
        return 'I am here to help! Please describe your issue and I will assist you.';
    } else if (lowerMsg.includes('thank')) {
        return 'You are welcome! Feel free to reach out anytime.';
    } else {
        return 'Thank you for your message. Our support team will respond shortly. Can you provide more details?';
    }
};

// Rest of the code stays the same...

// Handle Chat Message
const sendMessage = async (req, res) => {
    try {
        console.log('📨 Received message:', req.body);
        
        const { message, channel, userEmail, sessionId } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }
        
        // Generate AI Response
        const botResponse = generateAIResponse(message);
        console.log('🤖 Bot response:', botResponse);
        
        // Save to Database
        const newChat = new Chat({
            userMessage: message,
            botResponse: botResponse,
            channel: channel || 'website',
            userEmail: userEmail || '',
            sessionId: sessionId || 'default'
        });
        
        await newChat.save();
        console.log('✅ Chat saved to database');
        
        res.status(200).json({
            success: true,
            response: botResponse,
            timestamp: new Date()
        });
        
    } catch (error) {
        console.error('❌ Error in sendMessage:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Chat History
const getChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const chats = await Chat.find({ sessionId }).sort({ timestamp: 1 });
        
        res.status(200).json({
            success: true,
            chats: chats
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getChatHistory
};