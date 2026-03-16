import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MedicineSearch from './components/User/Search';
import Results from './components/User/Results';
import PharmacyDetails from './components/User/PharmacyDetails';
import Profile from './components/User/Profile';
import MedicineSchedule from './components/User/MedicineSchedule';
import AIConsultation from './components/Chat/AIConsultation';
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import Users from './components/Admin/Users';
import Pharmacies from './components/Admin/Pharmacies';
import Reservations from './components/Admin/Reservations';
import Analytics from './components/Admin/Analytics';
import AdminChat from './components/Admin/Chat';
import Settings from './components/Admin/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/search" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/search" element={<ProtectedRoute><MedicineSearch /></ProtectedRoute>} />
    <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
    <Route path="/pharmacy/:id" element={<ProtectedRoute><PharmacyDetails /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/schedule" element={<ProtectedRoute><MedicineSchedule /></ProtectedRoute>} />
    <Route path="/consultation" element={<ProtectedRoute><AIConsultation /></ProtectedRoute>} />

    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="pharmacies" element={<Pharmacies />} />
      <Route path="reservations" element={<Reservations />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="chat" element={<AdminChat />} />
      <Route path="settings" element={<Settings />} />
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
