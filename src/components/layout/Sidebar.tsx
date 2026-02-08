import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Heart,
  IndianRupee,
  FolderKanban,
  Receipt,
  UserCheck,
  Shield,
  FileBarChart,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  PoundSterling,
  Coins,
} from "lucide-react";
import { useRules } from "@/contexts/RuleContext";
import { getMenuItemsForRole } from "@/lib/data/roles";

const getCurrencyIcon = (currencyCode?: string) => {
  switch (currencyCode) {
    case 'INR': return IndianRupee;
    case 'USD': return DollarSign;
    case 'GBP': return PoundSterling;
    default: return Coins;
  }
};

const allMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Donors", path: "/donors" },
  { icon: Heart, label: "Beneficiaries", path: "/beneficiaries" },
  { iconKey: "currency", label: "Donations", path: "/donations" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { icon: UserCheck, label: "Volunteers", path: "/volunteers" },
  { icon: Shield, label: "Compliance", path: "/compliance" },
  { icon: FileBarChart, label: "Reports", path: "/reports" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { currentRole, location: ngoLocation, permissions } = useRules();

  const allowedPaths = getMenuItemsForRole(currentRole);
  const CurrencyIcon = getCurrencyIcon(ngoLocation.country?.currency.code);

  const menuItems = allMenuItems.filter(item => allowedPaths.includes(item.path));

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-coral flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg text-foreground">NGO Manager</h1>
            <p className="text-xs text-muted-foreground">
              {ngoLocation.country?.countryName || 'Global Edition'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.iconKey === 'currency' ? CurrencyIcon : item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button className="sidebar-link w-full text-destructive hover:text-destructive/80 hover:bg-destructive/10">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};
