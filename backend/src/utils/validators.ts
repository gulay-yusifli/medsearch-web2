export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return /^\+?[\d\s\-()]{7,15}$/.test(phone);
};

export const isStrongPassword = (password: string): boolean => {
  return password.length >= 8;
};
