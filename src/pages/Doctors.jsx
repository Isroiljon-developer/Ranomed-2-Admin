import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, X, User, Shield, Building2,
  Image as ImageIcon, DollarSign, Briefcase, Search, Filter
} from 'lucide-react';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
    specialization: '',
    filialId: '',
    salary: '',
    photo: '',
    role: 'doctor',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, branchRes] = await Promise.all([
        api.get('/admin/user?role=doctor'),
        api.get('/admin/branch')
      ]);
      setDoctors(docRes || []);
      setBranches(branchRes || []);
    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await api.post('/upload', uploadData);
      setFormData(prev => ({ ...prev, photo: res.path }));
      toast.success("Rasm yuklandi");
    } catch (err) {
      toast.error("Rasm yuklashda xatolik");
    }
  };

  const getImageUrl = (path) => {
    if (!path || path === 'default_avatar.png') return null;
    if (path.startsWith('http')) return path;
    const rootUrl = 'http://localhost:9000';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${rootUrl}${cleanPath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        const data = { ...formData };
        if (!data.password) delete data.password;
        await api.put(`/admin/user/${editingDoctor.id}`, data);
        toast.success("Ma'lumotlar yangilandi");
      } else {
        await api.post('/admin/user', formData);
        toast.success("Yangi shifokor qo'shildi");
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/admin/user/${id}`);
      toast.success("Shifokor o'chirildi");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = !branchFilter || doc.filialId === Number(branchFilter);
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shifokorlar</h1>
          <p className="text-muted-foreground">Shifokorlar ro'yxati va samaradorligi</p>
        </div>
        <button
          onClick={() => { setEditingDoctor(null); setFormData({ name: '', username: '', password: '', phone: '', specialization: '', filialId: '', salary: '', photo: '', role: 'doctor', is_active: true }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi shifokor
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Shifokor qidirish..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-64">
          <select
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="">Barcha filiallar</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {doctor.photo && doctor.photo !== 'default_avatar.png' ? (
                      <img src={getImageUrl(doctor.photo)} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{doctor.name}</h3>
                    <p className="text-sm text-primary font-medium">{doctor.specialization || 'Shifokor'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingDoctor(doctor); setFormData({ ...doctor, password: '' }); setShowForm(true); }} className="p-2 hover:bg-accent rounded-lg text-muted-foreground"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(doctor.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Filial</p>
                  <p className="text-sm font-medium">{doctor.Branch?.name || 'Markaziy'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="text-sm font-medium">{doctor.phone || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Oylik</p>
                  <p className="text-sm font-medium">{doctor.salary ? Number(doctor.salary).toLocaleString() : '0'} so'm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${doctor.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {doctor.is_active ? 'FAOL' : 'NOFAOL'}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{doctor.username}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)}></div>
          <div className="relative bg-card rounded-xl border border-border p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1 hover:bg-accent rounded text-muted-foreground"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-semibold mb-6 text-foreground">{editingDoctor ? 'Tahrirlash' : 'Yangi shifokor'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-border flex items-center justify-center group cursor-pointer bg-muted">
                  {formData.photo && formData.photo !== 'default_avatar.png' ? (
                    <img src={getImageUrl(formData.photo)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2 text-muted-foreground"><ImageIcon className="w-6 h-6 mx-auto" /><p className="text-[10px]">Rasm</p></div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Ism familiya</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground" required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Username</label>
                  <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Parol</label>
                  <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground" required={!editingDoctor} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Filial</label>
                  <select value={formData.filialId} onChange={e => setFormData({ ...formData, filialId: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground" required>
                    <option value="">Tanlang</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Mutaxassislik</label>
                  <input type="text" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Telefon</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground" />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Oylik (so'm)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-foreground" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg text-foreground">Bekor qilish</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg">{editingDoctor ? 'Saqlash' : "Qo'shish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
