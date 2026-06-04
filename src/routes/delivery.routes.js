const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware'); // JWT auth middleware for protected routes and role-based access control

// All endpoints in this block require a valid active token session
router.use(protect);

// ASSOCIATE ONLY: Pendings dekhna, Dropdown status badalna, aur ticket grab karna
router.get('/pending', restrictTo('ASSOCIATE'), deliveryController.getPendingDeliveries);
router.get('/my-associate-deliveries', restrictTo('ASSOCIATE'), deliveryController.getAssociateDeliveries);
router.put('/:id/status', restrictTo('ASSOCIATE'), deliveryController.updateDeliveryStatus);
router.put('/:id/accept-emergency', restrictTo('ASSOCIATE'), deliveryController.acceptEmergencyRequest);

// MEMBER ONLY: Emergency request create karna + own history
router.get('/my',            restrictTo('MEMBER', 'DONOR'), deliveryController.getMyDeliveries);
router.get('/my-membership', restrictTo('MEMBER', 'DONOR'), deliveryController.getMyMembership);
router.post('/emergency', restrictTo('MEMBER'), deliveryController.raiseEmergencyRequest);

// ADMIN & SUPER_ADMIN ONLY: monitoring routes
router.get('/admin/escalations', restrictTo('ADMIN', 'SUPER_ADMIN'), deliveryController.getAdminEscalations);
router.get('/admin/all', restrictTo('ADMIN', 'SUPER_ADMIN'), deliveryController.getAllDeliveries);
router.put('/admin/schedule-bulk', protect, restrictTo('SUPER_ADMIN', 'ADMIN'), deliveryController.scheduleBulkDeliveries);

// SUPER_ADMIN ONLY: raise emergency on behalf of member (toll-free helpline)
router.post('/admin/emergency-for-member', restrictTo('SUPER_ADMIN'), deliveryController.raiseEmergencyForMember);

module.exports = router;