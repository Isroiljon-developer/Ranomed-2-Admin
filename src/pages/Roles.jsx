import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Shield, Check } from 'lucide-react';
import { toast } from 'sonner';
import SearchInput from '../components/filters/SearchInput.jsx';
import ConfirmModal from '../components/modals/ConfirmModal.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { initialRoles } from '../data/initialData.js';

const allPermissions = [
  { key: 'all', label: 'Barcha ruxsatlar', description: 'Tizimga to\'liq kirish' },
  { key: 'view_reports', label: 'Hisobotlarni ko\'rish', description: 'Statistika va hisobotlarni ko\'rish' },
  { key: 'view_stats', label: 'Statistikani ko\'rish', description: 'Dashboard statistikasini ko\'rish' },
  { key: 'manage_branches', label: 'Filiallarni boshqarish', description: 'Filiallarni qo\'shish va tahrirlash' },
  { key: 'manage_queue', label: 'Navbatni boshqarish', description: 'Navbat tizimini boshqarish' },
  { key: 'view_patients', label: 'Bemorlarni ko\'rish', description: 'Bemorlar ro\'yxatini ko\'rish' },
  { key: 'create_patients', label: 'Bemorlarni qo\'shish', description: 'Yangi bemor qo\'shish' },
  { key: 'manage_payments', label: 'To\'lovlarni boshqarish', description: 'To\'lov qabul qilish' },
  { key: 'view_payments', label: 'To\'lovlarni ko\'rish', description: 'To\'lovlar tarixini ko\'rish' },
  { key: 'manage_appointments', label: 'Qabullarni boshqarish', description: 'Shifokor qabullarini boshqarish' },
  { key: 'create_records', label: 'Yozuvlar yaratish', description: 'Tibbiy yozuvlar yaratish' },
  { key: 'update_vitals', label: 'Ko\'rsatkichlarni yangilash', description: 'Bemor ko\'rsatkichlarini yangilash' },
  { key: 'manage_tests', label: 'Tahlillarni boshqarish', description: 'Laboratoriya tahlillarini boshqarish' },
  { key: 'view_tests', label: 'Tahlillarni ko\'rish', description: 'Tahlil natijalarini ko\'rish' },
];

const baseRoles = [
  { name: 'admin', label: 'Admin' },
  { name: 'director', label: 'Direktor' },
  { name: 'doctor', label: 'Shifokor' },
  { name: 'reception', label: 'Retseptsiya' },
  { name: 'cashier', label: 'Kassir' },
  { name: 'nurse', label: 'Hamshira' },
  { name: 'lab', label: 'Laborant' },
  { name: 'warehouse', label: 'Omborchi' },
];

function Roles() {
  const [roles, setRoles] = useLocalStorage('roles', initialRoles);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const [formData, setFormData] = useState({
    name: '',
    label: '',
    baseRole: '',
    permissions: [],
  });

  const filteredRoles = roles.filter(role =>
    role.label.toLowerCase().includes(search.toLowerCase()) ||
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateForm = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      label: '',
      baseRole: '',
      permissions: [],
    });
    setShowForm(true);
  };

  const openEditForm = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      label: role.label,
      baseRole: role.baseRole || '',
      permissions: role.permissions,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingRole) {
      setRoles(roles.map(r =>
        r.id === editingRole.id ? { ...r, ...formData } : r
      ));
      toast.success('Rol yangilandi');
    } else {
      const newRole = {
        id: Date.now(),
        ...formData,
      };
      setRoles([...roles, newRole]);
      toast.success('Yangi rol qo\'shildi');
    }

    setShowForm(false);
  };

  const handleDelete = () => {
    setRoles(roles.filter(r => r.id !== deleteModal.id));
    setDeleteModal({ open: false, id: null });
    toast.success('Rol o\'chirildi');
  };

  const togglePermission = (key) => {
    if (formData.permissions.includes(key)) {
      setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== key) });
    } else {
      setFormData({ ...formData, permissions: [...formData.permissions, key] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rollar</h1>
          <p className="text-muted-foreground">Foydalanuvchi rollarini boshqarish</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yangi rol
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Rol qidirish..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{role.label}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{role.name}</p>
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground uppercase font-bold">
                      {baseRoles.find(br => br.name === role.baseRole)?.label || 'Belgilanmagan'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditForm(role)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, id: role.id })}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Ruxsatlar:</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.includes('all') ? (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500">
                    Barcha ruxsatlar
                  </span>
                ) : (
                  role.permissions.slice(0, 3).map(perm => (
                    <span key={perm} className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                      {allPermissions.find(p => p.key === perm)?.label || perm}
                    </span>
                  ))
                )}
                {role.permissions.length > 3 && !role.permissions.includes('all') && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                    +{role.permissions.length - 3} ta
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)}></div>
          <div className="relative bg-card rounded-xl border border-border p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="text-xl font-semibold text-foreground mb-6">
              {editingRole ? 'Rolni tahrirlash' : 'Yangi rol'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Rol nomi (ID)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="admin, reception, doctor..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Ko'rsatiladigan nomi</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Administrator, Qabulxona..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Kimligini belgilash (Tizimdagi o'rni)</label>
                  <select
                    value={formData.baseRole}
                    onChange={(e) => setFormData({ ...formData, baseRole: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="">Tanlang...</option>
                    {baseRoles.map(r => <option key={r.name} value={r.name}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ruxsatlar</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-border rounded-lg p-3">
                  {allPermissions.map(perm => (
                    <div
                      key={perm.key}
                      onClick={() => togglePermission(perm.key)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${formData.permissions.includes(perm.key)
                          ? 'bg-primary/10'
                          : 'hover:bg-accent'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.permissions.includes(perm.key)
                          ? 'bg-primary border-primary'
                          : 'border-border'
                        }`}>
                        {formData.permissions.includes(perm.key) && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                  {editingRole ? 'Saqlash' : 'Qo\'shish'}
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
        title="Rolni o'chirish"
        message="Haqiqatan ham bu rolni o'chirmoqchimisiz?"
      />
    </div>
  );
}

export default Roles;
