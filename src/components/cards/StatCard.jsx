function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-500/10 text-green-500',
    warning: 'bg-yellow-500/10 text-yellow-500',
    danger: 'bg-destructive/10 text-destructive',
    info: 'bg-blue-500/10 text-blue-500',
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-500' : 'text-destructive'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
