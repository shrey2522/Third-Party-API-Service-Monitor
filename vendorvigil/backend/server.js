require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initializeCronJobs } = require('./utils/cronScheduler');

const app = express();

// Middleware
const allowedOrigins = [
    'https://third-party-api-service-monitor.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Basic routes
app.get('/', (req, res) => {
    res.json({
        message: 'VendorVigil API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));

// Test endpoint
app.get('/api/test-private', (req, res) => {
    const apiKey = req.headers['x-test-key'];
    if (apiKey === 'SECRET_123') {
        res.status(200).json({ message: 'Success! You accessed a private API.' });
    } else {
        res.status(401).json({ message: 'Unauthorized! Missing or invalid key.' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
    console.log(`📍 API: http://0.0.0.0:${PORT}\n`);
    
    // Initialize cron jobs AFTER server is up
    initializeCronJobs();
});
