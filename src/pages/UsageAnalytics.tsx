import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { BarChart3, Users, Clock, Activity, Layers, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const moduleUsage = [
  { module: "Dashboard", sessions: 4520, avgDuration: "4m 32s", percentage: 95 },
  { module: "Donations", sessions: 3210, avgDuration: "6m 15s", percentage: 82 },
  { module: "Expenses", sessions: 2840, avgDuration: "5m 48s", percentage: 74 },
  { module: "Reports", sessions: 2100, avgDuration: "8m 22s", percentage: 65 },
  { module: "Compliance", sessions: 1560, avgDuration: "3m 10s", percentage: 52 },
  { module: "Projects", sessions: 1340, avgDuration: "7m 05s", percentage: 48 },
  { module: "Documents", sessions: 890, avgDuration: "2m 45s", percentage: 35 },
  { module: "Settings", sessions: 320, avgDuration: "1m 50s", percentage: 12 },
];

const roleEngagement = [
  { role: "NGO Admin", logins: 342, avgSessions: 8.2, topModule: "Dashboard", engagement: 92 },
  { role: "Accountant", logins: 287, avgSessions: 6.5, topModule: "Donations", engagement: 85 },
  { role: "Operator", logins: 198, avgSessions: 5.1, topModule: "Donations", engagement: 78 },
  { role: "Project Manager", logins: 156, avgSessions: 4.8, topModule: "Projects", engagement: 72 },
  { role: "Auditor / CA", logins: 89, avgSessions: 3.2, topModule: "Reports", engagement: 65 },
  { role: "Field Executor", logins: 67, avgSessions: 2.1, topModule: "Dashboard", engagement: 45 },
];

const peakHours = [
  { hour: "09:00", sessions: 245 }, { hour: "10:00", sessions: 380 }, { hour: "11:00", sessions: 420 },
  { hour: "12:00", sessions: 310 }, { hour: "13:00", sessions: 180 }, { hour: "14:00", sessions: 390 },
  { hour: "15:00", sessions: 445 }, { hour: "16:00", sessions: 410 }, { hour: "17:00", sessions: 280 },
  { hour: "18:00", sessions: 120 },
];

const maxSessions = Math.max(...peakHours.map(h => h.sessions));

const UsageAnalytics = () => {
  return (
    <MainLayout title="Usage Analytics" subtitle="Activity heatmaps and engagement tracking">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Activity Heatmap & Usage Analytics" subtitle="Login frequency, module usage, and role engagement" icon={<BarChart3 className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Daily Active Users" value={187} icon={<Users className="w-6 h-6 text-white" />} iconBg="primary" change="+12% vs last week" trend="up" />
            <StatCard3D title="Avg Session Duration" value="5.2" suffix="min" icon={<Clock className="w-6 h-6 text-white" />} iconBg="teal" change="+0.8 min vs avg" trend="up" />
            <StatCard3D title="Peak Hour" value="15:00" icon={<Activity className="w-6 h-6 text-white" />} iconBg="success" change="445 sessions" trend="up" />
            <StatCard3D title="Modules Used" value={8} suffix="/16" icon={<Layers className="w-6 h-6 text-white" />} iconBg="coral" change="Top: Dashboard" trend="neutral" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Module Usage" subtitle="Session counts and engagement per module" icon={<Layers className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {moduleUsage.map((m) => (
              <div key={m.module} className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{m.module}</p>
                    <p className="text-xs text-muted-foreground">{m.sessions.toLocaleString()} sessions · Avg {m.avgDuration}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground">{m.percentage}%</span>
                </div>
                <Progress value={m.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Peak Usage Hours" subtitle="Session distribution throughout the day" icon={<Clock className="w-5 h-5 text-teal" />} defaultExpanded={true}>
          <div className="flex items-end gap-2 h-40">
            {peakHours.map((h) => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{h.sessions}</span>
                <div className="w-full bg-primary/60 rounded-t-sm transition-all hover:bg-primary" style={{ height: `${(h.sessions / maxSessions) * 100}%` }} />
                <span className="text-xs text-muted-foreground">{h.hour.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Role Engagement Analytics" subtitle="Login patterns and module preferences per role" icon={<TrendingUp className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Role Analytics" subtitle="Engagement breakdown by role" onExport={() => toast.success("Usage report exported")}>
            <div className="space-y-3">
              {roleEngagement.map((r) => (
                <div key={r.role} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.role}</p>
                    <p className="text-xs text-muted-foreground">{r.logins} logins · {r.avgSessions} avg sessions/user · Top: {r.topModule}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <Progress value={r.engagement} className="h-2" />
                    </div>
                    <span className="text-sm text-foreground w-10 text-right">{r.engagement}%</span>
                  </div>
                </div>
              ))}
            </div>
          </DeepResearchView>
        </DashboardSection>
      </div>
    </MainLayout>
  );
};

export default UsageAnalytics;
