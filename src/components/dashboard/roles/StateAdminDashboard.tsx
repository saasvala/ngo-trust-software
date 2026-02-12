import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import {
  MapPin,
  Users,
  TrendingUp,
  Shield,
  AlertTriangle,
  FileText,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const StateAdminDashboard = () => {
  const { location, formatCurrency } = useRules();
  const stateName = location.state?.stateName || "State";

  const ngoPerformance = [
    { name: "Hope Foundation", donations: 8500000, projects: 4, compliance: 98, utilization: 91 },
    { name: "Rural Aid Society", donations: 4200000, projects: 3, compliance: 85, utilization: 78 },
    { name: "Green Earth Trust", donations: 3100000, projects: 2, compliance: 92, utilization: 88 },
    { name: "Children First NGO", donations: 6800000, projects: 5, compliance: 96, utilization: 94 },
  ];

  return (
    <div className="space-y-8">
      <DashboardSection level="macro" title={`${stateName} Overview`} subtitle="State-level NGO aggregation and compliance" icon={<MapPin className="w-6 h-6 text-white" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D title="NGOs in State" value={ngoPerformance.length} icon={<Users className="w-6 h-6 text-white" />} iconBg="teal" change={`In ${stateName}`} trend="up" />
          <StatCard3D title="State Donations" value="₹2.26Cr" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="success" change="+14% YoY" trend="up" />
          <StatCard3D title="Compliance Rate" value="92.8%" icon={<Shield className="w-6 h-6 text-white" />} iconBg="warning" change="Target: 95%" trend="up" />
          <StatCard3D title="Risk Indicators" value={2} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="1 medium" trend="down" />
        </div>
      </DashboardSection>

      <DashboardSection level="micro" title="NGO Performance Comparison" subtitle="Side-by-side performance metrics" icon={<BarChart3 className="w-5 h-5 text-primary" />} defaultExpanded={true}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">NGO</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Donations</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Projects</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Compliance</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {ngoPerformance.map((ngo) => (
                <tr key={ngo.name} className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-foreground">{ngo.name}</td>
                  <td className="py-2 px-3 text-right font-mono text-foreground">{formatCurrency(ngo.donations)}</td>
                  <td className="py-2 px-3 text-right text-foreground">{ngo.projects}</td>
                  <td className="py-2 px-3 text-right">
                    <Badge variant={ngo.compliance >= 90 ? "default" : "destructive"}>{ngo.compliance}%</Badge>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Badge variant={ngo.utilization >= 85 ? "default" : "secondary"}>{ngo.utilization}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      <DashboardSection level="nano" title="Compliance Heatmap" subtitle="Certificate and filing status per NGO" icon={<Shield className="w-5 h-5 text-teal" />} defaultExpanded={false}>
        <div className="grid grid-cols-2 gap-3">
          {ngoPerformance.map((ngo) => (
            <div key={ngo.name} className={`p-4 rounded-xl border ${ngo.compliance >= 90 ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
              <p className="font-medium text-foreground mb-2">{ngo.name}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Compliance</span><span className="font-medium text-foreground">{ngo.compliance}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Utilization</span><span className="font-medium text-foreground">{ngo.utilization}%</span></div>
              </div>
              <Progress value={ngo.compliance} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection level="deep" title="State Analytics" subtitle="Historical trends and forecasting" icon={<FileText className="w-5 h-5 text-coral" />} defaultExpanded={false}>
        <DeepResearchView title="State-Level Deep Analytics" subtitle="Multi-year performance data" onExport={() => console.log("Export state data")}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "2-Year Growth", value: "+31%" },
              { label: "Avg Utilization", value: "87.8%" },
              { label: "Filing Rate", value: "96%" },
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
