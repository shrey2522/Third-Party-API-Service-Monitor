const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    latency: {
        type: Number,
        required: true // milliseconds
    },
    status: {
        type: String,
        enum: ['Healthy', 'Down'],
        required: true
    },
    statusCode: {
        type: Number
    },
    errorMessage: {
        type: String,
        default: null
    }
}, {
    timeseries: {
        timeField: 'timestamp',
        metaField: 'vendorId',
        granularity: 'minutes'
    }
});

// Index for faster queries by vendor + time
logSchema.index({ vendorId: 1, timestamp: -1 });

// TTL index — auto-delete logs older than 30 days
// The background thread runs every ~60s to delete expired documents
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Log', logSchema);
