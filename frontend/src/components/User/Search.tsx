import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, Camera, MapPin, DollarSign, Stethoscope, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const popularMedicines = ['Paracetamol', 'Ibuprofen', 'Amoksisilin', 'Aspirin', 'Metformin', 'Lisinopril', 'Omeprazol', 'Atorvastatin'];

const MedicineSearch: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  const handleSearch = (q?: string) => {
    const term = q || query;
    if (!term.trim()) return;
    navigate(`/results?medicine=${encodeURIComponent(term.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 pt-8 pb-20 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg">MedSearch</h1>
                <p className="text-blue-100 text-xs">Sağlamlığınız üçün</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
            >
              <User className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-1">Salam, {user?.name?.split(' ')[0]}!</h2>
            <p className="text-blue-100 text-sm">Hansı dərmanı axtarırsınız?</p>
          </div>

          {/* Search bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Dərman adı ilə axtarın..."
              className="w-full pl-12 pr-24 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-base shadow-lg"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Mic className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={!query.trim()}
            className="w-full mt-3 bg-white text-blue-600 font-semibold py-3 rounded-2xl hover:bg-blue-50 transition-colors disabled:opacity-60 shadow-lg"
          >
            Axtar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-8">
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Search, label: 'Sürətli Axtarış', color: 'bg-blue-600', action: () => document.querySelector('input')?.focus() },
            { icon: MapPin, label: 'Yaxın Apteklər', color: 'bg-green-500', action: () => navigate('/results?nearby=true') },
            { icon: DollarSign, label: 'Qiymət Müqayisəsi', color: 'bg-purple-600', action: () => navigate('/results') },
          ].map(({ icon: Icon, label, color, action }) => (
            <button
              key={label}
              onClick={action}
              className="card flex flex-col items-center justify-center gap-2 py-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
            </button>
          ))}
        </div>

        {/* Popular medicines */}
        <div className="card mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Populyar Dərmanlar</h3>
          <div className="flex flex-wrap gap-2">
            {popularMedicines.map((med) => (
              <button
                key={med}
                onClick={() => handleSearch(med)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                {med}
              </button>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 pb-6">
          <button
            onClick={() => navigate('/schedule')}
            className="card flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm text-gray-900">Dərman Cədvəli</p>
              <p className="text-xs text-gray-500">Günlük xatırlatmalar</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/consultation')}
            className="card flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm text-gray-900">AI Konsultasiya</p>
              <p className="text-xs text-gray-500">Suallar verin</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineSearch;
