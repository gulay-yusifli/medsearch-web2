import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Edit, User, Calendar, Bell, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Reservation } from '../../types';

type Tab = 'reservations' | 'schedule' | 'reminders';

const statusLabels: Record<string, string> = {
  pending: 'Gözlənilir',
  confirmed: 'Təsdiqləndi',
  cancelled: 'Ləğv edildi',
  completed: 'Tamamlandı',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
};

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoaded, setReservationsLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const loadReservations = async () => {
    if (reservationsLoaded) return;
    const res = await api.get('/reservations/my');
    setReservations(res.data.data || []);
    setReservationsLoaded(true);
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    if (t === 'reservations') loadReservations();
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await api.put('/auth/profile', { name: editName, phone: editPhone });
      updateUser(updated.data.data);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 pt-8 pb-16 text-white">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="font-bold text-lg">Profilim</h1>
          <button onClick={handleLogout} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-10">
        {/* User card */}
        <div className="card mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              {editMode ? (
                <div className="space-y-2">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field text-sm" placeholder="Ad" />
                  <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="input-field text-sm" placeholder="Telefon" />
                  <div className="flex gap-2">
                    <button onClick={() => setEditMode(false)} className="btn-secondary text-xs px-3 py-1.5"><X className="w-3 h-3" /></button>
                    <button onClick={handleSaveProfile} disabled={saving} className="btn-primary text-xs px-3 py-1.5 disabled:opacity-60"><Check className="w-3 h-3" /></button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-gray-900 text-lg">{user?.name}</h2>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                  {user?.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
                  <button onClick={() => setEditMode(true)} className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <Edit className="w-3 h-3" /> Redaktə et
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-4">
          {([
            { id: 'reservations' as Tab, label: 'Rezervasiyalar', icon: Calendar },
            { id: 'schedule' as Tab, label: 'Cədvəl', icon: Bell },
            { id: 'reminders' as Tab, label: 'Xatırlatmalar', icon: Bell },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                tab === id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'reservations' && (
          <div className="space-y-3 pb-6">
            {reservations.length === 0 ? (
              <div className="card text-center py-8 text-gray-400">Rezervasiya tapılmadı</div>
            ) : reservations.map((r) => (
              <div key={r._id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {typeof r.medicineId === 'object' ? r.medicineId.name : 'Dərman'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {typeof r.pharmacyId === 'object' ? r.pharmacyId.name : 'Aptek'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(r.reservationDate).toLocaleDateString('az')}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}>
                    {statusLabels[r.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'schedule' && (
          <div className="card text-center py-8 text-gray-400 mb-4">
            <p className="mb-3">Günlük cədvəli idarə edin</p>
            <button onClick={() => navigate('/schedule')} className="btn-primary text-sm">Cədvələ Keç</button>
          </div>
        )}

        {tab === 'reminders' && (
          <div className="card text-center py-8 text-gray-400 mb-4">
            <p>Xatırlatmalarınız yoxdur</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
