import { Search, User, ChevronDown, LogOut, Menu } from "lucide-react";
import { LocationBadge } from "./LocationBadge";
import { RoleSwitcher } from "./RoleSwitcher";
import { NotificationBell } from "./NotificationBell";
import { useRules } from "@/contexts/RuleContext";
import { getRoleLabel } from "@/lib/data/roles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarState } from "./SidebarState";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const { currentRole } = useRules();
  const { setMobileOpen } = useSidebarState();

  const handleLogout = () => {
    localStorage.removeItem('ngo_location_config');
    localStorage.removeItem('ngo_current_role');
    window.location.href = '/login';
  };

  return (
    <header className="min-h-20 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-30">
      {/* Left - Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden min-h-11 min-w-11 flex items-center justify-center rounded-lg bg-secondary text-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {/* Location Badge */}
        <div className="hidden md:block">
          <LocationBadge />
        </div>

        {/* Role Switcher (Demo) */}
        <div className="hidden sm:block">
          <RoleSwitcher />
        </div>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 pr-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-teal flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">Demo User</p>
                <p className="text-xs text-muted-foreground">{getRoleLabel(currentRole)}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="text-muted-foreground">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Demo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
