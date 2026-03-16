import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { Pharmacy } from '../../types';

interface PharmacyForm {
  name: string;
  address: string;
  phone: string;
  isOpen: boolean;
}

const Pharmacies: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PharmacyForm>({ name: '', address: '', phone: '', isOpen: true });

  const load = () => {
    setLoading(true);
    api
      .get('/pharmacies', { params: { search } })
      .then((res) => setPharmacies(res.data.data || []))
      .catch(() => setPharmacies([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', address: '', phone: '', isOpen: true });
    setShowModal(true);
  };

  const openEdit = (p: Pharmacy) => {
    setEditing(p._id);
    setForm({ name: p.name, address: p.address, phone: p.phone || '', isOpen: p.isOpen });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.address) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await api.put(`/pharmacies/${editing}`, form);
        setPharmacies((prev) => prev.map((p) => (p._id === editing ? res.data.data : p)));
      } else {
        const res = await api.post('/pharmacies', form);
        setPharmacies((prev) => [res.data.data, ...prev]);
      }
      setShowModal(false);
    } catch {
      alert('Xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu apteki silmək istəyirsinizmi?')) return;
    await api.delete(`/pharmacies/${id}`);
    setPharmacies((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Apteklər</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Aptek Əlavə Et
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Aptek axtar..."
            className="input-field pl-10"
          />
        </div>
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
                <th className="text-left py-3 px-4">Ad</th>
                <th className="text-left py-3 px-4">Ünvan</th>
                <th className="text-left py-3 px-4">Telefon</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Dərmanlar</th>
                <th className="text-left py-3 px-4">Əməliyyat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pharmacies.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Aptek tapılmadı</td></tr>
              ) : pharmacies.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{p.address}</td>
                  <td className="py-3 px-4 text-gray-500">{p.phone || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.isOpen ? 'Açıq' : 'Bağlı'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{p.medicines?.length || 0}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editing ? 'Apteki Redaktə Et' : 'Aptek Əlavə Et'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aptek adı *" className="input-field" />
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Ünvan *" className="input-field" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" className="input-field" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isOpen} onChange={(e) => setForm({ ...form, isOpen: e.target.checked })} />
                Hazırda açıqdır
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Ləğv et</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saxlanır...' : 'Saxla'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacies;
