import { Router } from 'express';
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
} from '../controllers/medicine.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getMedicines);
router.get('/search', searchMedicines);
router.get('/:id', getMedicineById);
router.post('/', authenticate, requireAdmin, createMedicine);
router.put('/:id', authenticate, requireAdmin, updateMedicine);
router.delete('/:id', authenticate, requireAdmin, deleteMedicine);

export default router;
