import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Zap, Play, Pause, CheckCircle, AlertTriangle, Activity, Bell, Shield, Clock } from "lucide-react";

const automationRules = [
  { name: "High-value donation alert", condition: "Donation amount > ₹1,00,000", action: "Notify Super Admin + NGO Admin", status: "active", triggers: 23 },
  { name: "Compliance expiry reminder", condition: "Certificate expires in ≤ 30 days", action: "Email + In-app notification to Admin", status: "active", triggers: 8 },
  { name: "Project underfunding alert", condition: "Project utilization < 30% after 6 months", action: "AI suggestion + PM notification", status: "active", triggers: 3 },
  { name: "Expense auto-approve (small)", condition: "Expense ≤ ₹5,000 from verified operator", action: "Auto-approve + log entry", status: "active", triggers: 156 },
  { name: "Cash donation limit breach", condition: "Cash donation > ₹2,000 (India)", action: "Block + flag for review", status: "active", triggers: 2 },
  { name: "Duplicate donation detector", condition: "Same donor + amount within 24 hours", action: "Flag as potential duplicate", status: "active", triggers: 5 },
  { name: "FX rate volatility alert", condition: "Currency fluctuation > 3% in 24hrs", action: "Alert Accountant", status: "paused", triggers: 0 },
  { name: "Grant milestone reminder", condition: "Milestone due within 15 days", action: "Notify PM + send report template", status: "active", triggers: 12 },
];

const recentExecutions = [
  { rule: "High-value donation alert", entity: "DON-4821 (₹2,50,000)", time: "2 hours ago", result: "success" },
  { rule: "Expense auto-approve", entity: "EXP-1192 (₹3,200)", time: "4 hours ago", result: "success" },
  { rule: "Compliance expiry reminder", entity: "80G Certificate", time: "1 day ago", result: "success" },
  { rule: "Duplicate donation detector", entity: "DON-4815 / DON-4816", time: "2 days ago", result: "flagged" },
  { rule: "Project underfunding alert", entity: "Skill Development Program", time: "3 days ago", result: "success" },
];

const AutomationRules = () => {
  return (
    <MainLayout title="Automation Rules" subtitle="IF-THEN rule engine for automated actions and smart alerts">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Automation Overview" subtitle="Active rules and execution metrics" icon={<Zap className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Active Rules" value={7} icon={<Play className="w-6 h-6 text-white" />} iconBg="success" change="1 paused" trend="up" />
            <StatCard3D title="Total Triggers" value={209} icon={<Zap className="w-6 h-6 text-white" />} iconBg="primary" change="This FY" trend="up" />
            <StatCard3D title="Auto-Approved" value={156} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="teal" change="₹4.8L saved" trend="up" />
            <StatCard3D title="Flags Raised" value={10} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="warning" change="5 resolved" trend="neutral" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Rule Registry" subtitle="All automation rules with conditions and actions" icon={<Shield className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {automationRules.map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {r.status === 'active' ? <Play className="w-4 h-4 text-success" /> : <Pause className="w-4 h-4 text-warning" />}
                    <p className="font-medium text-foreground">{r.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{r.triggers} triggers</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'active' ? 'bg-success/20 text-emerald-400' : 'bg-warning/20 text-warning'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-2 rounded-lg bg-secondary/30">
                    <p className="text-xs text-muted-foreground mb-1">IF condition</p>
                    <p className="text-xs text-foreground">{r.condition}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/30">
                    <p className="text-xs text-muted-foreground mb-1">THEN action</p>
                    <p className="text-xs text-foreground">{r.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Recent Executions" subtitle="Latest rule trigger log" icon={<Clock className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {recentExecutions.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${e.result === 'success' ? 'bg-success' : 'bg-warning'}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{e.rule}</p>
                    <p className="text-xs text-muted-foreground">{e.entity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.result === 'success' ? 'bg-success/20 text-emerald-400' : 'bg-warning/20 text-warning'}`}>
                    {e.result}
                  </span>
                  <span className="text-xs text-muted-foreground">{e.time}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Automation Intelligence" subtitle="Rule performance and optimization insights" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Rule Analytics" subtitle="Effectiveness and impact measurement" onExport={() => {}}>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Rules Created", value: "24" },
                { label: "Success Rate", value: "98.1%" },
                { label: "Time Saved", value: "~120 hrs" },
                { label: "Cost Saved", value: "₹4.8L" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-xl font-bold text-foreground">{item.value}</p>
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

export default AutomationRules;
