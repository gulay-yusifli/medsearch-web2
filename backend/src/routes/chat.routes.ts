import { Router } from 'express';
import { sendMessage, getChatHistory, getAdminChats, sendAdminMessage } from '../controllers/chat.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/message', sendMessage);
router.get('/history', getChatHistory);
router.get('/admin/all', requireAdmin, getAdminChats);
router.post('/admin/reply', requireAdmin, sendAdminMessage);

export default router;
