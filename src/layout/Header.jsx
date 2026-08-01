import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, User, ChevronDown } from 'lucide-react';

function Header() {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
              <button className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Profil
              </button>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
