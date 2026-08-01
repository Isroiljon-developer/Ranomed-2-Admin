import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import api from '../api';
import { toast } from 'sonner';

const TelegramAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch all appointments for admin (no branch filter initially)
            const res = await api.get(`/admin/appointment`);
            // Filter for telegram source
            const telegramApps = (res.data || res || []).filter(a => a.source === 'telegram');
            setAppointments(telegramApps);
        } catch (err) {
            console.error(err);
            toast.error("Ma'lumotlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const total = appointments.length;
    const waiting = appointments.filter(a => a.status === 'waiting').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const completed = appointments.filter(a => a.status === 'completed').length;

    const holatData = [
        { nom: 'Kutilmoqda', qiymat: waiting, color: '#f57c00' },
        { nom: 'Tasdiqlangan', qiymat: confirmed, color: '#43a047' },
        { nom: 'Bajarilgan', qiymat: completed, color: '#1e88e5' },
    ];

    const getHolatBadge = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'waiting': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Telegram Bot Tahlili</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border">
                    <div className="text-sm text-muted-foreground uppercase font-bold">Jami Arizalar</div>
                    <div className="text-3xl font-bold mt-2">{total}</div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                    <div className="text-sm text-muted-foreground uppercase font-bold">Kutilmoqda</div>
                    <div className="text-3xl font-bold mt-2 text-yellow-600">{waiting}</div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border">
                    <div className="text-sm text-muted-foreground uppercase font-bold">Tasdiqlangan</div>
                    <div className="text-3xl font-bold mt-2 text-green-600">{confirmed}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border h-[400px]">
                    <h3 className="font-semibold mb-6">Buyurtmalar Holati</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={holatData}
                                cx="50%" cy="50%"
                                innerRadius={60} outerRadius={100}
                                paddingAngle={2}
                                dataKey="qiymat"
                                label={({ nom, percent }) => `${nom} ${(percent * 100).toFixed(0)}%`}
                            >
                                {holatData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} ta`, '']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border overflow-hidden">
                    <h3 className="font-semibold mb-4">So'nggi 10 ta ariza</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-border">
                                    <th className="pb-3 text-sm font-medium text-muted-foreground">Bemor</th>
                                    <th className="pb-3 text-sm font-medium text-muted-foreground">Sana</th>
                                    <th className="pb-3 text-sm font-medium text-muted-foreground">Holat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {appointments.slice(0, 10).map((app) => (
                                    <tr key={app.id}>
                                        <td className="py-3 text-sm font-medium">{app.Patient?.ism}</td>
                                        <td className="py-3 text-sm text-muted-foreground">{app.sana} {app.vaqt}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHolatBadge(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {appointments.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="py-4 text-center text-sm text-muted-foreground">Malumot yo'q</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelegramAnalysis;
