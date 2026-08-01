import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, Bot, MessageSquare, Building2, Stethoscope, Briefcase, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { initialBotSettings, initialBranches, initialDoctors, initialServices } from '../data/initialData.js';

import api from '../api';
import { useEffect } from 'react';

function TelegramBot() {
  const [botSettings, setBotSettings] = useLocalStorage('botSettings', initialBotSettings);
  const [branches, setBranches] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(botSettings);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchRes, doctorRes, serviceRes] = await Promise.all([
        api.get('/admin/branch'),
        api.get('/admin/user?role=doctor'),
        api.get('/admin/service')
      ]);
      setBranches(branchRes || []);
      setDoctors(doctorRes || []);
      setServices(serviceRes || []);
    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBotSettings(formData);
    toast.success('Bot sozlamalari saqlandi');
  };

  const toggleBranchBot = async (id, currentStatus) => {
    try {
      await api.put(`/admin/branch/${id}`, { show_in_bot: !currentStatus });
      setBranches(branches.map(b => b.id === id ? { ...b, show_in_bot: !currentStatus } : b));
      toast.success('Harakat muvaffaqiyatli');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleDoctorBot = async (id, currentStatus) => {
    try {
      await api.put(`/admin/user/${id}`, { show_in_bot: !currentStatus });
      setDoctors(doctors.map(d => d.id === id ? { ...d, show_in_bot: !currentStatus } : d));
      toast.success('Harakat muvaffaqiyatli');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleServiceBot = async (id, currentStatus) => {
    try {
      await api.put(`/admin/service/${id}`, { show_in_bot: !currentStatus });
      setServices(services.map(s => s.id === id ? { ...s, show_in_bot: !currentStatus } : s));
      toast.success('Harakat muvaffaqiyatli');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Telegram Bot</h1>
          <p className="text-muted-foreground">Bot sozlamalari va integratsiya</p>
        </div>
        <Link
          to="/bot-simulator"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Bot className="w-5 h-5" />
          Bot Simulyator
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bot Messages */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Bot xabarlari</h3>
              <p className="text-sm text-muted-foreground">Foydalanuvchilarga yuboriladigan xabarlar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Salomlash xabari</label>
              <textarea
                value={formData.welcomeText}
                onChange={(e) => setFormData({ ...formData, welcomeText: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">To'lov xabari</label>
              <textarea
                value={formData.paymentText}
                onChange={(e) => setFormData({ ...formData, paymentText: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Navbat tasdiqlash xabari</label>
              <textarea
                value={formData.queueConfirmText}
                onChange={(e) => setFormData({ ...formData, queueConfirmText: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Ish vaqti xabari</label>
              <input
                type="text"
                value={formData.workingHoursText}
                onChange={(e) => setFormData({ ...formData, workingHoursText: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save className="w-5 h-5" />
              Saqlash
            </button>
          </form>
        </div>

        {/* Bot Preview */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Bot ko'rinishi</h3>
              <p className="text-sm text-muted-foreground">Foydalanuvchi ko'radigan ko'rinish</p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="bg-primary/10 rounded-lg p-3">
              <p className="text-sm text-foreground">{formData.welcomeText}</p>
            </div>
            <div className="space-y-2">
              {branches.filter(b => b.show_in_bot && b.is_active).map(branch => (
                <div key={branch.id} className="bg-background rounded-lg p-2 text-sm text-foreground border border-border">
                  📍 {branch.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visibility Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branches */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Filiallar</h3>
          </div>
          <div className="space-y-2">
            {branches.map(branch => (
              <div key={branch.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                <span className="text-sm text-foreground">{branch.name}</span>
                <button
                  onClick={() => toggleBranchBot(branch.id, branch.show_in_bot)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${branch.show_in_bot
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {branch.show_in_bot ? 'Chiqadi' : 'Chiqmaydi'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Doctors */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Shifokorlar</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {doctors.map(doctor => (
              <div key={doctor.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                <div>
                  <span className="text-sm text-foreground block">{doctor.name}</span>
                  <span className="text-xs text-muted-foreground">{doctor.specialization}</span>
                </div>
                <button
                  onClick={() => toggleDoctorBot(doctor.id, doctor.show_in_bot)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${doctor.show_in_bot
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {doctor.show_in_bot ? 'Chiqadi' : 'Chiqmaydi'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Xizmatlar</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {services.map(service => (
              <div key={service.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                <span className="text-sm text-foreground">{service.name}</span>
                <button
                  onClick={() => toggleServiceBot(service.id, service.show_in_bot)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${service.show_in_bot
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-muted text-muted-foreground'
                    }`}
                >
                  {service.show_in_bot ? 'Chiqadi' : 'Chiqmaydi'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelegramBot;
