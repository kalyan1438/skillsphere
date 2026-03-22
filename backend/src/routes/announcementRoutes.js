import { Router } from 'express';
import { getAnnouncements, getAllAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/',       getAnnouncements);
router.get('/all',    protect, getAllAnnouncements);
router.post('/',      protect, createAnnouncement);
router.delete('/:id', protect, deleteAnnouncement);
export default router;
