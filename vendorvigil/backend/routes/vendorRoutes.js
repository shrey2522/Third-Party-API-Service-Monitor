const express = require('express');
const router = express.Router();
const {
    getVendors,
    getVendorById,
    getVendorLogs,
    addVendor,
    updateVendor,
    toggleVendor,
    deleteVendor,
} = require('../controllers/vendorController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getVendors).post(protect, addVendor);
router.route('/:id').get(protect, getVendorById).put(protect, updateVendor).delete(protect, deleteVendor);
router.route('/:id/logs').get(protect, getVendorLogs);
router.route('/:id/toggle').patch(protect, toggleVendor);

module.exports = router;
