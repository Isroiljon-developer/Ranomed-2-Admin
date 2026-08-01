import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Roles from './pages/Roles.jsx';
import Branches from './pages/Branches.jsx';
import Doctors from './pages/Doctors.jsx';
import Services from './pages/Services.jsx';
import Departments from './pages/Departments.jsx';
import Wards from './pages/Wards.jsx';
import AuditLogs from './pages/AuditLogs.jsx';
import Notifications from './pages/Notifications.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import TelegramBot from './pages/TelegramBot.jsx';
import TelegramQueues from './pages/TelegramQueues.jsx';
import Reports from './pages/Reports.jsx';
import Login from './pages/Login.jsx';
import TelegramBotSimulator from './pages/TelegramBotSimulator.jsx';
import TelegramAnalysis from './pages/TelegramAnalysis.jsx';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/bot-simulator" element={<TelegramBotSimulator />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="branches" element={<Branches />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="services" element={<Services />} />
          <Route path="departments" element={<Departments />} />
          <Route path="wards" element={<Wards />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="telegram-bot" element={<TelegramBot />} />
          <Route path="telegram-queues" element={<TelegramQueues />} />
          <Route path="telegram-analysis" element={<TelegramAnalysis />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
