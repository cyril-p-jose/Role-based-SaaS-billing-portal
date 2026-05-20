import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Users,
  BarChart3,
  Zap,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "billing_manager", "customer"] },
  { to: "/billing", icon: CreditCard, label: "Billing", roles: ["admin", "billing_manager", "customer"] },
  { to: "/invoices", icon: FileText, label: "Invoices", roles: ["admin", "billing_manager", "customer"] },
  { to: "/team", icon: Users, label: "Team", roles: ["admin", "billing_manager"] },
  { to: "/admin", icon: BarChart3, label: "Admin Analytics", roles: ["admin"] },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout, canManageTeam } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const filteredNav = navItems.filter((item) => {
    if (item.to === "/team" && !canManageTeam) return false;
    return item.roles.includes(user?.role);
  });

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900/80 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200/80 px-6 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">BillFlow</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {filteredNav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200/80 p-4 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.full_name}</p>
              <p className="truncate text-xs text-slate-500 capitalize dark:text-slate-400">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="sidebar-link w-full"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
          <button onClick={logout} className="sidebar-link w-full text-rose-600 dark:text-rose-400">
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
