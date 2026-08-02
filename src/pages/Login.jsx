import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope, Lock, User } from 'lucide-react';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);

      if (!response || !response.token || !response.user) {
        setError("Server javobida xatolik");
        setLoading(false);
        return;
      }

      // Bu panel FAQAT admin uchun
      if (response.user.role !== 'admin') {
        setError("Bu panel faqat Admin uchun! Siz " + response.user.role + " rolidagilar uchun boshqa panelga kirishingiz kerak.");
        setLoading(false);
        return;
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login yoki parol noto\'g\'ri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-4">
            <Stethoscope className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white">Ranomed -2 </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Xush kelibsiz!</h2>
            <p className="text-muted-foreground mt-1">Tizimga kirish uchun ma'lumotlarni kiriting</p>
          </div>

          {redirecting && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm text-center animate-pulse">
              ✅ {redirecting.includes('5174') ? 'Direktor' : redirecting.includes('5175') ? 'Doktor' : redirecting.includes('5176') ? 'Kassir' : redirecting.includes('5177') ? 'Qabulxona' : redirecting.includes('5178') ? 'Hamshira' : redirecting.includes('5179') ? 'Laborant' : 'Boshqa'} paneliga yo'naltirilmoqda...
            </div>
          )}
          {error && !redirecting && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Login</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
                  placeholder="Loginni kiriting"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
                  placeholder="Parolni kiriting"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity" disabled={loading}>
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </form>

          {/* Test Login Ma'lumotlari */}
          <div className="mt-6 pt-5 border-t border-gray-150">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
              🔑 Sinov uchun login va parol:
            </p>
            <div 
              onClick={() => setFormData({ username: 'admin', password: 'admin123' })}
              className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 cursor-pointer transition-all"
            >
              <div>
                <p className="text-xs text-gray-500 font-medium">Admin panel uchun:</p>
                <p className="text-sm font-semibold text-blue-900">Login: <span className="font-mono text-blue-700">admin</span></p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Parol:</span>
                <span className="text-xs font-mono font-bold bg-blue-600 text-white px-2 py-1 rounded">admin123</span>
              </div>
            </div>
            <p className="text-[11px] text-center text-gray-400 mt-2">
              💡 (Ustiga bossangiz, avtomatik to'ldiriladi)
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

