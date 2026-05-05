const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Send Message
router.post('/send', chatController.sendMessage);

// Get Chat History
router.get('/history/:sessionId', chatController.getChatHistory);

module.exports = router;