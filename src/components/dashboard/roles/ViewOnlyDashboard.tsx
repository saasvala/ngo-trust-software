import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import {
  Eye, TrendingUp, Users, Heart, Shield, BarChart3
} from "lucide-react";

export const ViewOnlyDashboard = () => {
  return (
    <div className="space-y-8">
      {/* MACRO */}
      <DashboardSection level="macro" title="Organization Overview" subtitle="Read-only summary of key metrics" icon={<Eye className="w-6 h-6 text-white" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D title="Total Donations" value={12500000} prefix="₹" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="primary" change="This FY" trend="up" />
          <StatCard3D title="Active Projects" value={12} icon={<Heart className="w-6 h-6 text-white" />} iconBg="teal" change="3 completing soon" trend="neutral" />
          <StatCard3D title="Beneficiaries" value={8450} icon={<Users className="w-6 h-6 text-white" />} iconBg="coral" change="+12% YoY" trend="up" />
          <StatCard3D title="Compliance Score" value={94} suffix="%" icon={<Shield className="w-6 h-6 text-white" />} iconBg="success" change="All clear" trend="up" />
        </div>
      </DashboardSection>

      {/* MICRO - Limited breakdown */}
      <DashboardSection level="micro" title="Performance Summary" subtitle="High-level module performance" icon={<BarChart3 className="w-5 h-5 text-primary" />} defaultExpanded={true}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Donation Growth", value: "+18.5%", color: "text-success" },
            { label: "Utilization Rate", value: "76.4%", color: "text-primary" },
            { label: "Donor Retention", value: "82%", color: "text-teal" },
            { label: "Impact Score", value: "A+", color: "text-coral" },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-xl bg-secondary/30 text-center">
              <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* Info notice */}
      <div className="glass-card p-4 flex items-center gap-3">
        <Eye className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          You have read-only access. Contact your administrator for additional permissions or data exports.
        </p>
      </div>
    </div>
  );
};
