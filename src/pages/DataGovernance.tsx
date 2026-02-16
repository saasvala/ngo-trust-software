import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { ShieldCheck, Trash2, EyeOff, FileCheck, Clock, Activity, Archive, UserX } from "lucide-react";

const retentionPolicies = [
  { dataType: "Financial Records", retention: "Permanent", basis: "Statutory requirement", autoDelete: false },
  { dataType: "Donor PII", retention: "Active + 7 years", basis: "Tax compliance", autoDelete: true },
  { dataType: "Audit Logs", retention: "10 years", basis: "Compliance", autoDelete: false },
  { dataType: "Session Logs", retention: "90 days", basis: "Security policy", autoDelete: true },
  { dataType: "Temp Files / Exports", retention: "30 days", basis: "Operational", autoDelete: true },
];

const deletionRequests = [
  { id: "DEL-042", requestedBy: "Donor: Ramesh K.", type: "PII Deletion", status: "pending_review", date: "Feb 10, 2026" },
  { id: "DEL-041", requestedBy: "Donor: Priya S.", type: "Account Removal", status: "completed", date: "Jan 28, 2026" },
  { id: "DEL-039", requestedBy: "System", type: "Session Purge", status: "completed", date: "Jan 15, 2026" },
];

const consentLog = [
  { donor: "Anil Sharma", consent: "Data processing", given: "Aug 12, 2024", method: "Online form", status: "active" },
  { donor: "Meera Patel", consent: "Marketing emails", given: "Sep 5, 2024", method: "Online form", status: "withdrawn" },
  { donor: "Tata CSR Fund", consent: "Data sharing (reports)", given: "Oct 1, 2024", method: "Signed agreement", status: "active" },
];

const DataGovernance = () => {
  return (
    <MainLayout title="Data Governance" subtitle="Retention policies, deletion requests, consent management and anonymization">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Governance Overview" subtitle="Data lifecycle and privacy compliance metrics" icon={<ShieldCheck className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Retention Policies" value={5} icon={<FileCheck className="w-6 h-6 text-white" />} iconBg="primary" change="All enforced" trend="up" />
            <StatCard3D title="Pending Deletions" value={1} icon={<Trash2 className="w-6 h-6 text-white" />} iconBg="warning" change="Review required" trend="neutral" />
            <StatCard3D title="Active Consents" value={847} icon={<UserX className="w-6 h-6 text-white" />} iconBg="success" change="12 withdrawn" trend="up" />
            <StatCard3D title="Archived Records" value={2340} icon={<Archive className="w-6 h-6 text-white" />} iconBg="teal" change="FY 2022-23" trend="neutral" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Retention Policies" subtitle="Data retention rules by category" icon={<Clock className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {retentionPolicies.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">{r.dataType}</p>
                  <p className="text-xs text-muted-foreground">Retention: {r.retention} · Basis: {r.basis}</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.autoDelete && <span className="px-2 py-1 rounded-full text-xs bg-teal/20 text-teal">Auto-purge</span>}
                  <span className="px-2 py-1 rounded-full text-xs bg-success/20 text-emerald-400">enforced</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Deletion Requests" subtitle="GDPR-ready data deletion and anonymization queue" icon={<Trash2 className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <div className="space-y-3">
            {deletionRequests.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{d.id} — {d.type}</p>
                  <p className="text-xs text-muted-foreground">{d.requestedBy} · {d.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === 'completed' ? 'bg-success/20 text-emerald-400' : 'bg-warning/20 text-warning'}`}>
                  {d.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Consent Log" subtitle="Donor consent tracking for data processing" icon={<EyeOff className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {consentLog.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.donor}</p>
                  <p className="text-xs text-muted-foreground">{c.consent} · {c.method} · {c.given}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-success/20 text-emerald-400' : 'bg-coral/20 text-coral'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Governance Intelligence" subtitle="Privacy compliance scoring and audit readiness" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Privacy Compliance Score" subtitle="GDPR / DPDPA readiness assessment" onExport={() => {}}>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Overall Score", value: "92%" },
                { label: "Consents Valid", value: "98.6%" },
                { label: "Deletions SLA", value: "100%" },
                { label: "Data Breaches", value: "0" },
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

export default DataGovernance;
