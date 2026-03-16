import { Response } from 'express';
import MedicineReminder from '../models/MedicineReminder';
import { AuthRequest } from '../middleware/auth.middleware';

export const getReminders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminders = await MedicineReminder.find({ userId: req.user?._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const createReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminder = await MedicineReminder.create({ ...req.body, userId: req.user?._id });
    res.status(201).json({ success: true, data: reminder });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const updateReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminder = await MedicineReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      req.body,
      { new: true }
    );
    if (!reminder) { res.status(404).json({ success: false, message: 'Xatırlatma tapılmadı' }); return; }
    res.json({ success: true, data: reminder });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const deleteReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await MedicineReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?._id },
      { isActive: false }
    );
    res.json({ success: true, message: 'Xatırlatma silindi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};
