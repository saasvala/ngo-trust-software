import { Bell, AlertTriangle, FileText, CreditCard, Shield, Clock, CheckCircle } from "lucide-react";
import { useRules } from "@/contexts/RuleContext";
import { AppRole } from "@/lib/types/rules";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  level: "error" | "warning" | "info" | "success";
  roles: AppRole[];
}

const allNotifications: Notification[] = [
  {
    id: "1",
    icon: AlertTriangle,
    title: "80G Certificate Expiring",
    description: "Your 80G certificate expires in 45 days. Initiate renewal.",
    time: "2h ago",
    level: "error",
    roles: ["ngo_admin", "accountant", "auditor", "super_admin", "system_owner"],
  },
  {
    id: "2",
    icon: FileText,
    title: "Form 10BD Filing Due",
    description: "Q3 Form 10BD submission deadline is 15th Jan.",
    time: "5h ago",
    level: "warning",
    roles: ["auditor", "accountant", "ngo_admin", "super_admin"],
  },
  {
    id: "3",
    icon: CreditCard,
    title: "Missing PAN: 12 Donors",
    description: "12 donors with tax-eligible donations lack PAN details.",
    time: "1d ago",
    level: "warning",
    roles: ["auditor", "accountant", "operator", "ngo_admin"],
  },
  {
    id: "4",
    icon: Shield,
    title: "FCRA Filing Overdue",
    description: "Annual FCRA return for FY 2024-25 is past deadline.",
    time: "3d ago",
    level: "error",
    roles: ["ngo_admin", "auditor", "government_officer", "super_admin"],
  },
  {
    id: "5",
    icon: Clock,
    title: "Pending Expense Approvals",
    description: "7 expense vouchers awaiting your approval.",
    time: "4h ago",
    level: "info",
    roles: ["ngo_admin", "accountant", "project_manager", "state_admin", "country_admin"],
  },
  {
    id: "6",
    icon: CheckCircle,
    title: "12A Certificate Valid",
    description: "Your 12A registration is valid until March 2028.",
    time: "1w ago",
    level: "success",
    roles: ["ngo_admin", "auditor", "accountant"],
  },
  {
    id: "7",
    icon: AlertTriangle,
    title: "Cash Donation Limit Breach",
    description: "3 cash donations exceed ₹2,000 limit for 80G eligibility.",
    time: "6h ago",
    level: "error",
    roles: ["auditor", "accountant", "ngo_admin"],
  },
  {
    id: "8",
    icon: FileText,
    title: "New Task Assigned",
    description: "Field survey for Beneficiary Mapping assigned to you.",
    time: "30m ago",
    level: "info",
    roles: ["field_executor", "operator"],
  },
  {
    id: "9",
    icon: CreditCard,
    title: "Donation Received",
    description: "₹50,000 donation received from Rajesh Kumar.",
    time: "1h ago",
    level: "success",
    roles: ["donor", "ngo_admin", "accountant", "operator"],
  },
  {
    id: "10",
    icon: Shield,
    title: "NGO Compliance Alert",
    description: "3 NGOs in your jurisdiction have overdue filings.",
    time: "2d ago",
    level: "warning",
    roles: ["government_officer", "country_admin", "state_admin"],
  },
  {
    id: "11",
    icon: FileText,
    title: "Form 10BE Generation Ready",
    description: "Donor certificates for FY 2024-25 are ready for download.",
    time: "12h ago",
    level: "info",
    roles: ["auditor", "accountant", "ngo_admin"],
  },
  {
    id: "12",
    icon: Clock,
    title: "Project Milestone Due",
    description: "Clean Water Initiative Phase 2 milestone due in 5 days.",
    time: "1d ago",
    level: "warning",
    roles: ["project_manager", "ngo_admin", "field_executor"],
  },
];

const levelStyles: Record<string, string> = {
  error: "bg-destructive/15 text-destructive",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  info: "bg-primary/15 text-primary",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

const badgeVariant: Record<string, string> = {
  error: "bg-destructive text-destructive-foreground",
  warning: "bg-amber-500 text-white",
  info: "bg-primary text-primary-foreground",
  success: "bg-emerald-500 text-white",
};

export const NotificationBell = () => {
  const { currentRole } = useRules();

  const notifications = allNotifications.filter((n) =>
    n.roles.includes(currentRole)
  );

  const urgentCount = notifications.filter(
    (n) => n.level === "error" || n.level === "warning"
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {urgentCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
              {urgentCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
          <span>Notifications</span>
          <Badge variant="secondary" className="text-xs">
            {notifications.length}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="max-h-[360px]">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notifications
            </p>
          ) : (
            <div className="py-1">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <button
                    key={n.id}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left"
                  >
                    <div
                      className={`mt-0.5 p-1.5 rounded-md shrink-0 ${levelStyles[n.level]}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {n.title}
                        </p>
                        <span
                          className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badgeVariant[n.level]}`}
                        >
                          {n.level}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {n.time}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
