import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, Building2, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';
import SelectFilter from '../components/filters/SelectFilter.jsx';
import api from '../api';

const ROOT_URL = 'http://localhost:9000';

function Reports() {
  const [branches, setBranches] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({
    bugungiTushum: 0,
    bugungiBemorlar: 0,
    bugungiNavbatlar: 0,
    bandPalatalar: 0,
    boshPalatalar: 0,
    telegramOrqali: 0,
    totalIncome: 0,
    totalPatients: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [branchFilter, setBranchFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchRes, docRes, statsRes, revenueRes] = await Promise.all([
        api.get('/analytics/branch-stats'),
        api.get('/admin/user?role=doctor'),
        api.get('/analytics/dashboard-stats'),
        api.get('/analytics/monthly-revenue')
      ]);
      setBranches(branchRes || []);
      setDoctors(docRes || []);
      setStats(statsRes || {});
      setRevenueData(revenueRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${ROOT_URL}${cleanPath}`;
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Hisobotlar</h1>
          <p className="text-muted-foreground mt-1 text-lg">Klinika faoliyati bo'yicha batafsil statistika</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="bg-card border border-border rounded-lg p-1 flex items-center shadow-sm">
            {['day', 'week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${period === p
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
              >
                {p === 'day' ? 'Bugun' : p === 'week' ? 'Hafta' : p === 'month' ? 'Oy' : 'Yil'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 font-medium">
              <Download className="w-5 h-5" />
              <span>Yuklab olish</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Jami Tushum"
          value={`${formatPrice(stats.bugungiTushum)} so'm`}
          subValue="Bugungi kun uchun"
          icon={Wallet}
          color="blue"
        />
        <StatsCard
          title="Jami Bemorlar"
          value={stats.bugungiBemorlar}
          subValue="Tashrif buyurganlar"
          icon={Users}
          color="indigo"
        />
        <StatsCard
          title="Qabullar"
          value={stats.bugungiNavbatlar}
          subValue="O'rtacha kunlik"
          icon={Activity}
          color="emerald"
        />
        <StatsCard
          title="Bot orqali"
          value={stats.telegramOrqali}
          subValue="Telegram arizalar"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart Area */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Moliyaviy Ko'rsatkichlar</h3>
                <p className="text-sm text-muted-foreground">Oxirgi 6 oy davomida tushumlar dinamikasi</p>
              </div>
            </div>
          </div>

          <div className="h-[300px] flex items-end justify-between gap-4 px-4 pt-8">
            {revenueData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <BarChart3 className="w-12 h-12 opacity-20" />
                <p>Ma'lumotlar mavjud emas</p>
              </div>
            ) : (
              revenueData.map((data, index) => {
                const maxVal = Math.max(...revenueData.map(d => parseFloat(d.tushum) || 0));
                const currentVal = parseFloat(data.tushum) || 0;
                const heightPercent = maxVal > 0 ? (currentVal / maxVal) * 100 : 0;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="relative w-full flex justify-center h-full items-end">
                      <div
                        className="w-full max-w-[60px] bg-gradient-to-t from-primary/60 to-primary rounded-t-lg transition-all duration-500 ease-out group-hover:from-primary/80 group-hover:to-primary group-hover:scale-y-105 origin-bottom relative"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-10">
                          {(currentVal / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {new Date(data.month).toLocaleDateString('uz-UZ', { month: 'short' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Branches List */}
        <div className="lg:col-span-1 bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Top Filiallar</h3>
              <p className="text-sm text-muted-foreground">Eng faol filiallar</p>
            </div>
          </div>

          <div className="space-y-4">
            {branches.slice(0, 5).map((branch, idx) => (
              <div key={branch.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors border border-transparent hover:border-border/50">
                <div className="font-bold text-2xl text-muted-foreground/30 w-6">0{idx + 1}</div>
                <div className="w-12 h-12 rounded-xl bg-muted shrink-0 overflow-hidden">
                  {branch.image ? (
                    <img src={getImageUrl(branch.image)} alt={branch.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <Building2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground truncate">{branch.name}</h4>
                  <p className="text-sm text-muted-foreground">{branch.stats?.patients || 0} bemor</p>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-primary">{formatPrice(branch.stats?.tushum || 0)}</span>
                </div>
              </div>
            ))}
            {branches.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Filiallar topilmadi</div>
            )}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-foreground">Shifokorlar Ish Unumdorligi</h3>
            <p className="text-sm text-muted-foreground">Shifokorlarning oylik yuklamasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => {
            const load = 0; // Load calculation can be implemented later with real data
            return (
              <div key={doctor.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-muted shrink-0 overflow-hidden border-2 border-background shadow-sm">
                  {doctor.photo ? (
                    <img src={getImageUrl(doctor.photo)} alt={doctor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500">
                      <Users className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground truncate">{doctor.name}</h4>
                  <p className="text-xs text-muted-foreground truncate mb-2">{doctor.staff?.specialization || 'Shifokor'}</p>

                  <div className="relative pt-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">Yuklama</span>
                      <span className="font-bold text-primary">{load}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${load}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatsCard({ title, value, subValue, icon: Icon, trend, trendUp, color }) {
  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600"
  };

  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${colorStyles[color]} transition-colors`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <p className="text-3xl font-bold text-foreground tracking-tight mb-1">{value}</p>
          <p className="text-xs text-muted-foreground">{subValue}</p>
        </div>
      </div>

      {/* Background Decor */}
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${colorStyles[color]} opacity-5 group-hover:scale-110 transition-transform duration-500`} />
    </div>
  );
}

export default Reports;
