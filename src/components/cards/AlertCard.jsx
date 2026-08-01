import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

function AlertCard({ type = 'info', title, message, time }) {
  const config = {
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  };

  const { icon: Icon, color, bg } = config[type];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${bg}`}>
      <Icon className={`w-5 h-5 ${color} mt-0.5`} />
      <div className="flex-1">
        <p className={`font-medium ${color}`}>{title}</p>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
        {time && <p className="text-xs text-muted-foreground mt-2">{time}</p>}
      </div>
    </div>
  );
}

export default AlertCard;
