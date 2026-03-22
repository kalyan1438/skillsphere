// adminRoutes.js
import { Router } from 'express';
import { loginAdmin, getMe, getDashboard } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.post('/login',    loginAdmin);
router.get('/me',        protect, getMe);
router.get('/dashboard', protect, getDashboard);
export default router;
