import React, { useState, useEffect } from 'react';
import { Users, Building2, BookOpen, Star, TrendingUp, Activity } from 'lucide-react';
import api from '../../services/api';
import { DashboardStats } from '../../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: 'İstifadəçilər', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Apteklər', value: stats?.totalPharmacies ?? 0, icon: Building2, color: 'bg-green-100 text-green-600' },
    { label: 'Rezervasiyalar', value: stats?.totalReservations ?? 0, icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
    { label: 'Orta Reytinq', value: stats?.averageRating?.toFixed(1) ?? '0.0', icon: Star, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">İdarəetmə Paneli</h1>
        <p className="text-gray-500 text-sm mt-1">MedSearch platforma statistikaları</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Son Qeydiyyatlar
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : stats?.recentUsers?.length === 0 ? (
            <p className="text-gray-400 text-sm">Məlumat yoxdur</p>
          ) : (
            <div className="space-y-2">
              {stats?.recentUsers?.map((u) => (
                <div key={u._id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.isActive ? 'Aktiv' : 'Deaktiv'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent reservations */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            Son Rezervasiyalar
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : stats?.recentReservations?.length === 0 ? (
            <p className="text-gray-400 text-sm">Məlumat yoxdur</p>
          ) : (
            <div className="space-y-2">
              {stats?.recentReservations?.map((r) => (
                <div key={r._id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {typeof r.userId === 'object' ? r.userId.name : 'İstifadəçi'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {typeof r.pharmacyId === 'object' ? r.pharmacyId.name : 'Aptek'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    r.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {r.status === 'pending' ? 'Gözlənilir' : r.status === 'confirmed' ? 'Təsdiqləndi' : r.status === 'cancelled' ? 'Ləğv edildi' : 'Tamamlandı'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
