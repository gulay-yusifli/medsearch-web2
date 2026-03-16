import { Router } from 'express';
import {
  getPharmacies,
  getNearbyPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  searchPharmaciesByMedicine,
} from '../controllers/pharmacy.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getPharmacies);
router.get('/nearby', authenticate, getNearbyPharmacies);
router.get('/search', authenticate, searchPharmaciesByMedicine);
router.get('/:id', authenticate, getPharmacyById);
router.post('/', authenticate, requireAdmin, createPharmacy);
router.put('/:id', authenticate, requireAdmin, updatePharmacy);
router.delete('/:id', authenticate, requireAdmin, deletePharmacy);

export default router;
