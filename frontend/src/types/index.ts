export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  avatar?: string;
  chronicDiseases: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyMedicineEntry {
  medicineId: string;
  medicine?: Medicine;
  price: number;
  inStock: boolean;
}

export interface Pharmacy {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  workingHours?: Record<string, { open: string; close: string; isOpen: boolean }>;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  medicines: PharmacyMedicineEntry[];
  isActive: boolean;
  createdAt: string;
}

export interface Medicine {
  _id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  activeIngredient: string;
  manufacturer: string;
  requiresPrescription: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface Reservation {
  _id: string;
  userId: string | User;
  pharmacyId: string | Pharmacy;
  medicineId: string | Medicine;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reservationDate: string;
  notes?: string;
  createdAt: string;
}

export interface MedicineReminder {
  _id: string;
  userId: string;
  medicineName: string;
  dosage: string;
  frequency: 'daily' | 'weekly';
  times: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  chronicDisease?: string;
  reminderType: 'app' | 'sms' | 'email';
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  userId: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  conversationId: string;
  isRead: boolean;
  createdAt: string;
}

export interface SearchResult {
  pharmacy: Pharmacy;
  medicine: Medicine;
  price: number;
  inStock: boolean;
  distance: number | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalPharmacies: number;
  totalReservations: number;
  averageRating: number;
  recentUsers: User[];
  recentReservations: Reservation[];
}

export interface AnalyticsData {
  _id: string;
  date: string;
  totalSearches: number;
  newUsers: number;
  totalReservations: number;
  popularMedicines: { name: string; count: number }[];
  popularPharmacies: { name: string; count: number }[];
}
