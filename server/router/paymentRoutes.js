import { Router } from 'express';
import { initiatePayment, verifyEsewaPayment, verifyKhaltiPayment } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router();

// Payment routes
router.post('/initiate', isAuthenticated, initiatePayment);
router.post('/esewa/verify', verifyEsewaPayment);
router.post('/khalti/verify', verifyKhaltiPayment);

export default router;