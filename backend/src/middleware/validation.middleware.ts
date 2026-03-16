import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    return;
  }
  next();
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Ad ən az 2 simvol olmalıdır'),
  body('email').isEmail().withMessage('Düzgün e-poçt daxil edin').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Şifrə ən az 6 simvol olmalıdır'),
  handleValidation,
];

export const loginValidation = [
  body('email').isEmail().withMessage('Düzgün e-poçt daxil edin').normalizeEmail(),
  body('password').notEmpty().withMessage('Şifrə tələb olunur'),
  handleValidation,
];

export const pharmacyValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Aptek adı ən az 2 simvol olmalıdır'),
  body('address').trim().isLength({ min: 5 }).withMessage('Ünvan ən az 5 simvol olmalıdır'),
  handleValidation,
];

export const reservationValidation = [
  body('pharmacyId').isMongoId().withMessage('Etibarsız aptek ID'),
  body('medicineId').isMongoId().withMessage('Etibarsız dərman ID'),
  body('reservationDate').isISO8601().withMessage('Düzgün tarix daxil edin'),
  handleValidation,
];
