const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./connection');
const urlRoute = require('./routes/url');

const app = express();
const port = 8003;

// Connect to MongoDB
connectDB('mongodb://127.0.0.1:27017/discord-short-url')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(() => console.log('❌ Could not connect to MongoDB - make sure MongoDB is running'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/url', urlRoute);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'URL Shortener API is running' });
});

app.listen(port, () => {
    console.log(`🚀 URL Shortener Server running on http://localhost:${port}`);
});
