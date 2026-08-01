import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Building, User } from 'lucide-react';
import { toast } from 'sonner';
import SearchInput from '../components/filters/SearchInput.jsx';
import SelectFilter from '../components/filters/SelectFilter.jsx';
import api from '../api';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    branchId: '',
    head: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptRes, branchRes, userRes] = await Promise.all([
        api.get('/admin/department'),
        api.get('/admin/branch'),
        api.get('/admin/user')
      ]);
      setDepartments(deptRes || []);
      setBranches(branchRes || []);
      setUsers(userRes || []);
    } catch (error) {
      toast.error('Ma\'lumotlarni yuklashda xatolik');
    }
  };

  const filteredDepartments = (departments || []).filter(dept => {
    const matchesSearch = dept.name?.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = !branchFilter || dept.branchId === parseInt(branchFilter);
    return matchesSearch && matchesBranch;
  });

  const getBranchName = (dept) => {
    if (dept.Branch) return dept.Branch.name;
    const branch = branches.find(b => b.id === dept.branchId);
    return branch ? branch.name : 'Noma\'lum';
  };

  const openCreateForm = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      branchId: '',
      head: '',
    });
    setShowForm(true);
  };

  const openEditForm = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      branchId: dept.branchId,
      head: dept.head || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await api.put(`/admin/department/${editingDept.id}`, {
          ...formData,
          branchId: parseInt(formData.branchId)
        });
        toast.success('Bo\'lim yangilandi');
      } else {
        await api.post('/admin/department', {
          ...formData,
          branchId: parseInt(formData.branchId)
        });
        toast.success('Yangi bo\'lim qo\'shildi');
      }
      fetchData();
      setShowForm(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haqiqatan ham bu bo\'limni o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/admin/department/${id}`);
      fetchData();
      toast.success('Bo\'lim o\'chirildi');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getFilteredUsers = () => {
    if (!formData.branchId) return users;
    return users.filter(u => u.filialId === parseInt(formData.branchId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bo'limlar</h1>
          <p className="text-muted-foreground">Klinika bo'limlarini boshqarish</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi bo'lim
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Bo'lim qidirish..."
          />
        </div>
        <SelectFilter
          value={branchFilter}
          onChange={setBranchFilter}
          options={branches.map(b => ({ value: b.id.toString(), label: b.name }))}
          placeholder="Barcha filiallar"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDepartments.map((dept) => (
          <div key={dept.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground">{getBranchName(dept)}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditForm(dept)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Bo'lim boshlig'i</p>
                  <p className="font-medium text-sm text-foreground">{dept.head || 'Belgilanmagan'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-muted-foreground">Hodimlar:</span>
                <span className="font-semibold text-primary">{dept.Users?.length || 0} ta</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="relative bg-card rounded-xl border border-border p-6 w-full max-w-lg shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-xl font-semibold text-foreground mb-6">
              {editingDept ? 'Bo\'limni tahrirlash' : 'Yangi bo\'lim'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Bo'lim nomi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Filial</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value, head: '' })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="">Filial tanlang</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Bo'lim boshlig'i</label>
                <select
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Bo'lim boshlig'ini tanlang</option>
                  {getFilteredUsers().map(user => (
                    <option key={user.id} value={user.name}>{user.name} ({user.role === 'doctor' ? 'Shifokor' : user.role})</option>
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
                  {editingDept ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;
