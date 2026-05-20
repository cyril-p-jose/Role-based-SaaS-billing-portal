import { Menu, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header({ title, subtitle, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>
        <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 sm:flex dark:bg-slate-800">
          <span className="text-sm font-medium">{user?.organization_name || "Personal"}</span>
        </div>
      </div>
    </header>
  );
}
