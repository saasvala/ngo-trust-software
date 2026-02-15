import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Database, HardDrive, Clock, Shield, Download, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const backupHistory = [
  { id: "BK-001", type: "Full", size: "2.4 GB", status: "completed", createdAt: "2026-02-15 02:00", duration: "12m 34s", retentionDays: 90 },
  { id: "BK-002", type: "Incremental", size: "148 MB", status: "completed", createdAt: "2026-02-15 01:00", duration: "1m 22s", retentionDays: 7 },
  { id: "BK-003", type: "Incremental", size: "210 MB", status: "completed", createdAt: "2026-02-14 23:00", duration: "1m 45s", retentionDays: 7 },
  { id: "BK-004", type: "Incremental", size: "95 MB", status: "completed", createdAt: "2026-02-14 22:00", duration: "0m 58s", retentionDays: 7 },
  { id: "BK-005", type: "Full", size: "2.3 GB", status: "completed", createdAt: "2026-02-14 02:00", duration: "11m 52s", retentionDays: 90 },
  { id: "BK-006", type: "Incremental", size: "312 MB", status: "failed", createdAt: "2026-02-13 23:00", duration: "—", retentionDays: 7 },
];

const restoreLog = [
  { id: "RS-001", backupId: "BK-089", restoredBy: "super_admin", restoredAt: "2026-01-28 14:30", status: "success", reason: "Data migration test" },
  { id: "RS-002", backupId: "BK-045", restoredBy: "super_admin", restoredAt: "2025-12-15 09:12", status: "success", reason: "Disaster recovery drill" },
];

const Backups = () => {
  const [retentionPolicy, setRetentionPolicy] = useState({ daily: 7, weekly: 30, monthly: 90 });

  return (
    <MainLayout title="Disaster Recovery & Backup" subtitle="Automated backup engine with encrypted cloud storage">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Disaster Recovery & Backup" subtitle="Automated backup engine with encrypted cloud storage" icon={<Database className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Backups" value={347} icon={<HardDrive className="w-6 h-6 text-white" />} iconBg="primary" change="12 this week" trend="up" />
            <StatCard3D title="Last Backup" value="23" suffix="min ago" icon={<Clock className="w-6 h-6 text-white" />} iconBg="success" change="Incremental" trend="up" />
            <StatCard3D title="Storage Used" value={28.4} suffix="GB" icon={<Database className="w-6 h-6 text-white" />} iconBg="teal" change="Encrypted AES-256" trend="neutral" />
            <StatCard3D title="Success Rate" value={99.7} suffix="%" icon={<Shield className="w-6 h-6 text-white" />} iconBg="coral" change="1 failure in 30 days" trend="up" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Backup History" subtitle="Recent backup operations and status" icon={<Clock className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { toast.success("Manual backup initiated"); }}>
                  <Download className="w-4 h-4 mr-2" />Trigger Manual Backup
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Retention: {retentionPolicy.daily}d / {retentionPolicy.weekly}d / {retentionPolicy.monthly}d</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">ID</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Size</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Time</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Duration</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Retention</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backupHistory.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-mono text-xs">{b.id}</td>
                      <td className="py-3 px-4"><Badge variant={b.type === "Full" ? "default" : "secondary"}>{b.type}</Badge></td>
                      <td className="py-3 px-4">{b.size}</td>
                      <td className="py-3 px-4">
                        <span className={`flex items-center gap-1 ${b.status === 'completed' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {b.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{b.createdAt}</td>
                      <td className="py-3 px-4">{b.duration}</td>
                      <td className="py-3 px-4">{b.retentionDays}d</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Restore from ${b.id} requested`)}>
                          <RotateCcw className="w-3 h-3 mr-1" />Restore
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Restore Audit Log" subtitle="All restore operations are logged immutably" icon={<RotateCcw className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {restoreLog.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">Restored from {r.backupId}</p>
                  <p className="text-sm text-muted-foreground">{r.reason} · by {r.restoredBy}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">{r.status}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{r.restoredAt}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Retention Policy & Analytics" subtitle="Storage trends and policy configuration" icon={<HardDrive className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Backup Analytics" subtitle="Storage utilization over time" onExport={() => toast.success("Backup report exported")}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Backups (30d)", value: "127" },
                { label: "Avg Backup Size", value: "1.8 GB" },
                { label: "Failed Backups", value: "1" },
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

export default Backups;
