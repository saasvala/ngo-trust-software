import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Building2, TrendingUp, Award, FileText, Download, CheckCircle2 } from "lucide-react";

const corporateDonors = [
  { name: "TechCorp India Pvt Ltd", amount: 2500000, project: "Child Education", utilization: 84, certIssued: true, csrFormat: "Schedule VII" },
  { name: "GreenBuild Solutions", amount: 1800000, project: "Clean Water Initiative", utilization: 91, certIssued: true, csrFormat: "Schedule VII" },
  { name: "MedPharm Ltd", amount: 1200000, project: "Rural Health", utilization: 76, certIssued: false, csrFormat: "CSR-2" },
  { name: "FinTrust Capital", amount: 900000, project: "Women Empowerment", utilization: 88, certIssued: true, csrFormat: "Schedule VII" },
];

const CSRReporting = () => {
  const totalCSR = corporateDonors.reduce((s, d) => s + d.amount, 0);
  const avgUtil = Math.round(corporateDonors.reduce((s, d) => s + d.utilization, 0) / corporateDonors.length);

  return (
    <MainLayout title="CSR & Corporate Reporting" subtitle="Corporate donor management, CSR compliance exports, and impact certificates">
      <div className="space-y-8">

        {/* MACRO */}
        <DashboardSection level="macro" title="CSR Overview" subtitle="Corporate social responsibility funding summary"
          icon={<Building2 className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total CSR Received" value={totalCSR} prefix="₹" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="success" change="+31% vs last FY" trend="up" />
            <StatCard3D title="Corporate Donors" value={corporateDonors.length} icon={<Building2 className="w-6 h-6 text-white" />} iconBg="primary" change="All active" trend="up" />
            <StatCard3D title="Avg Utilization" value={avgUtil} suffix="%" icon={<Award className="w-6 h-6 text-white" />} iconBg="teal" change="Above benchmark" trend="up" />
            <StatCard3D title="Certs Issued" value={3} icon={<CheckCircle2 className="w-6 h-6 text-white" />} iconBg="success" change="1 pending" trend="up" />
          </div>
        </DashboardSection>

        {/* MICRO — Corporate Donor Register */}
        <DashboardSection level="micro" title="Corporate Donor Register" subtitle="CSR compliance status per corporate donor"
          icon={<Building2 className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {corporateDonors.map((d) => (
              <div key={d.name} className="p-5 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">Project: {d.project} · Format: {d.csrFormat}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">₹{(d.amount / 100000).toFixed(1)}L</p>
                    {d.certIssued
                      ? <span className="text-xs text-success flex items-center justify-end gap-1"><CheckCircle2 className="w-3 h-3" />Cert Issued</span>
                      : <span className="text-xs text-warning">Cert Pending</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Utilization</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.utilization >= 85 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${d.utilization}%` }} />
                  </div>
                  <span className="text-xs font-medium text-foreground">{d.utilization}%</span>
                  <button className="text-xs px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors">Export CSR</button>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* DEEP */}
        <DashboardSection level="deep" title="CSR Impact Export" subtitle="Generate branded CSR utilization certificates"
          icon={<FileText className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="CSR Certificate & Report Generator" onExport={() => {}}>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total CSR Corpus", value: `₹${(totalCSR / 100000).toFixed(1)}L` },
                  { label: "Avg Utilization", value: `${avgUtil}%` },
                  { label: "Compliance Rate", value: "100%" },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Download className="w-4 h-4" /> Download CSR Bundle
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <FileText className="w-4 h-4" /> Schedule VI Compliance
                </button>
              </div>
            </div>
          </DeepResearchView>
        </DashboardSection>

      </div>
    </MainLayout>
  );
};

export default CSRReporting;
