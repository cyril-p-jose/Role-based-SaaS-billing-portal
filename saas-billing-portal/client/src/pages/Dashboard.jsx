import { useEffect, useState } from "react";
import { DollarSign, Users, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { analyticsAPI, billingAPI } from "../services/api";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import PlanDistributionChart from "../components/PlanDistributionChart";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [chartData, setChartData] = useState({ revenue: [], plans: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, subRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          billingAPI.getSubscription(),
        ]);
        setStats(analyticsRes.data.stats);
        setChartData({
          revenue: analyticsRes.data.revenueByMonth,
          plans: analyticsRes.data.planDistribution,
        });
        setSubscription(subRes.data.subscription);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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
      <div>
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.full_name?.split(" ")[0]}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isAdmin ? "Platform overview" : "Here's your billing overview"}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue)}
          change="+12% from last month"
          icon={DollarSign}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions ?? 0}
          icon={TrendingUp}
          gradient="from-brand-500 to-violet-600"
        />
        <StatCard
          title="Paid Invoices"
          value={stats?.paidInvoices ?? 0}
          change={`${stats?.openInvoices ?? 0} open`}
          icon={FileText}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title={isAdmin ? "Organizations" : "Team Members"}
          value={isAdmin ? stats?.organizations : stats?.activeUsers}
          icon={Users}
          gradient="from-rose-500 to-pink-600"
        />
      </div>

      {subscription && (
        <div className="glass-card flex flex-wrap items-center justify-between gap-4 border-brand-500/20 bg-gradient-to-r from-brand-500/5 to-violet-500/5">
          <div>
            <p className="text-sm text-slate-500">Current plan</p>
            <p className="text-xl font-bold">{subscription.plan_name || "Active Plan"}</p>
            <p className="text-sm text-slate-500 capitalize">Status: {subscription.status}</p>
          </div>
          {subscription.current_period_end && (
            <p className="text-sm text-slate-500">
              Renews {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={chartData.revenue} />
        {(isAdmin || chartData.plans?.length > 0) && (
          <PlanDistributionChart data={chartData.plans} />
        )}
      </div>
    </div>
  );
}
