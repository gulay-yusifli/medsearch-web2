import { Request, Response } from 'express';
import Pharmacy from '../models/Pharmacy';
import Medicine from '../models/Medicine';
import { AuthRequest } from '../middleware/auth.middleware';

export const getPharmacies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));
    const search = String(req.query.search || '');

    const query: Record<string, unknown> = { isActive: true };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { address: { $regex: search, $options: 'i' } }];

    const total = await Pharmacy.countDocuments(query);
    const pharmacies = await Pharmacy.find(query)
      .populate({ path: 'medicines.medicineId', model: 'Medicine' })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, data: pharmacies, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getNearbyPharmacies = async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = parseFloat(String(req.query.lat || '40.4093'));
    const lng = parseFloat(String(req.query.lng || '49.8671'));
    const maxDist = parseInt(String(req.query.maxDistance || '5000'));

    const pharmacies = await Pharmacy.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: maxDist,
        },
      },
    }).limit(20).populate({ path: 'medicines.medicineId', model: 'Medicine' });

    res.json({ success: true, data: pharmacies });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getPharmacyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id).populate({ path: 'medicines.medicineId', model: 'Medicine' });
    if (!pharmacy) { res.status(404).json({ success: false, message: 'Aptek tapılmadı' }); return; }
    res.json({ success: true, data: pharmacy });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const createPharmacy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pharmacy = await Pharmacy.create(req.body);
    res.status(201).json({ success: true, data: pharmacy });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const updatePharmacy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pharmacy) { res.status(404).json({ success: false, message: 'Aptek tapılmadı' }); return; }
    res.json({ success: true, data: pharmacy });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const deletePharmacy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Pharmacy.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Aptek silindi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const searchPharmaciesByMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    const medicineName = String(req.query.medicine || '');
    const inStock = req.query.inStock !== 'false';
    const openNow = req.query.openNow === 'true';

    if (!medicineName) { res.status(400).json({ success: false, message: 'Dərman adı tələb olunur' }); return; }

    // Find medicines by name
    const medicines = await Medicine.find({ name: { $regex: medicineName, $options: 'i' } });
    const medicineIds = medicines.map((m) => m._id);

    if (medicineIds.length === 0) { res.json({ success: true, data: [] }); return; }

    const pharmacyQuery: Record<string, unknown> = {
      isActive: true,
      'medicines.medicineId': { $in: medicineIds },
    };
    if (inStock) pharmacyQuery['medicines.inStock'] = true;
    if (openNow) pharmacyQuery.isOpen = true;

    const pharmacies = await Pharmacy.find(pharmacyQuery).populate({ path: 'medicines.medicineId', model: 'Medicine' });

    // Build result set
    const results = pharmacies.flatMap((pharmacy) =>
      pharmacy.medicines
        .filter((me) => {
          const mid = me.medicineId;
          const matchesMedicine = medicineIds.some((id) => String(id) === String(mid));
          if (!matchesMedicine) return false;
          if (inStock && !me.inStock) return false;
          return true;
        })
        .map((me) => {
          const medicine = medicines.find((m) => String(m._id) === String(me.medicineId));
          return { pharmacy, medicine, price: me.price, inStock: me.inStock, distance: null };
        })
    );

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};
