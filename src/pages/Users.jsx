import api from '../api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, X, User, Shield, Building2,
  Image as ImageIcon, DollarSign, Briefcase
} from 'lucide-react';

function Users() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const defaultRoles = [
    { name: 'admin', label: 'Admin' },
    { name: 'director', label: 'Direktor' },
    { name: 'doctor', label: 'Shifokor' },
    { name: 'reception', label: 'Retseptsiya' },
    { name: 'cashier', label: 'Kassir' },
    { name: 'hamshira', label: 'Hamshira' },
    { name: 'lab', label: 'Laborant' },
  ];

  const allRoles = defaultRoles;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, branchesRes, departmentsRes] = await Promise.all([
        api.get('/admin/user'),
        api.get('/admin/branch'),
        api.get('/admin/department')
      ]);
      setUsers(usersRes || []);
      setBranches(branchesRes || []);
      setDepartments(departmentsRes || []);
    } catch (error) {
      console.error(error);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: '',
    filialId: '',
    departmentId: '',
    salary: '',
    is_active: true,
    password: '',
    photo: '',
    specialization: '',
    phone: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      role: '',
      filialId: '',
      departmentId: '',
      salary: '',
      is_active: true,
      password: '',
      photo: '',
      specialization: '',
      phone: ''
    });
    setEditingUser(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (user, e) => {
    e.stopPropagation();
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      filialId: user.filialId || '',
      departmentId: user.departmentId || '',
      salary: user.salary || '',
      is_active: user.is_active,
      password: '',
      photo: user.photo || '',
      specialization: user.specialization || '',
      phone: user.phone || ''
    });
    setShowForm(true);
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
      console.error('Upload error:', err);
      toast.error("Rasm yuklashda xatolik: " + (err.message || "Server xatosi"));
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const rootUrl = 'http://localhost:9000';
    const cleanPath = path.replace(/\\/g, '/');
    return `${rootUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (editingUser) {
        if (!dataToSend.password) delete dataToSend.password;
        await api.put(`/admin/user/${editingUser.id}`, dataToSend);
        toast.success('Foydalanuvchi yangilandi');
      } else {
        await api.post('/admin/user', dataToSend);
        toast.success('Yangi foydalanuvchi qo\'shildi');
      }
      fetchData();
      setShowForm(false);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/admin/user/${id}`);
      fetchData();
      toast.success('Foydalanuvchi o\'chirildi');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getRoleLabel = (roleName) => allRoles.find(r => r.name === roleName)?.label || roleName;
  const getBranchName = (id) => branches.find(b => b.id === Number(id))?.name || 'Markaziy';

  const filteredUsers = (users || []).filter(user => {
    const matchesRole = !roleFilter || user.role === roleFilter;
    const nameStr = (user.name || '').toLowerCase();
    const usernameStr = (user.username || '').toLowerCase();
    const searchStr = (search || '').toLowerCase();
    const matchesSearch = nameStr.includes(searchStr) || usernameStr.includes(searchStr);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Xodimlar</h1>
          <p className="text-muted-foreground">Tizim foydalanuvchilarini boshqarish</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi xodim
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <input
            type='text'
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Xodim qidirish..."
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-background border border-border text-foreground"
        >
          <option value="">Barcha rollar</option>
          {allRoles.map(r => <option key={r.name} value={r.name}>{r.label}</option>)}
        </select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Xodim</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Bo'lim</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Rol</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Oylik</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden group relative">
                        {user.photo && user.photo !== 'default_avatar.png' ? (
                          <img src={getImageUrl(user.photo)} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.Branch?.name || getBranchName(user.filialId)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{user.Department?.name || 'Belgilanmagan'}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {user.salary ? Number(user.salary).toLocaleString() + ' so\'m' : '-'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {user.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <button onClick={(e) => openEditForm(user, e)} className="p-2 hover:bg-accent rounded text-foreground"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }} className="p-2 hover:bg-destructive/10 rounded text-destructive"><Trash2 className="w-4 h-4" /></button>
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
          <div className="relative bg-card rounded-xl border border-border p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1 hover:bg-accent rounded text-muted-foreground"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-semibold mb-6 text-foreground">{editingUser ? 'Tahrirlash' : 'Yangi xodim'}</h2>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Ism familiya</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Username</label>
                  <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Parol</label>
                  <input type="password" placeholder={editingUser ? "O'zgartirish uchun kiriting" : "Parol"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required={!editingUser} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Rol</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required>
                    <option value="">Rol tanlang</option>
                    {allRoles.map(r => <option key={r.name} value={r.name}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Filial</label>
                  <select value={formData.filialId} onChange={e => setFormData({ ...formData, filialId: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" required>
                    <option value="">Filial tanlang</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Bo'lim</label>
                  <select value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Bo'lim tanlang (ixtiyoriy)</option>
                    {departments.filter(d => !formData.filialId || d.branchId === Number(formData.filialId)).map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Oylik (so'm)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Telefon</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="+998" />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Mutaxassislik (ixtiyoriy)</label>
                <input type="text" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="w-full px-4 py-2 bg-background border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Masalan: Nevropatolog" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg text-foreground hover:bg-accent transition-colors">Bekor qilish</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">{editingUser ? 'Saqlash' : 'Qo\'shish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
