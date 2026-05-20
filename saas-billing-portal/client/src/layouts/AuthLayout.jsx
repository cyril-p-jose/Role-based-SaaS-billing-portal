import { Link } from "react-router-dom";
import { Zap, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function AuthLayout({ children, title, subtitle }) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="relative flex min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-violet-600/10 to-transparent dark:from-brand-900/30" />
      <div className="absolute right-4 top-4 z-10">
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200/50 bg-white/80 p-2 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-600 to-violet-700 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Zap className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">BillFlow</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Modern billing for modern teams
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Manage subscriptions, invoices, and teams in one beautiful dashboard.
          </p>
        </div>
        <p className="text-sm text-white/60">Trusted by 2,000+ SaaS companies</p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">BillFlow</span>
        </Link>
        <div className="w-full max-w-md animate-slide-up">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
