export default function StatCard({ title, value, change, icon: Icon, trend = "up", gradient }) {
  const trendColor = trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";

  return (
    <div className="glass-card group relative overflow-hidden">
      {gradient && (
        <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${gradient}`} />
      )}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={`mt-1 text-sm font-medium ${trendColor}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
