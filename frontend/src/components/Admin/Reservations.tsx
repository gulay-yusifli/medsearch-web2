import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Reservation } from '../../types';

type Status = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
};
const statusLabels: Record<string, string> = {
  pending: 'Gözlənilir',
  confirmed: 'Təsdiqləndi',
  cancelled: 'Ləğv edildi',
  completed: 'Tamamlandı',
};

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status>('all');

  useEffect(() => {
    setLoading(true);
    api
      .get('/reservations', { params: { status: statusFilter === 'all' ? '' : statusFilter } })
      .then((res) => setReservations(res.data.data || []))
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: status as Reservation['status'] } : r))
      );
    } catch {
      alert('Xəta baş verdi');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rezervasiyalar</h1>
      </div>

      <div className="card mb-6 flex gap-2 flex-wrap">
        {(['all', 'pending', 'confirmed', 'cancelled', 'completed'] as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {s === 'all' ? 'Hamısı' : statusLabels[s]}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr className="text-gray-500">
                <th className="text-left py-3 px-4">İstifadəçi</th>
                <th className="text-left py-3 px-4">Aptek</th>
                <th className="text-left py-3 px-4">Dərman</th>
                <th className="text-left py-3 px-4">Tarix</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reservations.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Rezervasiya tapılmadı</td></tr>
              ) : reservations.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">
                    {typeof r.userId === 'object' ? r.userId.name : String(r.userId)}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {typeof r.pharmacyId === 'object' ? r.pharmacyId.name : String(r.pharmacyId)}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {typeof r.medicineId === 'object' ? r.medicineId.name : String(r.medicineId)}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(r.reservationDate).toLocaleDateString('az')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status]}`}>
                      {statusLabels[r.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusUpdate(r._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="pending">Gözlənilir</option>
                      <option value="confirmed">Təsdiqlə</option>
                      <option value="completed">Tamamla</option>
                      <option value="cancelled">Ləğv et</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reservations;
