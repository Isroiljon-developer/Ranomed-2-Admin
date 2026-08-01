import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  Stethoscope,
  Briefcase,
  Building,
  BedDouble,
  FileText,
  Bell,
  Settings,
  Bot,
  ListOrdered,
  BarChart3,
  Heart
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/branches', icon: Building2, label: 'Filiallar' },
  { path: '/doctors', icon: Stethoscope, label: 'Shifokorlar' },
  { path: '/services', icon: Briefcase, label: 'Xizmatlar' },
  { path: '/departments', icon: Building, label: "Bo'limlar" },
  { path: '/wards', icon: BedDouble, label: 'Palatalar' },
  { path: '/users', icon: Users, label: 'Foydalanuvchilar' },
  { path: '/roles', icon: Shield, label: 'Rollar' },

  { path: '/reports', icon: BarChart3, label: 'Hisobotlar' },
  { path: '/audit-logs', icon: FileText, label: 'Audit Logs' },
  { path: '/notifications', icon: Bell, label: 'Bildirishnomalar' },
  { path: '/profile', icon: Users, label: 'Profil' },
  { path: '/settings', icon: Settings, label: 'Sozlamalar' },
];

// Bot simulator link - external
const botSimulatorLink = { path: '/bot-simulator', icon: Bot, label: 'Bot Simulyator', external: true };

function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Ranomed - 2</h1>
            <p className="text-xs text-muted-foreground"></p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 rounded-lg bg-primary/10">
          <p className="text-xs text-muted-foreground">Versiya</p>
          <p className="text-sm font-semibold text-foreground">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
