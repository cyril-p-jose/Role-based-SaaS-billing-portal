import { useEffect, useState } from "react";
import { Building2, Users, CreditCard, FileText } from "lucide-react";
import { analyticsAPI } from "../services/api";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import PlanDistributionChart from "../components/PlanDistributionChart";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState({ revenue: [], plans: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [dashRes, adminRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getAdminOverview(),
      ]);
      setStats(dashRes.data.stats);
      setChartData({
        revenue: dashRes.data.revenueByMonth,
        plans: dashRes.data.planDistribution,
      });
      setOverview(adminRes.data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue)} icon={CreditCard} />
        <StatCard title="Organizations" value={stats?.organizations} icon={Building2} />
        <StatCard title="Active Users" value={stats?.activeUsers} icon={Users} />
        <StatCard title="Subscriptions" value={stats?.activeSubscriptions} icon={FileText} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={chartData.revenue} />
        <PlanDistributionChart data={chartData.plans} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card">
          <h3 className="mb-4 text-lg font-semibold">Recent Users</h3>
          <div className="space-y-3">
            {overview?.recentUsers?.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <div>
                  <p className="font-medium">{u.full_name}</p>
                  <p className="text-sm text-slate-500">{u.email}</p>
                </div>
                <span className="badge bg-brand-100 text-brand-700 capitalize dark:bg-brand-500/20 dark:text-brand-400">
                  {u.role?.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="mb-4 text-lg font-semibold">Recent Invoices</h3>
          <div className="space-y-3">
            {overview?.recentInvoices?.slice(0, 5).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <div>
                  <p className="font-medium">{inv.invoice_number}</p>
                  <p className="text-sm text-slate-500">{inv.organization_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(inv.amount)}</p>
                  <span className="text-xs capitalize text-slate-500">{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden p-0">
        <h3 className="border-b border-slate-200 px-6 py-4 font-semibold dark:border-slate-700">
          All Subscriptions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                <th className="px-6 py-3 font-semibold">Organization</th>
                <th className="px-6 py-3 font-semibold">Plan</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {overview?.subscriptions?.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-6 py-3">{sub.organization_name}</td>
                  <td className="px-6 py-3">{sub.plan_name || "—"}</td>
                  <td className="px-6 py-3 capitalize">{sub.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
