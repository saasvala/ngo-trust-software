import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Activity, Gauge, Server, AlertTriangle, Zap, Clock, Cpu, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const healthServices = [
  { name: "API Gateway", status: "operational", uptime: 99.99, responseTime: 42, load: 34 },
  { name: "Database Primary", status: "operational", uptime: 99.97, responseTime: 8, load: 56 },
  { name: "Database Replica", status: "operational", uptime: 99.95, responseTime: 12, load: 41 },
  { name: "Auth Service", status: "operational", uptime: 99.98, responseTime: 65, load: 22 },
  { name: "Storage CDN", status: "degraded", uptime: 99.82, responseTime: 180, load: 78 },
  { name: "Background Jobs", status: "operational", uptime: 99.93, responseTime: 0, load: 45 },
  { name: "Email Service", status: "operational", uptime: 99.91, responseTime: 320, load: 15 },
];

const failedJobs = [
  { id: "JOB-4521", type: "Email Delivery", error: "SMTP timeout", time: "14 min ago", retries: 3 },
  { id: "JOB-4519", type: "Report Generation", error: "Memory limit exceeded", time: "1 hour ago", retries: 1 },
  { id: "JOB-4503", type: "Backup Incremental", error: "Connection reset", time: "3 hours ago", retries: 3 },
];

const alerts = [
  { level: "warning", message: "Storage CDN response time elevated (>150ms)", time: "5 min ago" },
  { level: "info", message: "Database replica lag within acceptable range (12ms)", time: "22 min ago" },
  { level: "error", message: "3 failed jobs in last 4 hours", time: "1 hour ago" },
];

const SystemHealth = () => {
  return (
    <MainLayout title="System Health Monitor" subtitle="SLA tracking and infrastructure monitoring">
      <div className="space-y-8">
        <DashboardSection level="macro" title="SLA & System Health" subtitle="Real-time infrastructure monitoring · 99.9% SLA target" icon={<Activity className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Overall Uptime" value={99.97} suffix="%" icon={<Gauge className="w-6 h-6 text-white" />} iconBg="success" change="30-day average" trend="up" />
            <StatCard3D title="Avg Response" value={42} suffix="ms" icon={<Zap className="w-6 h-6 text-white" />} iconBg="primary" change="-8ms vs last week" trend="up" />
            <StatCard3D title="Error Rate" value={0.03} suffix="%" icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="teal" change="Within SLA" trend="up" />
            <StatCard3D title="Active Services" value={7} suffix="/7" icon={<Server className="w-6 h-6 text-white" />} iconBg="coral" change="1 degraded" trend="neutral" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Service Status" subtitle="Individual service health and performance" icon={<Server className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {healthServices.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.status === 'operational' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  <div>
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.uptime}% uptime · {s.responseTime > 0 ? `${s.responseTime}ms` : 'N/A'} avg</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Load</span>
                      <span className="text-foreground">{s.load}%</span>
                    </div>
                    <Progress value={s.load} className="h-2" />
                  </div>
                  <Badge variant={s.status === 'operational' ? 'default' : 'secondary'} className={s.status === 'operational' ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-amber-500/20 text-amber-400 border-0'}>
                    {s.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Alerts & Failed Jobs" subtitle="Threshold breaches and job failures" icon={<AlertTriangle className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground mb-2">Active Alerts</h4>
              {alerts.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${a.level === 'error' ? 'bg-red-400' : a.level === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    <p className="text-sm text-foreground">{a.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground mb-2">Failed Jobs</h4>
              {failedJobs.map((j) => (
                <div key={j.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm font-medium text-foreground">{j.type} <span className="font-mono text-xs text-muted-foreground">({j.id})</span></p>
                    <p className="text-xs text-red-400">{j.error} · {j.retries} retries</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{j.time}</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Performance Analytics" subtitle="Historical performance and capacity planning" icon={<BarChart3 className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Infrastructure Metrics" subtitle="30-day performance trends" onExport={() => toast.success("Health report exported")}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Peak QPS", value: "12,400" },
                { label: "P99 Latency", value: "245ms" },
                { label: "DB Connections", value: "847" },
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

export default SystemHealth;
