import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { ClipboardList, Shield, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";

const auditItems = [
  { entity: "Donation #DN-1247", action: "Amount verified", user: "CA Mehta", time: "10 min ago", status: "passed" },
  { entity: "Expense #EX-892", action: "Receipt validated", user: "Auditor Singh", time: "1 hour ago", status: "passed" },
  { entity: "Project - Rural Ed", action: "UC review pending", user: "System", time: "3 hours ago", status: "pending" },
  { entity: "Donor PAN - ABCPD1234F", action: "Identity check flagged", user: "System", time: "5 hours ago", status: "flagged" },
];

const Audit = () => {
  return (
    <MainLayout title="Audit & Inspection" subtitle="Immutable audit trail and compliance verification">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Audit Overview" subtitle="Current period audit metrics" icon={<ClipboardList className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Audits" value={156} icon={<ClipboardList className="w-6 h-6 text-white" />} iconBg="primary" change="This FY" trend="up" />
            <StatCard3D title="Passed" value={142} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change="91% pass rate" trend="up" />
            <StatCard3D title="Flagged" value={8} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="Requires review" trend="down" />
            <StatCard3D title="Pending" value={6} icon={<Clock className="w-6 h-6 text-white" />} iconBg="warning" change="In progress" trend="neutral" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Audit Trail" subtitle="Recent audit actions across entities" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {auditItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.status === 'passed' ? 'bg-success' : item.status === 'flagged' ? 'bg-coral' : 'bg-warning'}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.entity}</p>
                    <p className="text-xs text-muted-foreground">{item.action} · by {item.user}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Compliance Checks" subtitle="Entity-level verification status" icon={<Shield className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "12A Registration", status: "Valid", color: "text-success" },
              { label: "80G Certificate", status: "Expiring Soon", color: "text-warning" },
              { label: "FCRA License", status: "Active", color: "text-success" },
              { label: "Annual Filing", status: "Due Apr 30", color: "text-coral" },
            ].map((c) => (
              <div key={c.label} className="p-4 rounded-xl bg-secondary/30 text-center">
                <p className={`text-lg font-bold ${c.color}`}>{c.status}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Audit Intelligence" subtitle="Historical analysis and exception detection" icon={<ClipboardList className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Exception Analysis" subtitle="Anomalies detected across financial records" onExport={() => {}}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Records Scanned", value: "24,580" },
                { label: "Exceptions Found", value: "14" },
                { label: "Resolution Rate", value: "92%" },
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

export default Audit;
