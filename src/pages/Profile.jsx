import { useState, useEffect } from 'react';
import { User, Phone, Save, Key, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get('/auth/me');
      setUser(data);
      setFormData({
        name: data.name,
        phone: data.phone || '',
        password: ''
      });
    } catch (error) {
      toast.error('Profilni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/auth/profile', formData);
      toast.success('Profil yangilandi');
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Profil Sozlamalari</h1>
        <p className="text-muted-foreground">Shaxsiy ma'lumotlaringizni boshqarish</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="md:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-4 border-background shadow-md">
                   {user?.photo ? (
                       <img src={`http://localhost:9000/uploads/${user.photo}`} className="w-full h-full rounded-full object-cover" />
                   ) : (
                       <UserCircle className="w-16 h-16 text-primary" />
                   )}
            </div>
            <h3 className="text-xl font-bold text-foreground">{user?.name}</h3>
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mt-1">{user?.role}</p>
            <div className="mt-4 pt-4 border-t border-border">
               <div className="flex justify-between text-sm mb-2">
                   <span className="text-muted-foreground">Login:</span>
                   <span className="font-medium">{user?.username}</span>
               </div>
               <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Filial:</span>
                   <span className="font-medium">{user?.Branch?.name || 'Markaziy'}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
             <div className="p-6 border-b border-border">
                <h4 className="font-semibold">Ma'lumotlarni tahrirlash</h4>
             </div>
             <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">To'liq ism</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Telefon</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Yangi parol (ixtiyoriy)</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="password"
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                </div>
             </div>
             <div className="p-6 bg-muted/30 border-t border-border flex justify-end">
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    disabled={saving}
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
