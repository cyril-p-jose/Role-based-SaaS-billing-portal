import { Link } from "react-router-dom";
import {
  Zap,
  Shield,
  BarChart3,
  CreditCard,
  Users,
  ArrowRight,
  Check,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const features = [
  { icon: CreditCard, title: "Smart Billing", desc: "Stripe-powered subscriptions and invoicing" },
  { icon: Shield, title: "Role-Based Access", desc: "Admin, billing manager, and customer roles" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Revenue insights and plan distribution" },
  { icon: Users, title: "Team Management", desc: "Invite members and manage permissions" },
];

const plans = [
  { name: "Starter", price: 29, features: ["5 team members", "Basic analytics", "Email support"] },
  { name: "Professional", price: 79, popular: true, features: ["25 team members", "Advanced analytics", "Priority support", "API access"] },
  { name: "Enterprise", price: 199, features: ["Unlimited members", "SSO", "24/7 support", "Dedicated manager"] },
];

export default function Landing() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">BillFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-500/10 dark:text-brand-300">
            <Zap className="h-4 w-4" /> Now with Stripe integration
          </div>
          <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-7xl">
            Billing that feels
            <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent"> effortless</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            The modern SaaS billing portal for teams who want clarity, control, and beautiful dashboards.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Start free trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-base">
              View demo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-100/50 py-20 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold">Simple, transparent pricing</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card relative ${plan.popular ? "ring-2 ring-brand-500" : ""}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-slate-500">/mo</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-brand-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`mt-8 block w-full text-center ${plan.popular ? "btn-primary" : "btn-secondary"}`}>
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
        <p className="text-center text-sm text-slate-500">© 2026 BillFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
