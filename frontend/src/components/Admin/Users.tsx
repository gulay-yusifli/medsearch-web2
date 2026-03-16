import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import api from '../../services/api';
import { User } from '../../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get('/users', { params: { search, status: statusFilter === 'all' ? '' : statusFilter, page, limit: 10 } })
      .then((res) => {
        setUsers(res.data.data || []);
        setTotalPages(res.data.pagination?.pages || 1);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu istifadəçini deaktiv etmək istəyirsinizmi?')) return;
    await api.delete(`/users/${id}`);
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: false } : u)));
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">İstifadəçilər</h1>
      </div>

      <div className="card mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ad və ya e-poçt axtar..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as 'all' | 'active' | 'inactive'); setPage(1); }}
          className="input-field w-40"
        >
          <option value="all">Hamısı</option>
          <option value="active">Aktiv</option>
          <option value="inactive">Deaktiv</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr className="text-gray-500">
                <th className="text-left py-3 px-4">Ad</th>
                <th className="text-left py-3 px-4">E-poçt</th>
                <th className="text-left py-3 px-4">Telefon</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Tarix</th>
                <th className="text-left py-3 px-4">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">İstifadəçi tapılmadı</td></tr>
              ) : users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-gray-500">{u.email}</td>
                  <td className="py-3 px-4 text-gray-500">{u.phone || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Aktiv' : 'Deaktiv'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('az')}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(u._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
