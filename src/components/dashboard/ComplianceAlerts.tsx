import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react";

const alerts = [
  {
    type: "warning",
    title: "80G Certificate Renewal",
    description: "Your 80G certificate expires in 45 days",
    action: "Renew Now",
  },
  {
    type: "success",
    title: "12A Certificate Valid",
    description: "Valid until March 2028",
    action: "View Details",
  },
  {
    type: "info",
    title: "Annual Return Due",
    description: "Form 10B submission deadline: 30th Sept",
    action: "Prepare Now",
  },
];

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Clock,
};

const colorMap = {
  warning: "text-amber-400 bg-amber-400/20",
  success: "text-emerald-400 bg-emerald-400/20",
  info: "text-blue-400 bg-blue-400/20",
};

export const ComplianceAlerts = () => {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Compliance Status</h3>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = iconMap[alert.type as keyof typeof iconMap];
          const colors = colorMap[alert.type as keyof typeof colorMap];
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className={`p-2 rounded-lg ${colors}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {alert.description}
                </p>
              </div>
              <button className="text-xs text-primary hover:underline whitespace-nowrap">
                {alert.action}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
