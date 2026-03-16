import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'Bu e-poçt artıq istifadə olunur' });
      return;
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(String(user._id), user.role);

    res.status(201).json({
      success: true,
      data: { token, user },
      message: 'Qeydiyyat uğurlu oldu',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'E-poçt və ya şifrə yanlışdır' });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ success: false, message: 'Hesabınız deaktiv edilmişdir' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'E-poçt və ya şifrə yanlışdır' });
      return;
    }

    const token = generateToken(String(user._id), user.role);

    res.json({
      success: true,
      data: { token, user },
      message: 'Giriş uğurlu oldu',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, chronicDiseases, avatar } = req.body;
    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (chronicDiseases) updates.chronicDiseases = chronicDiseases;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user?._id, updates, { new: true });
    res.json({ success: true, data: user, message: 'Profil yeniləndi' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server xətası' });
    console.error(err);
  }
};
