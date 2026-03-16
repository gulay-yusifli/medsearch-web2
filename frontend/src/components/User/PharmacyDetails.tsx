import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Clock, Navigation, MessageCircle, X } from 'lucide-react';
import api from '../../services/api';
import { Pharmacy, Medicine } from '../../types';
import GoogleMapComponent from '../Map/GoogleMap';

interface LocationState {
  medicine?: Medicine;
  price?: number;
  book?: boolean;
}

const PharmacyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReserve, setShowReserve] = useState(state?.book || false);
  const [reserveDate, setReserveDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reserving, setReserving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/pharmacies/${id}`)
      .then((res) => setPharmacy(res.data.data))
      .catch(() => setPharmacy(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReserve = async () => {
    if (!pharmacy || !state?.medicine || !reserveDate) return;
    setReserving(true);
    try {
      await api.post('/reservations', {
        pharmacyId: pharmacy._id,
        medicineId: state.medicine._id,
        quantity,
        reservationDate: reserveDate,
      });
      setSuccess(true);
      setTimeout(() => { setShowReserve(false); setSuccess(false); }, 2000);
    } catch {
      alert('Rezervasiya zamanı xəta baş verdi');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Aptek tapılmadı</p>
          <button onClick={() => navigate(-1)} className="btn-primary">Geri qayıt</button>
        </div>
      </div>
    );
  }

  const coords = {
    lat: pharmacy.location?.coordinates[1] || 40.4093,
    lng: pharmacy.location?.coordinates[0] || 49.8671,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-semibold text-gray-900 flex-1 truncate">{pharmacy.name}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Main card */}
        <div className="card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{pharmacy.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(pharmacy.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{pharmacy.rating.toFixed(1)} ({pharmacy.reviewCount} rəy)</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${pharmacy.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {pharmacy.isOpen ? 'Açıqdır' : 'Bağlıdır'}
            </span>
          </div>

          {state?.medicine && (
            <div className="bg-blue-50 rounded-xl p-3 mb-3">
              <p className="text-sm font-medium text-blue-900">{state.medicine.name}</p>
              <p className="text-2xl font-bold text-blue-600">{state.price} ₼</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              {pharmacy.address}
            </div>
            {pharmacy.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {pharmacy.phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              İş saatları: 08:00 – 22:00
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3">
          {pharmacy.phone && (
            <a href={`tel:${pharmacy.phone}`} className="card flex flex-col items-center gap-2 py-4 text-green-600 hover:bg-green-50 transition-colors">
              <Phone className="w-6 h-6" />
              <span className="text-xs font-medium">Zəng et</span>
            </a>
          )}
          <a
            href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex flex-col items-center gap-2 py-4 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Navigation className="w-6 h-6" />
            <span className="text-xs font-medium">İstiqamətlər</span>
          </a>
          <button
            onClick={() => navigate('/consultation')}
            className="card flex flex-col items-center gap-2 py-4 text-purple-600 hover:bg-purple-50 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Konsultasiya</span>
          </button>
        </div>

        {/* Map */}
        <div className="card p-0 overflow-hidden rounded-xl">
          <GoogleMapComponent center={coords} markers={[{ position: coords, title: pharmacy.name }]} height="250px" />
        </div>

        {/* Reserve button */}
        {state?.medicine && (
          <button onClick={() => setShowReserve(true)} className="w-full btn-primary py-4 text-base">
            Rezervasiya et
          </button>
        )}
      </div>

      {/* Reserve modal */}
      {showReserve && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rezervasiya Et</h3>
              <button onClick={() => setShowReserve(false)}><X className="w-5 h-5" /></button>
            </div>
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
                <p className="font-semibold text-gray-900">Rezervasiya yaradıldı!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {state?.medicine && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium">{state.medicine.name}</p>
                    <p className="text-gray-500">{pharmacy.name}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Tarix</label>
                  <input type="datetime-local" value={reserveDate} onChange={(e) => setReserveDate(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Miqdar</label>
                  <input type="number" min="1" max="100" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="input-field w-24" />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setShowReserve(false)} className="btn-secondary flex-1">Ləğv et</button>
                  <button onClick={handleReserve} disabled={reserving || !reserveDate} className="btn-primary flex-1 disabled:opacity-60">
                    {reserving ? 'Göndərilir...' : 'Təsdiqlə'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDetails;
