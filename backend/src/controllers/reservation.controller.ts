import { Response } from 'express';
import Reservation from '../models/Reservation';
import Pharmacy from '../models/Pharmacy';
import { AuthRequest } from '../middleware/auth.middleware';

export const createReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pharmacyId, medicineId, quantity = 1, reservationDate, notes } = req.body;

    // Find the price from the pharmacy
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) { res.status(404).json({ success: false, message: 'Aptek tapılmadı' }); return; }

    const medicineEntry = pharmacy.medicines.find((m) => String(m.medicineId) === String(medicineId));
    const price = medicineEntry?.price || 0;

    const reservation = await Reservation.create({
      userId: req.user?._id,
      pharmacyId,
      medicineId,
      quantity,
      totalPrice: price * quantity,
      reservationDate,
      notes,
    });

    const populated = await Reservation.findById(reservation._id)
      .populate('pharmacyId', 'name address')
      .populate('medicineId', 'name');

    res.status(201).json({ success: true, data: populated, message: 'Rezervasiya yaradıldı' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getUserReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservations = await Reservation.find({ userId: req.user?._id })
      .sort({ createdAt: -1 })
      .populate('pharmacyId', 'name address')
      .populate('medicineId', 'name');
    res.json({ success: true, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getAllReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));
    const status = String(req.query.status || '');

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const total = await Reservation.countDocuments(query);
    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name email')
      .populate('pharmacyId', 'name')
      .populate('medicineId', 'name');

    res.json({ success: true, data: reservations, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const updateReservationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!reservation) { res.status(404).json({ success: false, message: 'Rezervasiya tapılmadı' }); return; }
    res.json({ success: true, data: reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const cancelReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, userId: req.user?._id });
    if (!reservation) { res.status(404).json({ success: false, message: 'Rezervasiya tapılmadı' }); return; }
    if (!['pending', 'confirmed'].includes(reservation.status)) {
      res.status(400).json({ success: false, message: 'Bu rezervasiyanı ləğv etmək mümkün deyil' });
      return;
    }
    reservation.status = 'cancelled';
    await reservation.save();
    res.json({ success: true, data: reservation, message: 'Rezervasiya ləğv edildi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};
