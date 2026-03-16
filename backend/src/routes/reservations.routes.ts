import { Router } from 'express';
import {
  createReservation,
  getUserReservations,
  getAllReservations,
  updateReservationStatus,
  cancelReservation,
} from '../controllers/reservation.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { reservationValidation } from '../middleware/validation.middleware';

const router = Router();

router.use(authenticate);

router.post('/', reservationValidation, createReservation);
router.get('/my', getUserReservations);
router.put('/:id/cancel', cancelReservation);
router.get('/', requireAdmin, getAllReservations);
router.put('/:id/status', requireAdmin, updateReservationStatus);

export default router;
