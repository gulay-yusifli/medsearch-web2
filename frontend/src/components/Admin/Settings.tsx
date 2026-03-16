import React, { useState } from 'react';
import { Globe, Mail, Bell, Shield, Database } from 'lucide-react';

type Tab = 'general' | 'email' | 'notifications' | 'security' | 'database';

const Settings: React.FC = () => {
  const [tab, setTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'general' as Tab, label: 'Ümumi', icon: Globe },
    { id: 'email' as Tab, label: 'E-poçt', icon: Mail },
    { id: 'notifications' as Tab, label: 'Bildirişlər', icon: Bell },
    { id: 'security' as Tab, label: 'Təhlükəsizlik', icon: Shield },
    { id: 'database' as Tab, label: 'Verilənlər Bazası', icon: Database },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Parametrlər</h1>
      </div>

      <div className="flex gap-6">
        {/* Tab nav */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 card">
          {tab === 'general' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">Ümumi Parametrlər</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sayt Adı</label>
                <input defaultValue="MedSearch" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dil</label>
                <select defaultValue="az" className="input-field">
                  <option value="az">Azərbaycan</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">E-poçt Konfiqurasiyası</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                  <input defaultValue="smtp.gmail.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                  <input defaultValue="587" type="number" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İstifadəçi adı</label>
                  <input placeholder="email@gmail.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şifrə</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">Bildiriş Parametrləri</h2>
              {[
                { label: 'E-poçt bildirişləri', description: 'Yeni rezervasiyalar haqqında e-poçt göndər' },
                { label: 'SMS bildirişləri', description: 'Dərman xatırlatmaları üçün SMS göndər' },
                { label: 'Push bildirişləri', description: 'Tətbiq daxilindəki bildirişlər' },
              ].map((n) => (
                <label key={n.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-medium text-sm">{n.label}</p>
                    <p className="text-xs text-gray-500">{n.description}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
                </label>
              ))}
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">Təhlükəsizlik</h2>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-sm">İkili Faktorlu Doğrulama (2FA)</p>
                  <p className="text-xs text-gray-500">Admin hesabı üçün 2FA aktivləşdir</p>
                </div>
                <input type="checkbox" className="w-4 h-4 accent-blue-600" />
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sessiya Müddəti</label>
                <select defaultValue="7d" className="input-field">
                  <option value="1d">1 gün</option>
                  <option value="7d">7 gün</option>
                  <option value="30d">30 gün</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'database' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 mb-4">Verilənlər Bazası</h2>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">MongoDB Atlas</p>
                <p className="text-xs text-blue-600 mt-1">Bağlantı aktiv</p>
              </div>
              <button className="btn-secondary w-full">
                Yedəkləməni İndir
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            {saved && <span className="text-green-600 text-sm mr-4">Saxlandı!</span>}
            <button onClick={handleSave} className="btn-primary">Saxla</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
