import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, BedDouble, Building2, Bot, Stethoscope } from 'lucide-react';
import StatCard from '../components/cards/StatCard.jsx';
import api from '../api';

function Dashboard() {
  const [stats, setStats] = useState({
    bugungiTushum: 0,
    bugungiBemorlar: 0,
    bugungiNavbatlar: 0,
    bandPalatalar: 0,
    boshPalatalar: 0,
    telegramOrqali: 0
  });
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, branchesRes] = await Promise.all([
        api.get('/analytics/dashboard-stats'),
        api.get('/analytics/branch-stats')
      ]);
      setStats(statsRes || {});
      setBranches(branchesRes || []);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60';
    const baseUrl = 'http://localhost:9000';
    return `${baseUrl}${path}`;
  };

  return (
    <div className="space-y-6 text-foreground">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Umumiy statistika va ko'rsatkichlar</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Bugungi bemorlar"
          value={stats.bugungiBemorlar}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Bugungi navbatlar"
          value={stats.bugungiNavbatlar}
          icon={Calendar}
          color="info"
        />
        <StatCard
          title="Bugungi tushum"
          value={(stats.bugungiTushum / 1000).toFixed(0) + 'K'}
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Bot navbatlar"
          value={stats.telegramOrqali}
          icon={Bot}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Bo'sh palatalar"
          value={stats.boshPalatalar}
          icon={BedDouble}
          color="success"
        />
        <StatCard
          title="Band palatalar"
          value={stats.bandPalatalar}
          icon={BedDouble}
          color="danger"
        />
        <StatCard
          title="Faol filiallar"
          value={branches.length}
          icon={Building2}
          color="primary"
        />
        <StatCard
          title="Shifokorlar"
          value={branches.reduce((acc, b) => acc + (b.stats?.doctors || 0), 0)}
          icon={Stethoscope}
          color="info"
        />
      </div>

      {/* Branch Stats */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Filiallar bo'yicha statistika</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider">
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Filial</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Bemorlar</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Shifokorlar</th>
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">Palatalar (Band/Jami)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {branches.map((branch) => (
                <tr key={branch.id} className="hover:bg-accent/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                        <img src={getImageUrl(branch.image)} alt={branch.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-foreground">{branch.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground">{branch.stats?.patients || 0}</td>
                  <td className="py-4 px-4 text-foreground">{branch.stats?.doctors || 0}</td>
                  <td className="py-4 px-4 text-foreground">
                    {branch.stats?.bandPalata || 0} / {branch.stats?.jamiPalata || 0}
                  </td>
                </tr>
              ))}
              {branches.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-muted-foreground">Ma'lumotlar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hamshiralar Navbatchilik Hisoboti */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">📋 Hamshiralar Oylik Navbatchilik Hisoboti (Dejurantlar)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left py-3 px-4">Hamshira F.I.O</th>
                <th className="text-left py-3 px-4">Bo'lim</th>
                <th className="text-center py-3 px-4 text-blue-600">☀️ Kunduzgi</th>
                <th className="text-center py-3 px-4 text-amber-600">🌆 Kechki</th>
                <th className="text-center py-3 px-4 text-purple-600">🌙 Tungi</th>
                <th className="text-center py-3 px-4 text-emerald-600">🏖️ Dam olish</th>
                <th className="text-center py-3 px-4 text-foreground">Jami smenalar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {(() => {
                const today = new Date();
                const key = `schedule_${today.getFullYear()}_${today.getMonth()}`;
                let saved = {};
                try { saved = JSON.parse(localStorage.getItem(key) || '{}'); } catch(e){}
                const nurses = [
                  { id: 1, name: 'Malika Karimova', dept: 'Kardiologiya' },
                  { id: 2, name: 'Shahnoza Aliyeva', dept: 'Nevrologiya' },
                  { id: 3, name: 'Nargiza Umarova', dept: 'Pediatriya' },
                  { id: 4, name: 'Dilnoza Rahmatova', dept: 'Xirurgiya' }
                ];
                return nurses.map(n => {
                  const s = saved[n.id] || {};
                  let counts = { kunduzgi: 0, kechki: 0, tungi: 0, dam_olish: 0, total: 0 };
                  Object.values(s).forEach(val => {
                    if (counts[val] !== undefined) {
                      counts[val]++;
                      if (val !== 'dam_olish') counts.total++;
                    }
                  });
                  return (
                    <tr key={n.id} className="hover:bg-accent/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">{n.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{n.dept}</td>
                      <td className="py-3 px-4 text-center font-semibold text-blue-600">{counts.kunduzgi} kun</td>
                      <td className="py-3 px-4 text-center font-semibold text-amber-600">{counts.kechki} kun</td>
                      <td className="py-3 px-4 text-center font-semibold text-purple-600">{counts.tungi} kun</td>
                      <td className="py-3 px-4 text-center font-semibold text-emerald-600">{counts.dam_olish} kun</td>
                      <td className="py-3 px-4 text-center font-bold text-foreground">{counts.total} smena</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
