import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Landmark, FileText, Clock, CheckCircle, TrendingUp, Activity } from "lucide-react";

const grants = [
  { name: "UNICEF Water & Sanitation", amount: 5000000, status: "active", utilization: 64, period: "2024-2026" },
  { name: "State Education Grant", amount: 1200000, status: "active", utilization: 82, period: "2025-2026" },
  { name: "CSR - Tata Trust", amount: 2500000, status: "reporting", utilization: 95, period: "2024-2025" },
  { name: "USAID Health Program", amount: 8000000, status: "proposal", utilization: 0, period: "2026-2028" },
];

const Grants = () => {
  return (
    <MainLayout title="Grant Lifecycle" subtitle="Grant tracking from proposal to utilization certificate">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Grant Portfolio" subtitle="Active grants and fund allocation" icon={<Landmark className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Active Grants" value={6} icon={<Landmark className="w-6 h-6 text-white" />} iconBg="primary" change="3 in reporting phase" trend="neutral" />
            <StatCard3D title="Total Grant Value" value={16700000} prefix="₹" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="teal" change="This FY" trend="up" />
            <StatCard3D title="UC Pending" value={2} icon={<FileText className="w-6 h-6 text-white" />} iconBg="warning" change="Due this quarter" trend="neutral" />
            <StatCard3D title="Proposals Pending" value={3} icon={<Clock className="w-6 h-6 text-white" />} iconBg="coral" change="Under review" trend="neutral" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Grant Tracker" subtitle="Lifecycle status of all grants" icon={<Activity className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-4">
            {grants.map((g) => (
              <div key={g.name} className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.period} · ₹{(g.amount / 100000).toFixed(0)}L</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${g.status === 'active' ? 'bg-success/20 text-emerald-400' : g.status === 'reporting' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                    {g.status}
                  </span>
                </div>
                {g.utilization > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Utilization</span><span>{g.utilization}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-teal rounded-full" style={{ width: `${g.utilization}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="UC Management" subtitle="Utilization certificate tracking" icon={<FileText className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {[
              { grant: "UNICEF Water & Sanitation", uc: "UC-2025-Q1", due: "Apr 15, 2025", status: "draft" },
              { grant: "State Education Grant", uc: "UC-2025-Q4", due: "Mar 31, 2025", status: "submitted" },
              { grant: "CSR - Tata Trust", uc: "UC-2024-Final", due: "Jun 30, 2025", status: "approved" },
            ].map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{u.uc}</p>
                  <p className="text-xs text-muted-foreground">{u.grant} · Due: {u.due}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === 'approved' ? 'bg-success/20 text-emerald-400' : u.status === 'submitted' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Grant Intelligence" subtitle="Historical analysis and forecasting" icon={<Landmark className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Grant Analytics" subtitle="Multi-year grant performance" onExport={() => {}}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Grants (5yr)", value: "₹84.5Cr" },
                { label: "Avg Utilization", value: "81.2%" },
                { label: "Success Rate", value: "94%" },
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

export default Grants;
