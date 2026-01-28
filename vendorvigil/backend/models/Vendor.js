const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: [true, 'Vendor name is required'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'API endpoint URL is required'],
        trim: true
    },
    checkFrequency: {
        type: Number,
        required: true,
        default: 5, // minutes
        min: [1, 'Check frequency must be at least 1 minute']
    },
    timeoutDuration: {
        type: Number,
        required: true,
        default: 4, // seconds
        min: [1, 'Timeout must be at least 1 second'],
        max: [30, 'Timeout cannot exceed 30 seconds']
    },
    latencyThreshold: {
        type: Number,
        default: 500, // milliseconds
        min: [0, 'Latency threshold cannot be negative']
    },
    alertThreshold: {
        type: Number,
        default: 3, // consecutive failures before alert
        min: [1, 'Alert threshold must be at least 1']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastCheckedAt: {
        type: Date,
        default: null
    },
    slackWebhook: {
        type: String,
        default: ''
    },
    alertEmail: {
        type: String,
        default: '' 
    },
    consecutiveFailures: {
        type: Number,
        default: 0
    },
    isAlertSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);
