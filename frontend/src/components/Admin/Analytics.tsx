import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Users, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { AnalyticsData } from '../../types';

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get('/admin/analytics', { params: { from: from || undefined, to: to || undefined } })
      .then((res) => setData(res.data.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [from, to]);

  const totalSearches = data.reduce((s, d) => s + d.totalSearches, 0);
  const totalUsers = data.reduce((s, d) => s + d.newUsers, 0);
  const totalReservations = data.reduce((s, d) => s + d.totalReservations, 0);
  const maxSearches = Math.max(...data.map((d) => d.totalSearches), 1);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analitika</h1>
      </div>

      {/* Date range */}
      <div className="card mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Başlanğıc tarixi</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input-field w-44" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Son tarix</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input-field w-44" />
        </div>
        <button onClick={() => { setFrom(''); setTo(''); }} className="btn-secondary">Sıfırla</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Ümumi Axtarışlar', value: totalSearches, icon: BarChart2, color: 'text-blue-600 bg-blue-100' },
          { label: 'Yeni İstifadəçilər', value: totalUsers, icon: Users, color: 'text-green-600 bg-green-100' },
          { label: 'Rezervasiyalar', value: totalReservations, icon: BookOpen, color: 'text-purple-600 bg-purple-100' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color} mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : kpi.value}</p>
              <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="card mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Günlük Axtarışlar
        </h2>
        {loading ? (
          <div className="h-40 bg-gray-100 rounded animate-pulse" />
        ) : data.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Məlumat yoxdur</p>
        ) : (
          <div className="flex items-end gap-1 h-40 overflow-x-auto">
            {data.map((d) => (
              <div key={d._id} className="flex flex-col items-center gap-1 flex-shrink-0" style={{ minWidth: 24 }}>
                <div
                  className="w-5 bg-blue-500 rounded-t"
                  style={{ height: `${(d.totalSearches / maxSearches) * 120}px`, minHeight: 2 }}
                  title={`${new Date(d.date).toLocaleDateString('az')}: ${d.totalSearches} axtarış`}
                />
                <span className="text-xs text-gray-400 rotate-45 origin-left">{new Date(d.date).toLocaleDateString('az', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
