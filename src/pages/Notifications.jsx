import { useState } from 'react';
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import useLocalStorage from '../hooks/useLocalStorage.js';

function Notifications() {
  const [notifications, setNotifications] = useLocalStorage('notifications', []);

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      default: return Info;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'success': return 'text-green-500 bg-green-500/10';
      case 'error': return 'text-destructive bg-destructive/10';
      default: return 'text-blue-500 bg-blue-500/10';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('Barcha bildirishnomalar o\'qildi');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Bildirishnoma o\'chirildi');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Barcha bildirishnomalar tozalandi');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bildirishnomalar</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} ta o'qilmagan bildirishnoma` : 'Barcha bildirishnomalar o\'qilgan'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
          >
            <Check className="w-4 h-4" />
            Barchasini o'qish
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Tozalash
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">Bildirishnomalar yo'q</h3>
            <p className="text-muted-foreground">Yangi bildirishnomalar bu yerda ko'rinadi</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const Icon = getIcon(notif.type);
            const colorClass = getColor(notif.type);

            return (
              <div
                key={notif.id}
                className={`bg-card rounded-xl border p-4 transition-all ${notif.read ? 'border-border opacity-60' : 'border-primary/30 shadow-sm'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notif.time}</p>
                      </div>
                      <div className="flex gap-1">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 rounded-lg hover:bg-accent transition-colors"
                            title="O'qildi"
                          >
                            <Check className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Notifications;
