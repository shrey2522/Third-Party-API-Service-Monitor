const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        default: null
    },
    duration: {
        type: Number, // minutes
        default: 0
    },
    consecutiveFailures: {
        type: Number,
        required: true
    },
    resolved: {
        type: Boolean,
        default: false
    },
    alertSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for querying active incidents
incidentSchema.index({ vendorId: 1, resolved: 1 });

module.exports = mongoose.model('Incident', incidentSchema);
