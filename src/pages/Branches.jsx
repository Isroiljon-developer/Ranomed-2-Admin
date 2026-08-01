import { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, X, Building2, Phone, Clock, MapPin, Image as ImageIcon } from 'lucide-react';

export default function Branches() {
    const [branches, setBranches] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        working_hours: '08:00 - 20:00',
        image: '',
        description: '',
        show_in_bot: true
    });

    useEffect(() => {
        fetchBranches();
    }, []);

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
            toast.error("Rasm yuklashda xatolik");
        }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const rootUrl = 'http://localhost:9000';
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${rootUrl}${cleanPath}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBranch) {
                await api.put(`/admin/branch/${editingBranch.id}`, formData);
                toast.success('Filial yangilandi');
            } else {
                await api.post('/admin/branch', formData);
                toast.success('Yangi filial qo\'shildi');
            }
            fetchBranches();
            setShowForm(false);
            resetForm();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Haqiqatan ham bu filialni o\'chirmoqchimisiz?')) return;
        try {
            await api.delete(`/admin/branch/${id}`);
            setBranches(branches.filter(b => b.id !== id));
            toast.success('Filial o\'chirildi');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            phone: '',
            working_hours: '08:00 - 20:00',
            image: '',
            description: '',
            show_in_bot: true
        });
        setEditingBranch(null);
    };

    const openEditForm = (branch) => {
        setEditingBranch(branch);
        setFormData({
            name: branch.name,
            address: branch.address,
            phone: branch.phone,
            working_hours: branch.working_hours,
            image: branch.image || '',
            description: branch.description || '',
            show_in_bot: branch.show_in_bot
        });
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Filiallar</h1>
                    <p className="text-muted-foreground">Klinika filiallarini boshqarish</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Yangi filial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(branch => (
                    <div key={branch.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-48 bg-muted relative">
                            {branch.image ? (
                                <img
                                    src={getImageUrl(branch.image)}
                                    alt={branch.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <Building2 className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => openEditForm(branch)}
                                    className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                                >
                                    <Edit2 className="w-4 h-4 text-foreground" />
                                </button>
                                <button
                                    onClick={() => handleDelete(branch.id)}
                                    className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-destructive/10 transition-colors group"
                                >
                                    <Trash2 className="w-4 h-4 text-destructive group-hover:text-destructive" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{branch.name}</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {branch.address}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {branch.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {branch.working_hours}
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
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-accent"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>

                        <h2 className="text-xl font-semibold text-foreground mb-6">
                            {editingBranch ? 'Filialni tahrirlash' : 'Yangi filial'}
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
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Nomi</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Manzil</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Telefon</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Ish vaqti</label>
                                    <input
                                        type="text"
                                        value={formData.working_hours}
                                        onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.show_in_bot}
                                        onChange={(e) => setFormData({ ...formData, show_in_bot: e.target.checked })}
                                        className="rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-foreground">Telegram botda ko'rsatish</span>
                                </label>
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
                                    {editingBranch ? 'Saqlash' : 'Qo\'shish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
