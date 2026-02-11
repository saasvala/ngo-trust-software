import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import {
  FolderKanban, Target, TrendingUp, AlertTriangle, Clock, CheckCircle, Users, Activity
} from "lucide-react";

export const ProjectManagerDashboard = () => {
  const { location } = useRules();
  const sym = location.country?.currency.symbol || "₹";

  const milestones = [
    { name: "Phase 1 - Baseline Survey", project: "Clean Water Initiative", due: "Mar 15", status: "completed" },
    { name: "Vendor Onboarding", project: "Rural Education", due: "Mar 22", status: "in_progress" },
    { name: "Mid-term Review", project: "Women Empowerment", due: "Apr 01", status: "upcoming" },
    { name: "Impact Assessment Report", project: "Clean Water Initiative", due: "Apr 15", status: "upcoming" },
  ];

  return (
    <div className="space-y-8">
      {/* MACRO */}
      <DashboardSection level="macro" title="Project Portfolio" subtitle="Active projects, milestones & budget tracking" icon={<FolderKanban className="w-6 h-6 text-white" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D title="Active Projects" value={8} icon={<FolderKanban className="w-6 h-6 text-white" />} iconBg="primary" change="2 completing soon" trend="neutral" />
          <StatCard3D title="Total Budget" value={4500000} prefix={sym} icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="teal" change="72% allocated" trend="up" />
          <StatCard3D title="Milestones Due" value={5} icon={<Target className="w-6 h-6 text-white" />} iconBg="warning" change="This month" trend="neutral" />
          <StatCard3D title="At-Risk Items" value={2} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="Budget overrun" trend="down" />
        </div>
      </DashboardSection>

      {/* MICRO - Project Health */}
      <DashboardSection level="micro" title="Project Health Matrix" subtitle="Budget vs actual across active projects" icon={<Activity className="w-5 h-5 text-primary" />} defaultExpanded={true}>
        <div className="space-y-4">
          {[
            { name: "Clean Water Initiative", budget: 1200000, spent: 890000, progress: 74, status: "on_track" },
            { name: "Rural Education Program", budget: 800000, spent: 650000, progress: 60, status: "on_track" },
            { name: "Women Empowerment", budget: 500000, spent: 520000, progress: 45, status: "at_risk" },
            { name: "Healthcare Access", budget: 2000000, spent: 1100000, progress: 55, status: "on_track" },
          ].map((p) => (
            <div key={p.name} className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{p.name}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'on_track' ? 'bg-success/20 text-emerald-400' : 'bg-coral/20 text-coral'}`}>
                  {p.status === 'on_track' ? 'On Track' : 'At Risk'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Budget: {sym}{(p.budget / 100000).toFixed(1)}L</span>
                <span>Spent: {sym}{(p.spent / 100000).toFixed(1)}L</span>
                <span>Progress: {p.progress}%</span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${p.status === 'at_risk' ? 'bg-coral' : 'bg-gradient-to-r from-primary to-teal'}`} style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* NANO - Milestones */}
      <DashboardSection level="nano" title="Upcoming Milestones" subtitle="Key deliverables and deadlines" icon={<Target className="w-5 h-5 text-teal" />} defaultExpanded={false}>
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${m.status === 'completed' ? 'bg-success/20' : m.status === 'in_progress' ? 'bg-primary/20' : 'bg-secondary'}`}>
                  {m.status === 'completed' ? <CheckCircle className="w-4 h-4 text-success" /> : <Clock className="w-4 h-4 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.project}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Due: {m.due}</span>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* DEEP RESEARCH */}
      <DashboardSection level="deep" title="Project Intelligence" subtitle="Advanced analytics and dependency mapping" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
        <DeepResearchView title="Portfolio Analysis" subtitle="Cross-project resource and budget analysis" onExport={() => {}}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Avg Utilization", value: "76.4%" },
              { label: "On-Time Delivery", value: "82%" },
              { label: "Beneficiaries Reached", value: "24,580" },
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
  );
};
