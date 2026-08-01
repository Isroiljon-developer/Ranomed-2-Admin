import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Bot, X, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import SearchInput from '../components/filters/SearchInput.jsx';
import ConfirmModal from '../components/modals/ConfirmModal.jsx';
import api from '../api';

function Services() {
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    filialId: '', // Model changed to single filialId for simplicity in backend or handle array
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [srvRes, branchRes] = await Promise.all([
        api.get('/admin/service'), // Need to implement this in admin.controller
        api.get('/admin/branch')
      ]);
      setServices(srvRes || []);
      setBranches(branchRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    (service.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (service.category?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Barcha filiallar';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const openCreateForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      filialId: '',
    });
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price,
      category: service.category,
      filialId: service.filialId || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/admin/service/${editingService.id}`, formData);
        toast.success('Xizmat yangilandi');
      } else {
        await api.post('/admin/service', formData);
        toast.success('Yangi xizmat qo\'shildi');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/service/${deleteModal.id}`);
      toast.success('Xizmat o\'chirildi');
      setDeleteModal({ open: false, id: null });
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Xizmatlar</h1>
          <p className="text-muted-foreground">Klinik xizmatlarni boshqarish</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi xizmat
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Xizmat qidirish..."
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Xizmat nomi</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Kategoriya</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Narxi</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Filial</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{service.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                      {service.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-foreground">{formatPrice(service.price)}</td>
                  <td className="py-4 px-6 text-muted-foreground text-sm">{getBranchName(service.filialId)}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(service)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, id: service.id })}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)}></div>
          <div className="relative bg-card rounded-xl border border-border p-6 w-full max-w-lg shadow-xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-xl font-semibold text-foreground mb-6">
              {editingService ? 'Xizmatni tahrirlash' : 'Yangi xizmat'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Xizmat nomi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Kategoriya</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Diagnostika, Laboratoriya..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Narxi (so'm)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Filial</label>
                <select
                  value={formData.filialId}
                  onChange={(e) => setFormData({ ...formData, filialId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Filialni tanlang (bo'sh bo'lsa barcha filial)</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
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
                  {editingService ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Xizmatni o'chirish"
        message="Haqiqatan ham bu xizmatni o'chirmoqchimisiz?"
      />
    </div>
  );
}

export default Services;
