import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, X, Building2, Layout, Users, DollarSign, Image as ImageIcon } from 'lucide-react';

export default function Wards() {
  const [wards, setWards] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWard, setEditingWard] = useState(null);
  const [viewingWard, setViewingWard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    filialId: '',
    type: 'Standard',
    capacity: 4,
    price_per_day: 0,
    image: '',
    is_active: true
  });

  useEffect(() => {
    fetchWards();
    fetchBranches();
  }, []);

  const fetchWards = async () => {
    try {
      const res = await api.get('/admin/ward');
      setWards(res || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get('/admin/branch');
      setBranches(res || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await api.post('/upload', uploadData);
      setFormData(prev => ({ ...prev, image: res.path }));
      toast.success("Rasm yuklandi");
    } catch (err) {
      console.error('Upload error:', err);
      toast.error("Rasm yuklashda xatolik: " + (err.message || "Server xatosi"));
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const hostname = window.location.hostname || 'localhost';
    const rootUrl = `http://${hostname}:9000`;
    const cleanPath = path.toString().replace(/\\/g, '/');
    const formattedPath = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
    return `${rootUrl}${formattedPath}`.replace(/([^:]\/)\/+/g, "$1");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWard) {
        await api.put(`/admin/ward/${editingWard.id}`, formData);
        toast.success('Palata yangilandi');
      } else {
        await api.post('/admin/ward', formData);
        toast.success('Yangi palata qo\'shildi');
      }
      fetchWards();
      setShowForm(false);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haqiqatan ham bu palatani o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/admin/ward/${id}`);
      setWards(wards.filter(w => w.id !== id));
      toast.success('Palata o\'chirildi');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      filialId: '',
      type: 'Standard',
      capacity: 4,
      price_per_day: 0,
      image: '',
      is_active: true
    });
    setEditingWard(null);
  };

  const openEditForm = (ward) => {
    setEditingWard(ward);
    setFormData({
      name: ward.name,
      filialId: ward.filialId,
      type: ward.type,
      capacity: ward.capacity,
      price_per_day: ward.price_per_day,
      image: ward.image || '',
      is_active: ward.is_active
    });
    setShowForm(true);
  };

  const getBranchName = (id) => {
    const branch = branches.find(b => b.id === Number(id));
    return branch ? branch.name : 'Topilmadi';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Palatalar</h1>
          <p className="text-muted-foreground">Statsionar palatalarni boshqarish</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi palata
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wards.map(ward => (
          <div
            key={ward.id}
            className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setViewingWard(ward)}
          >
            <div className="h-48 bg-muted relative">
              {ward.image ? (
                <img
                  src={getImageUrl(ward.image)}
                  alt={ward.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Layout className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => openEditForm(ward)}
                  className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(ward.id)}
                  className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-destructive/10 transition-colors group"
                >
                  <Trash2 className="w-4 h-4 text-destructive group-hover:text-destructive" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
                {getBranchName(ward.filialId)}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">Palata #{ward.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ward.type === 'VIP' ? 'bg-yellow-500/10 text-yellow-500' :
                  ward.type === 'Lux' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                  {ward.type}
                </span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {ward.Occupants?.length || 0} / {ward.capacity} o'rin
                  </div>
                  <div className={`text-xs font-medium ${ward.Occupants?.length >= ward.capacity ? 'text-destructive' : 'text-success'}`}>
                    {ward.Occupants?.length >= ward.capacity ? 'To\'liq' : 'Bo\'sh'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {new Intl.NumberFormat('uz-UZ').format(ward.price_per_day)} so'm/kun
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ward Occupants View Modal */}
      {viewingWard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewingWard(null)}></div>
          <div className="relative bg-card rounded-xl border border-border p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{viewingWard.name} - Bemorlar ro'yxati</h2>
              <button onClick={() => setViewingWard(null)} className="p-1 hover:bg-accent rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Bemor</th>
                    <th className="px-4 py-3">Keltirildi</th>
                    <th className="px-4 py-3">Kun</th>
                    <th className="px-4 py-3">Hamshira</th>
                    <th className="px-4 py-3">Shifokor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {viewingWard.Occupants?.map(occ => (
                    <tr key={occ.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        {occ.Patient?.ism}<br />
                        <span className="text-xs text-muted-foreground font-normal">{occ.Patient?.telefon}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(occ.admissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {Math.ceil(Math.abs(new Date() - new Date(occ.admissionDate)) / (1000 * 60 * 60 * 24))} kun
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {occ.Nurse?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {occ.shifokor?.name || '-'}
                      </td>
                    </tr>
                  ))}
                  {(!viewingWard.Occupants || viewingWard.Occupants.length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-muted-foreground">
                        Bu palatada hozirda bemorlar yo'q
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)}></div>
          <div className="relative bg-card rounded-xl border border-border p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-xl font-semibold text-foreground mb-6">
              {editingWard ? 'Palatani tahrirlash' : 'Yangi palata'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border flex items-center justify-center group cursor-pointer">
                  {formData.image ? (
                    <img
                      src={getImageUrl(formData.image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Rasm yuklash</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-border">
                      <ImageIcon className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Palata raqami</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                  placeholder="Masalan: 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Filial</label>
                <select
                  value={formData.filialId}
                  onChange={(e) => setFormData(prev => ({ ...prev, filialId: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">Filialni tanlang</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Turi</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Lux">Lux</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Sig'imi</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Narxi (kuniga)</label>
                <input
                  type="number"
                  value={formData.price_per_day}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_per_day: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {editingWard ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
