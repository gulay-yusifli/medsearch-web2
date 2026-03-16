import api from './api';
import { User } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', { email, password });
  return res.data.data!;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<AuthResponse> => {
  const res = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', {
    name, email, password, phone,
  });
  return res.data.data!;
};

export const getProfile = async (): Promise<User> => {
  const res = await api.get<{ success: boolean; data: User }>('/auth/profile');
  return res.data.data!;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const res = await api.put<{ success: boolean; data: User }>('/auth/profile', data);
  return res.data.data!;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
