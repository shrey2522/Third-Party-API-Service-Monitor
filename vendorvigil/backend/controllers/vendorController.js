const Vendor = require('../models/Vendor');
const Log = require('../models/Log');

// @desc    Get vendors with latest log status
// @route   GET /api/vendors
// @access  Private
const getVendors = async (req, res) => {
    try {
        // Use aggregation to join vendors with their latest log
        const vendors = await Vendor.aggregate([
            { $match: { user: req.user._id } }, // Match vendors for current user
            {
                $lookup: {
                    from: 'logs',
                    localField: '_id',
                    foreignField: 'vendorId',
                    pipeline: [
                        { $sort: { timestamp: -1 } },
                        { $limit: 1 }
                    ],
                    as: 'latestLog'
                }
            },
            {
                $addFields: {
                    latestLog: { $arrayElemAt: ['$latestLog', 0] }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set vendor
// @route   POST /api/vendors
// @access  Private
const addVendor = async (req, res) => {
    const { name, url, checkFrequency, slackWebhook, alertEmail } = req.body;

    if (!name || !url) {
        return res.status(400).json({ message: 'Please add name and url' });
    }

    try {
        const vendor = await Vendor.create({
            name,
            url,
            checkFrequency: checkFrequency || 5,
            slackWebhook,
            alertEmail,
            user: req.user.id
        });

        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle vendor active status
// @route   PATCH /api/vendors/:id/toggle
// @access  Private
const toggleVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if (vendor.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        vendor.isActive = !vendor.isActive;
        await vendor.save();

        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private
const deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the vendor user
        if (vendor.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await vendor.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor logs for charts
// @route   GET /api/vendors/:id/logs
// @access  Private
const getVendorLogs = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if (vendor.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Get last 50 logs for charts, sorted by time descending (newest first)
        const logs = await Log.find({ vendorId: req.params.id })
            .sort({ timestamp: -1 })
            .limit(50);
        
        // Return logs as is (newest first) for table, or reverse if chart needs ascending
        // The table expects newest first usually.
        // If the chart needs ascending (oldest to newest), the frontend should reverse it for the chart specifically.
        // For now, let's return descending (newest first) so the table is correct.
        // Wait, current code does: .sort({ timestamp: -1 }).limit(50).reverse() -> returns Oldest to Newest.
        // If the user sees OLD logs in the table, it means the API is returning Oldest first.
        // So effectively, the table is showing Oldest...
        // To fix the table (Newest at top), we should return Newest First.
        // But the Chart likely expects Oldest->Newest.
        // So we should return Newest->Oldest (Descending) and let the Frontend reverse it for the chart.
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single vendor details
// @route   GET /api/vendors/:id
// @access  Private
const getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if (vendor.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVendor = async (req, res) => {
    try {
        const { name, url, checkFrequency, slackWebhook, alertEmail } = req.body;
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if (vendor.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        vendor.name = name || vendor.name;
        vendor.url = url || vendor.url;
        vendor.checkFrequency = checkFrequency || vendor.checkFrequency;
        vendor.slackWebhook = slackWebhook !== undefined ? slackWebhook : vendor.slackWebhook;
        vendor.alertEmail = alertEmail !== undefined ? alertEmail : vendor.alertEmail;

        await vendor.save();

        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVendors,
    getVendorById,
    getVendorLogs,
    addVendor,
    updateVendor,
    toggleVendor,
    deleteVendor,
};
