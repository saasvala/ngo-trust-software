import { CheckCircle, AlertTriangle, Clock, Shield, TrendingUp, FileCheck } from "lucide-react";

export const ComplianceStats = () => {
  const stats = [
    {
      label: "Overall Compliance",
      value: "100%",
      status: "success",
      icon: Shield,
      description: "All certificates valid",
    },
    {
      label: "12A Status",
      value: "Valid",
      status: "success",
      icon: CheckCircle,
      description: "1,825 days remaining",
    },
    {
      label: "80G Status",
      value: "Expiring",
      status: "warning",
      icon: AlertTriangle,
      description: "98 days remaining",
    },
    {
      label: "Last Audit",
      value: "Cleared",
      status: "success",
      icon: FileCheck,
      description: "FY 2023-24",
    },
  ];

  const statusColors = {
    success: "from-emerald-500 to-teal",
    warning: "from-amber-500 to-coral",
    error: "from-red-500 to-rose-400",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card p-5 relative overflow-hidden group">
          {/* Background Gradient */}
          <div
            className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${
              statusColors[stat.status as keyof typeof statusColors]
            } opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
          />

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <stat.icon
                className={`w-5 h-5 ${
                  stat.status === "success"
                    ? "text-emerald-400"
                    : stat.status === "warning"
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              />
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.status === "success"
                    ? "bg-emerald-400/20 text-emerald-400"
                    : stat.status === "warning"
                    ? "bg-amber-400/20 text-amber-400"
                    : "bg-red-400/20 text-red-400"
                }`}
              >
                {stat.status === "success"
                  ? "Good"
                  : stat.status === "warning"
                  ? "Attention"
                  : "Critical"}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
