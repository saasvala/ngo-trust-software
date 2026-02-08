import { useRules } from "@/contexts/RuleContext";
import { ClipboardList, User, Clock, FileEdit, LogIn } from "lucide-react";

const mockLogs = [
  { action: 'Donation recorded', user: 'Operator 1', time: '2 min ago', icon: FileEdit, type: 'entry' },
  { action: 'Expense approved', user: 'Accountant', time: '15 min ago', icon: ClipboardList, type: 'approval' },
  { action: 'User logged in', user: 'Admin', time: '1 hour ago', icon: LogIn, type: 'login' },
  { action: 'Report exported', user: 'CA User', time: '3 hours ago', icon: FileEdit, type: 'export' },
];

export const AuditLogWidget = () => {
  const { permissions } = useRules();

  if (!permissions?.canAccessAuditLogs) return null;

  const typeColors = {
    entry: 'bg-teal/20 text-teal',
    approval: 'bg-primary/20 text-primary',
    login: 'bg-secondary text-muted-foreground',
    export: 'bg-coral/20 text-coral',
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>
        <button className="text-xs text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {mockLogs.map((log, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className={`p-2 rounded-lg ${typeColors[log.type as keyof typeof typeColors]}`}>
              <log.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{log.action}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <User className="w-3 h-3" />
                <span>{log.user}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {log.time}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Full audit trail: Login • Data Entry • Approvals • Exports • Filings
        </p>
      </div>
    </div>
  );
};
