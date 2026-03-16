import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, X, Sun, Sunset, Moon, Star } from 'lucide-react';
import api from '../../services/api';
import { MedicineReminder } from '../../types';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface ScheduleEntry extends MedicineReminder {
  timeOfDay: TimeOfDay;
  completed?: boolean;
}

const timeLabels: Record<TimeOfDay, { label: string; time: string }> = {
  morning: { label: 'Səhər', time: '08:00' },
  afternoon: { label: 'Gündüz', time: '13:00' },
  evening: { label: 'Axşam', time: '19:00' },
  night: { label: 'Gecə', time: '22:00' },
};

const MedicineSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminders, setReminders] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ medicineName: '', dosage: '', timeOfDay: 'morning' as TimeOfDay, chronicDisease: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get('/reminders')
      .then((res) => {
        const data = (res.data.data || []) as MedicineReminder[];
        const getTimeOfDay = (time: string): TimeOfDay => {
          const hour = parseInt(time?.split(':')[0] ?? '0', 10);
          if (hour < 11) return 'morning';
          if (hour < 16) return 'afternoon';
          if (hour < 21) return 'evening';
          return 'night';
        };
        const entries: ScheduleEntry[] = data.map((r) => ({
          ...r,
          timeOfDay: getTimeOfDay(r.times?.[0] ?? '08:00'),
        }));
        setReminders(entries);
      })
      .catch(() => setReminders([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleComplete = (id: string) => {
    setReminders((prev) => prev.map((r) => (r._id === id ? { ...r, completed: !r.completed } : r)));
  };

  const handleAdd = async () => {
    if (!newMed.medicineName || !newMed.dosage) return;
    setSaving(true);
    try {
      const res = await api.post('/reminders', {
        medicineName: newMed.medicineName,
        dosage: newMed.dosage,
        times: [timeLabels[newMed.timeOfDay].time],
        startDate: selectedDate,
        chronicDisease: newMed.chronicDisease || undefined,
      });
      setReminders((prev) => [...prev, { ...res.data.data, timeOfDay: newMed.timeOfDay }]);
      setShowAdd(false);
      setNewMed({ medicineName: '', dosage: '', timeOfDay: 'morning', chronicDisease: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/reminders/${id}`);
    setReminders((prev) => prev.filter((r) => r._id !== id));
  };

  const groups: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-4 pt-8 pb-16 text-white">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg">Günlük Dərman Cədvəli</h1>
          </div>
          <button onClick={() => setShowAdd(true)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-10 pb-6">
        {/* Date selector */}
        <div className="card mb-4">
          <label className="text-sm text-gray-500 mb-1 block">Tarix seçin</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field" />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((tod) => {
              const meds = reminders.filter((r) => r.timeOfDay === tod);
              const { label, time } = timeLabels[tod];
              const IconComp = tod === 'morning' ? Sun : tod === 'afternoon' ? Sun : tod === 'evening' ? Sunset : Moon;
              return (
                <div key={tod}>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{label} – {time}</span>
                  </div>
                  {meds.length === 0 ? (
                    <p className="text-xs text-gray-400 px-2">Bu vaxt üçün dərman yoxdur</p>
                  ) : (
                    <div className="space-y-2">
                      {meds.map((r) => (
                        <div key={r._id} className={`card flex items-center gap-3 transition-opacity ${r.completed ? 'opacity-50' : ''}`}>
                          <button onClick={() => toggleComplete(r._id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${r.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                            {r.completed && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${r.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{r.medicineName}</p>
                            <p className="text-xs text-gray-500">{r.dosage}</p>
                            {r.chronicDisease && (
                              <p className="text-xs text-purple-600 mt-0.5 flex items-center gap-1">
                                <Star className="w-3 h-3" />{r.chronicDisease}
                              </p>
                            )}
                          </div>
                          <button onClick={() => handleDelete(r._id)} className="p-1 text-red-400 hover:text-red-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Dərman Əlavə Et</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input value={newMed.medicineName} onChange={(e) => setNewMed({ ...newMed, medicineName: e.target.value })} placeholder="Dərman adı *" className="input-field" />
              <input value={newMed.dosage} onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })} placeholder="Doza (məs: 1 həb, 5ml) *" className="input-field" />
              <select value={newMed.timeOfDay} onChange={(e) => setNewMed({ ...newMed, timeOfDay: e.target.value as TimeOfDay })} className="input-field">
                {groups.map((g) => <option key={g} value={g}>{timeLabels[g].label} ({timeLabels[g].time})</option>)}
              </select>
              <input value={newMed.chronicDisease} onChange={(e) => setNewMed({ ...newMed, chronicDisease: e.target.value })} placeholder="Xronik xəstəlik (isteğe bağlı)" className="input-field" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Ləğv et</button>
              <button onClick={handleAdd} disabled={saving || !newMed.medicineName} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Əlavə edilir...' : 'Əlavə et'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineSchedule;
