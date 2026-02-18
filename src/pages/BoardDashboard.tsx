import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import {
  Briefcase, TrendingUp, Shield, Users, AlertTriangle,
  FileText, Download, CheckCircle2, Lock
} from "lucide-react";

const BoardDashboard = () => {
  return (
    <MainLayout title="Board & Trustee Dashboard" subtitle="Executive-level read-only overview — secure board mode">
      <div className="space-y-8">

        {/* Board Notice Banner */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <Lock className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground">
            <strong>Secure Board View</strong> — Read-only mode. No data modification permitted. All views are board-approved aggregates only.
          </p>
        </div>

        {/* MACRO — Executive Summary */}
        <DashboardSection level="macro" title="Executive Summary" subtitle="Fiscal Year 2024–25 at a glance"
          icon={<Briefcase className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Funds Raised" value={15200000} prefix="₹" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="success" change="+22% vs last FY" trend="up" />
            <StatCard3D title="Fund Utilization" value={79} suffix="%" icon={<CheckCircle2 className="w-6 h-6 text-white" />} iconBg="primary" change="Target: 85%" trend="up" />
            <StatCard3D title="Beneficiaries Served" value={32200} icon={<Users className="w-6 h-6 text-white" />} iconBg="teal" change="+18% YoY" trend="up" />
            <StatCard3D title="Compliance Score" value={94} suffix="%" icon={<Shield className="w-6 h-6 text-white" />} iconBg="success" change="Excellent" trend="up" />
          </div>
        </DashboardSection>

        {/* MICRO — Financial Overview */}
        <DashboardSection level="micro" title="Financial Overview" subtitle="Income, expenditure and reserves"
          icon={<TrendingUp className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-5 rounded-xl bg-success/10 border border-success/20">
              <p className="text-xs text-muted-foreground mb-1">Total Receipts</p>
              <p className="text-2xl font-bold text-success">₹1.52 Cr</p>
              <p className="text-xs text-muted-foreground mt-1">Donations + Grants + CSR</p>
            </div>
            <div className="p-5 rounded-xl bg-coral/10 border border-coral/20">
              <p className="text-xs text-muted-foreground mb-1">Total Expenditure</p>
              <p className="text-2xl font-bold text-coral">₹1.09 Cr</p>
              <p className="text-xs text-muted-foreground mt-1">Programs + Admin + Ops</p>
            </div>
            <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Net Reserve</p>
              <p className="text-2xl font-bold text-primary">₹43.2 L</p>
              <p className="text-xs text-muted-foreground mt-1">Available for next FY</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Program Expenses", value: 72, amount: "₹78.5L" },
              { label: "Administration", value: 11, amount: "₹12.1L" },
              { label: "Fundraising", value: 8, amount: "₹8.7L" },
              { label: "Capacity Building", value: 9, amount: "₹9.7L" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-36">{item.label}</span>
                <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-teal rounded-full" style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-xs font-medium text-foreground w-14 text-right">{item.amount}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* NANO — Risk & Compliance Status */}
        <DashboardSection level="nano" title="Risk & Compliance Status" subtitle="Board-level risk snapshot"
          icon={<AlertTriangle className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { label: "Overall Risk", value: "Low", color: "text-success" },
              { label: "Open Audits", value: "0", color: "text-success" },
              { label: "Expiring Certs", value: "2", color: "text-warning" },
              { label: "Pending Filings", value: "1", color: "text-warning" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-secondary/40 text-center">
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { filing: "12A Registration", status: "Valid till Mar 2027", ok: true },
              { filing: "80G Certificate", status: "Valid till Dec 2025", ok: true },
              { filing: "FCRA Renewal", status: "Due in 4 months", ok: false },
              { filing: "Annual Audit", status: "Completed FY 2023–24", ok: true },
            ].map((f) => (
              <div key={f.filing} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2">
                  {f.ok ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}
                  <span className="text-sm text-foreground">{f.filing}</span>
                </div>
                <span className="text-xs text-muted-foreground">{f.status}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* DEEP — Impact Snapshot + Export */}
        <DashboardSection level="deep" title="Impact Snapshot" subtitle="Board-ready export options"
          icon={<FileText className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Board Report Generator" subtitle="Export board-ready PDF and consolidated summary" onExport={() => {}}>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Lives Impacted", value: "32,200" },
                  { label: "Projects Completed", value: "8" },
                  { label: "Donor Retention", value: "74%" },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Download className="w-4 h-4" /> Export Board PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <FileText className="w-4 h-4" /> Annual Report
                </button>
              </div>
            </div>
          </DeepResearchView>
        </DashboardSection>

      </div>
    </MainLayout>
  );
};

export default BoardDashboard;
