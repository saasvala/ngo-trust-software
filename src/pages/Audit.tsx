import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { ClipboardList, Shield, AlertTriangle, CheckCircle, Clock, FileText, Hash, Search, Copy } from "lucide-react";

const auditItems = [
  { entity: "Donation #DN-1247", action: "Amount verified", user: "CA Mehta", time: "10 min ago", status: "passed" },
  { entity: "Expense #EX-892", action: "Receipt validated", user: "Auditor Singh", time: "1 hour ago", status: "passed" },
  { entity: "Project - Rural Ed", action: "UC review pending", user: "System", time: "3 hours ago", status: "pending" },
  { entity: "Donor PAN - ABCPD1234F", action: "Identity check flagged", user: "System", time: "5 hours ago", status: "flagged" },
  { entity: "Expense #EX-901", action: "Duplicate bill detected", user: "System", time: "6 hours ago", status: "flagged" },
  { entity: "Donation #DN-1245", action: "80G receipt hash verified", user: "System", time: "8 hours ago", status: "passed" },
];

const anomalies = [
  { type: "Duplicate Donation", entity: "DON-4815 & DON-4816", detail: "Same donor, same amount (₹25,000) within 2 hours", severity: "high", resolved: false },
  { type: "Expense Spike", entity: "Travel - Q4", detail: "248% increase vs Q3 average", severity: "medium", resolved: false },
  { type: "Cash Limit Breach", entity: "DON-4801", detail: "Cash donation ₹12,000 exceeds ₹2,000 limit (India)", severity: "high", resolved: true },
  { type: "Missing Receipt", entity: "EXP-887", detail: "Expense ₹8,400 without supporting document", severity: "medium", resolved: false },
  { type: "PAN Mismatch", entity: "Donor: Suresh M.", detail: "PAN on file doesn't match IT records format", severity: "low", resolved: true },
];

const hashEntries = [
  { record: "DON-4821", hash: "a3f8c2e1...9d4b", timestamp: "Feb 16, 2026 09:14 IST", verified: true },
  { record: "EXP-901", hash: "b7d1a5f3...2c8e", timestamp: "Feb 16, 2026 08:42 IST", verified: true },
  { record: "DON-4820", hash: "c9e2b4d6...1f7a", timestamp: "Feb 15, 2026 17:30 IST", verified: true },
  { record: "EXP-899", hash: "d4f6c8a2...3e5b", timestamp: "Feb 15, 2026 14:15 IST", verified: false },
];

const Audit = () => {
  return (
    <MainLayout title="Audit & Inspection" subtitle="Immutable audit trail, anomaly detection and compliance verification">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Audit Overview" subtitle="Current period audit metrics" icon={<ClipboardList className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Audits" value={156} icon={<ClipboardList className="w-6 h-6 text-white" />} iconBg="primary" change="This FY" trend="up" />
            <StatCard3D title="Passed" value={142} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change="91% pass rate" trend="up" />
            <StatCard3D title="Anomalies Detected" value={12} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="5 unresolved" trend="down" />
            <StatCard3D title="Risk Score" value={18} suffix="/100" icon={<Shield className="w-6 h-6 text-white" />} iconBg="success" change="Low risk" trend="up" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Audit Trail" subtitle="Immutable log of all audit actions" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
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

        <DashboardSection level="nano" title="Anomaly Detection" subtitle="Suspicious transactions and pattern violations" icon={<Search className="w-5 h-5 text-coral" />} defaultExpanded={true}>
          <div className="space-y-3">
            {anomalies.map((a, i) => (
              <div key={i} className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Copy className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium text-foreground text-sm">{a.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.severity === 'high' ? 'bg-coral/20 text-coral' : a.severity === 'medium' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                      {a.severity}
                    </span>
                    {a.resolved && <span className="px-2 py-0.5 rounded-full text-xs bg-success/20 text-emerald-400">resolved</span>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{a.entity} — {a.detail}</p>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Immutable Hash Verification" subtitle="Tamper-proof hash for financial records" icon={<Hash className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {hashEntries.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-medium text-foreground font-mono">{h.record}</p>
                  <p className="text-xs text-muted-foreground font-mono">{h.hash} · {h.timestamp}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${h.verified ? 'bg-success/20 text-emerald-400' : 'bg-coral/20 text-coral'}`}>
                  {h.verified ? 'verified' : 'mismatch'}
                </span>
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

        <DashboardSection level="deep" title="Audit Intelligence" subtitle="Historical analysis, exception detection and risk scoring" icon={<ClipboardList className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Exception & Risk Analysis" subtitle="AI-powered anomaly pattern recognition" onExport={() => {}}>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Records Scanned", value: "24,580" },
                { label: "Exceptions Found", value: "14" },
                { label: "Resolution Rate", value: "92%" },
                { label: "Audit Risk Score", value: "18/100" },
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
