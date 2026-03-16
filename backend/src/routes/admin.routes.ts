import { Router, Response } from 'express';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import Pharmacy from '../models/Pharmacy';
import Reservation from '../models/Reservation';
import Analytics from '../models/Analytics';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/dashboard', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalPharmacies, totalReservations, pharmacies, recentUsers, recentReservations] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Pharmacy.countDocuments({ isActive: true }),
      Reservation.countDocuments(),
      Pharmacy.find({ isActive: true }).select('rating'),
      User.find().sort({ createdAt: -1 }).limit(5),
      Reservation.find().sort({ createdAt: -1 }).limit(5)
        .populate('userId', 'name email')
        .populate('pharmacyId', 'name'),
    ]);
    const averageRating = pharmacies.length > 0
      ? pharmacies.reduce((s, p) => s + p.rating, 0) / pharmacies.length
      : 0;
    res.json({ success: true, data: { totalUsers, totalPharmacies, totalReservations, averageRating, recentUsers, recentReservations } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
});

router.get('/analytics', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { from, to } = req.query;
    const query: Record<string, unknown> = {};
    if (from || to) {
      const fromDate = from ? new Date(String(from)) : undefined;
      const toDate = to ? new Date(String(to)) : undefined;
      if ((fromDate && isNaN(fromDate.getTime())) || (toDate && isNaN(toDate.getTime()))) {
        res.status(400).json({ success: false, message: 'Etibarsız tarix formatı' });
        return;
      }
      const dateFilter: Record<string, Date> = {};
      if (fromDate) dateFilter.$gte = fromDate;
      if (toDate) dateFilter.$lte = toDate;
      query.date = dateFilter;
    }
    const analytics = await Analytics.find(query).sort({ date: 1 }).limit(90);
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
});

router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [users, pharmacies, reservations] = await Promise.all([
      User.countDocuments(),
      Pharmacy.countDocuments(),
      Reservation.countDocuments(),
    ]);
    res.json({ success: true, data: { users, pharmacies, reservations } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
});

export default router;
