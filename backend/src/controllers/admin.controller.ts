import { Response } from 'express';
import User from '../models/User';
import Pharmacy from '../models/Pharmacy';
import Reservation from '../models/Reservation';
import Analytics from '../models/Analytics';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalPharmacies, totalReservations, recentUsers, recentReservations, ratingAgg] =
      await Promise.all([
        User.countDocuments({ isActive: true }),
        Pharmacy.countDocuments({ isActive: true }),
        Reservation.countDocuments(),
        User.find().sort({ createdAt: -1 }).limit(5).select('name email isActive'),
        Reservation.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').populate('pharmacyId', 'name'),
        Pharmacy.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
      ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPharmacies,
        totalReservations,
        averageRating: ratingAgg[0]?.avg || 0,
        recentUsers,
        recentReservations,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { from, to } = req.query;
    const query: Record<string, unknown> = {};
    if (from) query.date = { $gte: new Date(String(from)) };
    if (to) query.date = { ...(query.date as object || {}), $lte: new Date(String(to)) };

    const analytics = await Analytics.find(query).sort({ date: 1 }).limit(30);
    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
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
};
