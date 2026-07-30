import { useEffect } from "react";
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
  ClipboardList,
  AlertTriangle,
  Landmark,
  CheckSquare,
  Package,
  Calculator,
  Zap,
  Building2,
  ShieldCheck,
  Database,
  Activity,
  Webhook,
  Upload,
  CreditCard,
  Lock,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Target,
  Briefcase,
  X,
} from "lucide-react";
import { useRules } from "@/contexts/RuleContext";
import { getMenuItemsForRole } from "@/lib/data/roles";
import { useSidebarState } from "./SidebarState";

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
  { icon: ClipboardList, label: "Audit", path: "/audit" },
  { icon: AlertTriangle, label: "Risk", path: "/risk" },
  { icon: Landmark, label: "Grants", path: "/grants" },
  { icon: CheckSquare, label: "Approvals", path: "/approvals" },
  { icon: Package, label: "Assets", path: "/assets" },
  { icon: Calculator, label: "Budget", path: "/budget" },
  { icon: Zap, label: "Automation", path: "/automation" },
  { icon: Building2, label: "Gov Filing", path: "/government-filing" },
  { icon: ShieldCheck, label: "Data Gov", path: "/data-governance" },
  { icon: FileBarChart, label: "Reports", path: "/reports" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Database, label: "Backups", path: "/backups" },
  { icon: Activity, label: "Health", path: "/system-health" },
  { icon: Webhook, label: "API & Webhooks", path: "/api-webhooks" },
  { icon: Upload, label: "Bulk Import", path: "/bulk-import" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: Lock, label: "Security", path: "/security" },
  { icon: BarChart3, label: "Analytics", path: "/usage-analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
  // Intelligence modules
  { icon: TrendingUp, label: "Financial Intel", path: "/financial-intelligence" },
  { icon: ShieldAlert, label: "Fraud Detection", path: "/fraud-detection" },
  { icon: Target, label: "Impact", path: "/impact-measurement" },
  { icon: Briefcase, label: "Board View", path: "/board-dashboard" },
  { icon: Building2, label: "CSR Reports", path: "/csr-reporting" },
];

export const Sidebar = () => {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebarState();
  const location = useLocation();
  const { currentRole, location: ngoLocation } = useRules();

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("ngo_location_config");
    localStorage.removeItem("ngo_current_role");
    window.location.href = "/login";
  };

  const allowedPaths = getMenuItemsForRole(currentRole);
  const CurrencyIcon = getCurrencyIcon(ngoLocation.country?.currency.code);

  const menuItems = allMenuItems.filter(item => allowedPaths.includes(item.path));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-dvh bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        aria-label="Main navigation"
      >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-coral flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div className={`overflow-hidden ${collapsed ? "lg:hidden" : ""}`}>
            <h1 className="font-bold text-lg text-foreground">NGO Manager</h1>
            <p className="text-xs text-muted-foreground">
              {ngoLocation.country?.countryName || 'Global Edition'}
            </p>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto lg:hidden text-muted-foreground hover:text-foreground min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
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
                  aria-current={isActive ? "page" : undefined}
                >
                  {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                  <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-destructive hover:text-destructive/80 hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapsed}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary border border-border items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
      </aside>
    </>
  );
};
