import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { AlertTriangle, TrendingDown, Shield, Activity, BarChart3 } from "lucide-react";

const riskItems = [
  { entity: "Women Empowerment Project", risk: "Budget overrun by 4%", level: "high", score: 78 },
  { entity: "12A Registration", risk: "Expiring in 45 days", level: "medium", score: 55 },
  { entity: "FCRA Compliance", risk: "Foreign donation ratio near limit", level: "medium", score: 52 },
  { entity: "Donor Concentration", risk: "Top 3 donors = 68% of funds", level: "low", score: 35 },
];

const Risk = () => {
  return (
    <MainLayout title="Risk Management" subtitle="Risk scoring, deviation indicators and mitigation tracking">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Risk Overview" subtitle="Organization-wide risk indicators" icon={<AlertTriangle className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Overall Risk Score" value={32} suffix="/100" icon={<Activity className="w-6 h-6 text-white" />} iconBg="success" change="Low risk" trend="up" />
            <StatCard3D title="High Risk Items" value={2} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="Action needed" trend="down" />
            <StatCard3D title="Compliance Score" value={94} suffix="%" icon={<Shield className="w-6 h-6 text-white" />} iconBg="teal" change="+3% vs last quarter" trend="up" />
            <StatCard3D title="Financial Health" value={87} suffix="%" icon={<TrendingDown className="w-6 h-6 text-white" />} iconBg="primary" change="Stable" trend="up" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Risk Register" subtitle="Active risk items with scoring" icon={<BarChart3 className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {riskItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.level === 'high' ? 'bg-coral/20' : item.level === 'medium' ? 'bg-warning/20' : 'bg-success/20'}`}>
                    <span className={`text-sm font-bold ${item.level === 'high' ? 'text-coral' : item.level === 'medium' ? 'text-warning' : 'text-success'}`}>{item.score}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.entity}</p>
                    <p className="text-xs text-muted-foreground">{item.risk}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.level === 'high' ? 'bg-coral/20 text-coral' : item.level === 'medium' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-emerald-400'}`}>
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Deviation Indicators" subtitle="Key metric deviations from benchmarks" icon={<TrendingDown className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { metric: "Admin Cost Ratio", value: "12.4%", benchmark: "<15%", status: "ok" },
              { metric: "Utilization Rate", value: "76%", benchmark: ">80%", status: "warn" },
              { metric: "Donor Churn", value: "8%", benchmark: "<10%", status: "ok" },
              { metric: "Expense Approval Time", value: "3.2 days", benchmark: "<2 days", status: "warn" },
            ].map((d) => (
              <div key={d.metric} className="p-4 rounded-xl bg-secondary/30">
                <p className={`text-lg font-bold ${d.status === 'ok' ? 'text-success' : 'text-warning'}`}>{d.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.metric}</p>
                <p className="text-xs text-muted-foreground">Benchmark: {d.benchmark}</p>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Risk Intelligence" subtitle="Historical risk analysis and trend forecasting" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Risk Trend Analysis" subtitle="YoY risk score comparison" onExport={() => {}}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Avg Risk Score (FY)", value: "28.5" },
                { label: "Mitigations Applied", value: "47" },
                { label: "Risk Reduction", value: "-18%" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </DeepResearchView>
        </DashboardSection>
      </div>
    </MainLayout>
  );
};

export default Risk;
