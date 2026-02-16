import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Building2, FileText, CheckCircle, Clock, AlertTriangle, Upload, RefreshCw, Activity } from "lucide-react";

const filings = [
  { name: "Form 10BD", authority: "Income Tax Dept", period: "FY 2024-25", due: "May 31, 2025", status: "draft", ackNumber: null },
  { name: "Form 10BE", authority: "Income Tax Dept", period: "FY 2024-25", due: "Jun 15, 2025", status: "pending", ackNumber: null },
  { name: "FCRA Annual Return", authority: "MHA", period: "FY 2024-25", due: "Dec 31, 2025", status: "not_started", ackNumber: null },
  { name: "CSR-1 Registration", authority: "MCA", period: "One-time", due: "Completed", status: "submitted", ackNumber: "ACK-CSR1-2024-1847" },
  { name: "Annual Return (ITR-7)", authority: "Income Tax Dept", period: "AY 2025-26", due: "Oct 31, 2025", status: "not_started", ackNumber: null },
  { name: "80G Renewal Application", authority: "Income Tax Dept", period: "5-year", due: "Mar 31, 2027", status: "submitted", ackNumber: "ACK-80G-REN-2892" },
];

const submissionLog = [
  { filing: "CSR-1 Registration", submitted: "Jan 15, 2024", ack: "ACK-CSR1-2024-1847", method: "Online Portal", approvedBy: "NGO Admin" },
  { filing: "80G Renewal", submitted: "Dec 20, 2023", ack: "ACK-80G-REN-2892", method: "Online Portal", approvedBy: "Super Admin" },
  { filing: "Form 10BD (FY23-24)", submitted: "May 28, 2024", ack: "ACK-10BD-2024-5521", method: "API Submission", approvedBy: "CA Mehta" },
];

const GovernmentFiling = () => {
  return (
    <MainLayout title="Government Filing & Integration" subtitle="Regulatory filing tracker with submission logs and acknowledgment storage">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Filing Overview" subtitle="Statutory filing status across authorities" icon={<Building2 className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Filings" value={6} icon={<FileText className="w-6 h-6 text-white" />} iconBg="primary" change="This FY" trend="neutral" />
            <StatCard3D title="Submitted" value={2} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change="ACK received" trend="up" />
            <StatCard3D title="In Progress" value={2} icon={<Clock className="w-6 h-6 text-white" />} iconBg="warning" change="Draft + Pending" trend="neutral" />
            <StatCard3D title="Upcoming" value={2} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="Not started yet" trend="down" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Filing Tracker" subtitle="All statutory filings with status and deadlines" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {filings.map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.authority} · {f.period} · Due: {f.due}</p>
                    {f.ackNumber && <p className="text-xs text-primary mt-1">ACK: {f.ackNumber}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      f.status === 'submitted' ? 'bg-success/20 text-emerald-400' : 
                      f.status === 'draft' ? 'bg-primary/20 text-primary' : 
                      f.status === 'pending' ? 'bg-warning/20 text-warning' : 
                      'bg-secondary text-muted-foreground'
                    }`}>
                      {f.status.replace('_', ' ')}
                    </span>
                    {f.status !== 'submitted' && (
                      <button className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-primary" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Submission Log" subtitle="Historical filing submissions with acknowledgments" icon={<RefreshCw className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {submissionLog.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.filing}</p>
                  <p className="text-xs text-muted-foreground">Submitted: {s.submitted} · via {s.method} · Approved by {s.approvedBy}</p>
                </div>
                <span className="text-xs font-mono text-primary">{s.ack}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Filing Intelligence" subtitle="Compliance filing history and deadline analysis" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Filing Analytics" subtitle="Multi-year filing compliance performance" onExport={() => {}}>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "On-Time Rate", value: "96%" },
                { label: "Total Filed (3yr)", value: "28" },
                { label: "Avg Processing", value: "4.2 days" },
                { label: "API Submissions", value: "42%" },
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

export default GovernmentFiling;
