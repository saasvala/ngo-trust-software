import { useState, useEffect } from "react";
import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import { StatCardSkeleton } from "@/components/ui/loading";
import {
  Globe,
  Users,
  TrendingUp,
  Shield,
  MapPin,
  AlertTriangle,
  FileText,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const CountryAdminDashboard = () => {
  const { location, formatCurrency } = useRules();
  const countryName = location.country?.countryName || "Country";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const statePerformance = [
    { state: "Maharashtra", ngos: 12, donations: 18500000, compliance: 96, risk: 15 },
    { state: "Karnataka", ngos: 8, donations: 12300000, compliance: 91, risk: 22 },
    { state: "Tamil Nadu", ngos: 6, donations: 9800000, compliance: 88, risk: 28 },
    { state: "Delhi NCR", ngos: 10, donations: 22100000, compliance: 94, risk: 18 },
    { state: "West Bengal", ngos: 5, donations: 6200000, compliance: 82, risk: 35 },
  ];

  return (
    <div className="space-y-8">
      <DashboardSection level="macro" title={`${countryName} Overview`} subtitle="Country-wide NGO network performance" icon={<Globe className="w-6 h-6 text-white" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D title="Total NGOs" value={41} icon={<Users className="w-6 h-6 text-white" />} iconBg="teal" change="Across 5 states" trend="up" />
          <StatCard3D title="Total Donations" value="₹6.89Cr" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="success" change="+18% YoY" trend="up" />
          <StatCard3D title="Avg Compliance" value="90.2%" icon={<Shield className="w-6 h-6 text-white" />} iconBg="warning" change="Target: 95%" trend="neutral" />
          <StatCard3D title="Risk Flags" value={8} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="3 critical" trend="down" />
        </div>
      </DashboardSection>

      <DashboardSection level="micro" title="State-wise Performance" subtitle="NGO metrics aggregated by state" icon={<MapPin className="w-5 h-5 text-primary" />} defaultExpanded={true}>
        <div className="space-y-3">
          {statePerformance.map((s) => (
            <div key={s.state} className="p-4 rounded-xl border border-border bg-secondary/20">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{s.state}</p>
                  <p className="text-xs text-muted-foreground">{s.ngos} NGOs · {formatCurrency(s.donations)} raised</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={s.compliance >= 90 ? "default" : "destructive"}>{s.compliance}% compliant</Badge>
                  <span className={`text-xs font-mono ${s.risk > 25 ? "text-coral" : "text-success"}`}>Risk: {s.risk}</span>
                </div>
              </div>
              <Progress value={s.compliance} className="h-1.5" />
            </div>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection level="nano" title="Compliance Heatmap" subtitle="Certificate expiry and filing gaps across states" icon={<Shield className="w-5 h-5 text-teal" />} defaultExpanded={false}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "12A Valid", count: 38, total: 41, color: "success" },
            { label: "80G Valid", count: 35, total: 41, color: "warning" },
            { label: "FCRA Active", count: 18, total: 22, color: "teal" },
            { label: "ITR Filed", count: 39, total: 41, color: "success" },
            { label: "UC Submitted", count: 30, total: 35, color: "warning" },
            { label: "Audit Cleared", count: 37, total: 41, color: "success" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{item.count}/{item.total}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <Progress value={(item.count / item.total) * 100} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection level="deep" title="Country Analytics" subtitle="Multi-year trend and deviation analysis" icon={<BarChart3 className="w-5 h-5 text-coral" />} defaultExpanded={false}>
        <DeepResearchView title="Country-Level Deep Analytics" subtitle="Historical performance and forecasting" onExport={() => console.log("Export country data")}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "3-Year Donation Growth", value: "+42%" },
              { label: "Avg Utilization Rate", value: "87.3%" },
              { label: "Compliance Improvement", value: "+8.1%" },
            ].map((i) => (
              <div key={i.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-primary">{i.value}</p>
                <p className="text-xs text-muted-foreground">{i.label}</p>
              </div>
            ))}
          </div>
        </DeepResearchView>
      </DashboardSection>
    </div>
  );
};
