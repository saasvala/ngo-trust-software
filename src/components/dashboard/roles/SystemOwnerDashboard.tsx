import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import {
  Server, Shield, Users, Activity, Cpu, HardDrive, Eye, Clock
} from "lucide-react";

export const SystemOwnerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* MACRO */}
      <DashboardSection level="macro" title="Platform Health" subtitle="System-wide metrics and uptime" icon={<Server className="w-6 h-6 text-white" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D title="Active Tenants" value={38} icon={<Users className="w-6 h-6 text-white" />} iconBg="primary" change="+3 this month" trend="up" />
          <StatCard3D title="Uptime" value={99.97} suffix="%" icon={<Activity className="w-6 h-6 text-white" />} iconBg="success" change="Last 30 days" trend="up" />
          <StatCard3D title="API Calls Today" value={284500} icon={<Cpu className="w-6 h-6 text-white" />} iconBg="teal" change="+12% vs avg" trend="up" />
          <StatCard3D title="Storage Used" value={847} suffix="GB" icon={<HardDrive className="w-6 h-6 text-white" />} iconBg="coral" change="78% capacity" trend="neutral" />
        </div>
      </DashboardSection>

      {/* MICRO */}
      <DashboardSection level="micro" title="Tenant Analytics" subtitle="Usage patterns across organizations" icon={<Eye className="w-5 h-5 text-primary" />} defaultExpanded={true}>
        <div className="space-y-3">
          {[
            { tenant: "Global Relief Foundation", users: 124, apiCalls: 45200, status: "healthy" },
            { tenant: "Education First India", users: 87, apiCalls: 32100, status: "healthy" },
            { tenant: "Green Earth UK", users: 56, apiCalls: 18700, status: "warning" },
            { tenant: "Hope Alliance Canada", users: 34, apiCalls: 12400, status: "healthy" },
            { tenant: "Child Future Australia", users: 21, apiCalls: 8900, status: "healthy" },
          ].map((t) => (
            <div key={t.tenant} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all">
              <div>
                <p className="font-medium text-foreground">{t.tenant}</p>
                <p className="text-sm text-muted-foreground">{t.users} users · {t.apiCalls.toLocaleString()} API calls</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.status === 'healthy' ? 'bg-success/20 text-emerald-400' : 'bg-warning/20 text-amber-400'}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* NANO */}
      <DashboardSection level="nano" title="Security Events" subtitle="Recent security and access events" icon={<Shield className="w-5 h-5 text-teal" />} defaultExpanded={false}>
        <div className="space-y-3">
          {[
            { event: "Failed login attempt", source: "IP 103.24.x.x", time: "5 min ago", severity: "high" },
            { event: "New admin role assigned", source: "tenant:edu_first", time: "1 hour ago", severity: "medium" },
            { event: "API rate limit hit", source: "tenant:green_earth", time: "3 hours ago", severity: "low" },
            { event: "Database backup completed", source: "system", time: "6 hours ago", severity: "info" },
          ].map((e, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${e.severity === 'high' ? 'bg-coral' : e.severity === 'medium' ? 'bg-warning' : e.severity === 'low' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{e.event}</p>
                  <p className="text-xs text-muted-foreground">{e.source}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* DEEP RESEARCH */}
      <DashboardSection level="deep" title="System Intelligence" subtitle="Performance trends and capacity planning" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
        <DeepResearchView title="Platform Analytics" subtitle="Historical performance and usage trends" onExport={() => {}}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Transactions", value: "12.8M" },
              { label: "Avg Response Time", value: "142ms" },
              { label: "Error Rate", value: "0.03%" },
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
