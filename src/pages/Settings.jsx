import { useState } from 'react';
import { Save, Building2, Palette, Globe, Clock } from 'lucide-react';
import { toast } from 'sonner';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { initialSettings } from '../data/initialData.js';

function Settings() {
  const [settings, setSettings] = useLocalStorage('clinicSettings', initialSettings);
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings(formData);
    toast.success('Sozlamalar saqlandi');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sozlamalar</h1>
        <p className="text-muted-foreground">Klinika umumiy sozlamalari</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Umumiy sozlamalar</h3>
              <p className="text-sm text-muted-foreground">Klinika nomi va logosi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Klinika nomi</label>
              <input
                type="text"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Ko'rinish sozlamalari</h3>
              <p className="text-sm text-muted-foreground">Rang va tema</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Asosiy rang</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Localization Settings */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Til va mintaqa</h3>
              <p className="text-sm text-muted-foreground">Til, vaqt zonasi va valyuta</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Til</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="uz">O'zbekcha</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Vaqt zonasi</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Asia/Tashkent">Toshkent (UTC+5)</option>
                <option value="Asia/Samarkand">Samarqand (UTC+5)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Valyuta</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="UZS">O'zbek so'mi (UZS)</option>
                <option value="USD">Dollar (USD)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save className="w-5 h-5" />
            Saqlash
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
