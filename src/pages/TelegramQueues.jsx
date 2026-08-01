import { useState, useEffect } from 'react';
import { Check, X, Clock, Phone, Calendar, User, Building2, Stethoscope, MessageCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import SearchInput from '../components/filters/SearchInput.jsx';
import api from '../api';

function TelegramQueues() {
  const [queues, setQueues] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      const data = await api.get('/admin/appointment');
      setQueues(data.filter(q => q.source === 'telegram') || []);
    } catch (error) {
      toast.error('Navbatlarni yuklashda xatolik');
    }
  };

  const filteredQueues = (queues || []).filter(queue => {
    const patientName = (queue.Patient?.ism || '').toLowerCase();
    const phone = (queue.Patient?.telefon || '');
    const matchesSearch = patientName.includes(search.toLowerCase()) || phone.includes(search);
    const matchesStatus = statusFilter === 'all' || queue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'waiting': return { label: 'Kutilmoqda', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' };
      case 'confirmed': return { label: 'Tasdiqlangan', color: 'bg-blue-500/10 text-blue-600 border-blue-200' };
      case 'completed': return { label: 'Bajarildi', color: 'bg-green-500/10 text-green-600 border-green-200' };
      case 'cancelled': return { label: 'Bekor qilindi', color: 'bg-red-500/10 text-red-600 border-red-200' };
      default: return { label: status, color: 'bg-gray-100 text-gray-600 border-gray-200' };
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/appointment/${id}`, { status: newStatus });
      toast.success(`Navbat holati o'zgartirildi: ${newStatus}`);
      fetchQueues();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const pendingCount = queues.filter(q => q.status === 'waiting').length;
  const confirmedCount = queues.filter(q => q.status === 'confirmed').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bot Navbatlar</h1>
          <p className="text-muted-foreground mt-1">Telegram bot orqali kelib tushgan arizalar</p>
        </div>

        <div className="flex gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-muted-foreground">Kutilmoqda / Tasdiqlangan</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-700 text-sm font-bold">{pendingCount}</span>
              <span className="text-muted-foreground">/</span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 text-sm font-bold">{confirmedCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Bemor ismi yoki telefon raqami..."
            className="h-12 text-base"
          />
        </div>

        <div className="flex bg-muted/50 p-1 rounded-xl">
          {['all', 'waiting', 'confirmed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
            >
              {status === 'all' ? 'Barchasi' : getStatusConfig(status).label}
            </button>
          ))}
        </div>
      </div>

      {filteredQueues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border text-center">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Navbatlar topilmadi</h3>
          <p className="text-muted-foreground max-w-sm mt-1">
            {search || statusFilter !== 'all'
              ? "Qidiruv shartlariga mos keladigan navbatlar mavjud emas."
              : "Hozircha telegram bot orqali hech qanday navbat olinmagan."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredQueues.map((queue) => {
            const statusStyle = getStatusConfig(queue.status);
            return (
              <div key={queue.id} className="group bg-card hover:bg-accent/5 rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {queue.Patient?.ism?.[0] || <User className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground line-clamp-1" title={queue.Patient?.ism}>{queue.Patient?.ism || 'Noma\'lum'}</h4>
                        <a href={`tel:${queue.Patient?.telefon}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-0.5">
                          <Phone className="w-3.5 h-3.5" />
                          {queue.Patient?.telefon}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{queue.sana}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span className="font-medium text-foreground">{queue.vaqt}</span>
                    </div>

                    <div className="space-y-1.5 px-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4 text-primary/60" />
                        <span className="truncate">{queue.Branch?.name || 'Filial tanlanmagan'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Stethoscope className="w-4 h-4 text-primary/60" />
                        <span className="truncate">{queue.doctor?.name || 'Shifokor tanlanmagan'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold text-center uppercase tracking-wider ${statusStyle.color}`}>
                    {statusStyle.label}
                  </div>

                  {queue.status === 'waiting' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateStatus(queue.id, 'confirmed')}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-medium text-sm"
                      >
                        <Check className="w-4 h-4" /> Tasdiqlash
                      </button>
                      <button
                        onClick={() => updateStatus(queue.id, 'cancelled')}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors font-medium text-sm"
                      >
                        <X className="w-4 h-4" /> Bekor
                      </button>
                    </div>
                  )}

                  {queue.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(queue.id, 'completed')}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors font-medium text-sm"
                    >
                      <Check className="w-4 h-4" /> Qabul Bajarildi
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TelegramQueues;
