const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

console.log('🔄 Attempting MongoDB connection...');
console.log('Connection string:', mongoURI ? 'Found in .env' : 'NOT FOUND in .env');

mongoose.connect(mongoURI)
.then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('Database name: intellidesk');
})
.catch(err => {
    console.log('❌ MongoDB Connection Error:');
    console.log('Error message:', err.message);
});

// API Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Serve Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 IntelliDesk Server running on port ${PORT}`);
});