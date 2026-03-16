import { Request, Response } from 'express';
import Medicine from '../models/Medicine';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMedicines = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '20'));
    const search = String(req.query.search || '');
    const category = String(req.query.category || '');

    const query: Record<string, unknown> = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { genericName: { $regex: search, $options: 'i' } }];
    if (category) query.category = category;

    const total = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query).skip((page - 1) * limit).limit(limit);
    res.json({ success: true, data: medicines, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getMedicineById = async (req: Request, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) { res.status(404).json({ success: false, message: 'Dərman tapılmadı' }); return; }
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const createMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const updateMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) { res.status(404).json({ success: false, message: 'Dərman tapılmadı' }); return; }
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const deleteMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Dərman silindi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const searchMedicines = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = String(req.query.q || '');
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { genericName: { $regex: q, $options: 'i' } },
        { activeIngredient: { $regex: q, $options: 'i' } },
      ],
    }).limit(20);
    res.json({ success: true, data: medicines });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};
