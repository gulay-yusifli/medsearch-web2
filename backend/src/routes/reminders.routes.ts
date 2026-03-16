import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import MedicineReminder from '../models/MedicineReminder';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminders = await MedicineReminder.find({ userId: req.user?._id, isActive: true });
    res.json({ success: true, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
});

router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminder = await MedicineReminder.create({ ...req.body, userId: req.user?._id });
    res.status(201).json({ success: true, data: reminder });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await MedicineReminder.findOneAndUpdate({ _id: req.params.id, userId: req.user?._id }, { isActive: false });
    res.json({ success: true, message: 'Xatırlatma silindi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
});

export default router;
