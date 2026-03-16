import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, ChevronDown, Filter } from 'lucide-react';
import api from '../../services/api';
import { SearchResult } from '../../types';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const medicine = searchParams.get('medicine') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('price_asc');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(medicine);

  const loadResults = (med: string) => {
    if (!med) { setResults([]); setLoading(false); return; }
    setLoading(true);
    api
      .get('/pharmacies/search', { params: { medicine: med, sort, openNow: onlyOpen, inStock: onlyInStock } })
      .then((res) => setResults(res.data.data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadResults(medicine); }, [medicine, sort, onlyOpen, onlyInStock]);

  const handleSearch = () => loadResults(searchQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate('/search')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 input-field"
              placeholder="Dərman axtarın..."
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 pb-2">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-44 text-sm">
                <option value="price_asc">Qiymət: Aşağıdan Yuxarı</option>
                <option value="price_desc">Qiymət: Yuxarıdan Aşağı</option>
                <option value="rating">Reytinq</option>
              </select>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} className="accent-blue-600" />
                Yalnız açıq
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={onlyInStock} onChange={(e) => setOnlyInStock(e.target.checked)} className="accent-blue-600" />
                Stokda var
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {medicine && (
          <p className="text-sm text-gray-500 mb-4">
            "{medicine}" üçün <span className="font-medium text-gray-900">{results.length}</span> nəticə tapıldı
          </p>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nəticə tapılmadı</p>
            <p className="text-gray-400 text-sm mt-2">Digər dərman adı ilə axtarın</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r, i) => (
              <div key={`${r.pharmacy._id}-${i}`} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{r.pharmacy.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < Math.floor(r.pharmacy.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{r.pharmacy.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-xl font-bold text-blue-600">{r.price} ₼</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.inStock ? 'Stokda var' : 'Stokda yox'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {r.pharmacy.address}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  {r.pharmacy.isOpen ? 'Açıqdır' : 'Bağlıdır'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/pharmacy/${r.pharmacy._id}`, { state: { medicine: r.medicine, price: r.price } })}
                    className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Detallara bax
                  </button>
                  <button
                    onClick={() => navigate(`/pharmacy/${r.pharmacy._id}`, { state: { medicine: r.medicine, price: r.price, book: true } })}
                    className="flex-1 btn-primary py-2 text-sm"
                  >
                    Rezervasiya et
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
