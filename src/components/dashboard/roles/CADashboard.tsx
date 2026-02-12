import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import {
  FileCheck,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Eye,
  Lock,
  Receipt,
  IndianRupee,
  Users,
  Calendar,
  Download,
  Search,
  BadgeCheck,
  Scale,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const CADashboard = () => {
  const { location, getAuditorName, formatCurrency } = useRules();
  const auditorTitle = getAuditorName();

  const receiptAuditData = [
    { id: "RCP-2025-001", donor: "Rajesh Sharma", amount: 500000, pan: "ABCPS1234K", date: "10 Jan 2025", status: "verified", section: "80G" },
    { id: "RCP-2025-002", donor: "Priya Industries Ltd", amount: 2500000, pan: "AADCP5678L", date: "15 Jan 2025", status: "verified", section: "80G(5)(vi)" },
    { id: "RCP-2025-003", donor: "Ankit Gupta", amount: 100000, pan: "BGHPG9012M", date: "22 Jan 2025", status: "pending", section: "80G" },
    { id: "RCP-2025-004", donor: "Global CSR Foundation", amount: 5000000, pan: "AABCG3456N", date: "28 Jan 2025", status: "flagged", section: "CSR" },
    { id: "RCP-2025-005", donor: "Meena Devi", amount: 25000, pan: "—", date: "02 Feb 2025", status: "flagged", section: "80G" },
  ];

  const complianceCertificates = [
    { name: "12A Registration", number: "12A/2023/78901", validTill: "31 Mar 2028", status: "valid", daysLeft: 1120 },
    { name: "80G Certificate", number: "80G/2023/45678", validTill: "14 May 2026", status: "expiring", daysLeft: 98 },
    { name: "FCRA Registration", number: "FCRA/2022/11234", validTill: "30 Sep 2027", status: "valid", daysLeft: 940 },
    { name: "CSR-1 Filing", number: "CSR1/2024/56789", validTill: "31 Mar 2025", status: "urgent", daysLeft: 15 },
  ];

  const taxDeductionSummary = [
    { section: "80G (50% Deduction)", receipts: 142, amount: 18500000, eligible: 9250000 },
    { section: "80G (100% Deduction)", receipts: 28, amount: 4200000, eligible: 4200000 },
    { section: "35AC (Infrastructure)", receipts: 5, amount: 7500000, eligible: 7500000 },
    { section: "CSR Contributions", receipts: 12, amount: 15000000, eligible: 0 },
  ];

  const anomalies = [
    { id: "ANM-01", type: "Missing PAN", desc: "5 donations above ₹50,000 without PAN on file", severity: "high", impact: "80G receipts cannot be issued" },
    { id: "ANM-02", type: "Duplicate Receipt", desc: "Receipt RCP-2024-891 issued twice for same transaction", severity: "high", impact: "Tax fraud risk" },
    { id: "ANM-03", type: "Cash Limit Exceeded", desc: "₹12,000 cash donation exceeds ₹2,000 limit for 80G", severity: "medium", impact: "Ineligible for 80G deduction" },
    { id: "ANM-04", type: "Late Filing", desc: "Form 10BD not submitted for Q3 FY2024-25", severity: "medium", impact: "Penalty under section 234G" },
    { id: "ANM-05", type: "Mismatch", desc: "Donation register total differs from bank statement by ₹45,200", severity: "low", impact: "Reconciliation required" },
  ];

  const quarterlyFilings = [
    { quarter: "Q1 (Apr-Jun)", form10BD: "Filed", form10BE: "Filed", dueDate: "31 Jul 2024", status: "done" },
    { quarter: "Q2 (Jul-Sep)", form10BD: "Filed", form10BE: "Filed", dueDate: "31 Oct 2024", status: "done" },
    { quarter: "Q3 (Oct-Dec)", form10BD: "Overdue", form10BE: "Pending", dueDate: "31 Jan 2025", status: "overdue" },
    { quarter: "Q4 (Jan-Mar)", form10BD: "—", form10BE: "—", dueDate: "31 May 2025", status: "upcoming" },
  ];

  return (
    <div className="space-y-8">
      {/* CA Read-only Notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <Scale className="w-5 h-5 text-primary" />
        <p className="text-sm text-foreground">
          <span className="font-medium">{auditorTitle} — 80G & Tax Compliance View</span> — Statutory audit access to all donation receipts, 80G certificates, and tax filing records
        </p>
      </div>

      {/* MACRO LEVEL - 80G Compliance Overview */}
      <DashboardSection
        level="macro"
        title="80G Compliance Dashboard"
        subtitle="Tax exemption certificate health and receipt audit status"
        icon={<Receipt className="w-6 h-6 text-white" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D
            title="80G Receipts Issued"
            value={187}
            icon={<Receipt className="w-6 h-6 text-white" />}
            iconBg="success"
            change="This FY"
            trend="up"
          />
          <StatCard3D
            title="Total Tax Benefit"
            value="₹2.09Cr"
            icon={<IndianRupee className="w-6 h-6 text-white" />}
            iconBg="teal"
            change="Eligible deductions"
            trend="up"
          />
          <StatCard3D
            title="PAN Compliance"
            value="97.3%"
            icon={<BadgeCheck className="w-6 h-6 text-white" />}
            iconBg="warning"
            change="5 missing PANs"
            trend="neutral"
          />
          <StatCard3D
            title="Anomalies Detected"
            value={5}
            icon={<AlertTriangle className="w-6 h-6 text-white" />}
            iconBg="coral"
            change="2 high severity"
            trend="down"
          />
        </div>
      </DashboardSection>

      {/* MICRO LEVEL - Certificate Status & Tax Deduction Summary */}
      <DashboardSection
        level="micro"
        title="Registration & Certificate Status"
        subtitle="Active compliance certificates and renewal timeline"
        icon={<Shield className="w-5 h-5 text-primary" />}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {complianceCertificates.map((cert) => (
            <div
              key={cert.name}
              className={`p-4 rounded-xl border ${
                cert.status === "valid"
                  ? "border-success/30 bg-success/5"
                  : cert.status === "expiring"
                  ? "border-warning/30 bg-warning/5"
                  : "border-coral/30 bg-coral/5"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{cert.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{cert.number}</p>
                </div>
                <Badge variant={cert.status === "valid" ? "default" : cert.status === "expiring" ? "secondary" : "destructive"}>
                  {cert.status === "valid" ? "Active" : cert.status === "expiring" ? `${cert.daysLeft}d left` : `${cert.daysLeft}d URGENT`}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Valid till: {cert.validTill}</p>
              <Progress value={Math.min((cert.daysLeft / 1200) * 100, 100)} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>

        <h4 className="font-semibold text-foreground mb-3">Tax Deduction Summary (FY 2024-25)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Section</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Receipts</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Total Amount</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Eligible Deduction</th>
              </tr>
            </thead>
            <tbody>
              {taxDeductionSummary.map((row) => (
                <tr key={row.section} className="border-b border-border/50">
                  <td className="py-2 px-3 text-foreground">{row.section}</td>
                  <td className="py-2 px-3 text-right text-foreground">{row.receipts}</td>
                  <td className="py-2 px-3 text-right text-foreground font-mono">{formatCurrency(row.amount)}</td>
                  <td className="py-2 px-3 text-right text-foreground font-mono">{formatCurrency(row.eligible)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-primary/20">
                <td className="py-2 px-3 font-semibold text-foreground">Total</td>
                <td className="py-2 px-3 text-right font-semibold text-foreground">187</td>
                <td className="py-2 px-3 text-right font-semibold text-foreground font-mono">{formatCurrency(45200000)}</td>
                <td className="py-2 px-3 text-right font-semibold text-primary font-mono">{formatCurrency(20950000)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </DashboardSection>

      {/* NANO LEVEL - Receipt Audit & Anomaly Detection */}
      <DashboardSection
        level="nano"
        title="Receipt Audit & Anomaly Detection"
        subtitle="Individual receipt verification and flagged items"
        icon={<Search className="w-5 h-5 text-teal" />}
        defaultExpanded={false}
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Recent 80G Receipts</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Receipt #</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Donor</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">PAN</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Section</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {receiptAuditData.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-2 px-3 font-mono text-foreground">{r.id}</td>
                    <td className="py-2 px-3 text-foreground">{r.donor}</td>
                    <td className="py-2 px-3 font-mono text-muted-foreground">{r.pan}</td>
                    <td className="py-2 px-3 text-right font-mono text-foreground">{formatCurrency(r.amount)}</td>
                    <td className="py-2 px-3">
                      <Badge variant="outline">{r.section}</Badge>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant={r.status === "verified" ? "default" : r.status === "pending" ? "secondary" : "destructive"}>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="font-semibold text-foreground mt-6">Anomalies & Exceptions</h4>
          <div className="space-y-3">
            {anomalies.map((a) => (
              <div
                key={a.id}
                className={`p-4 rounded-xl border ${
                  a.severity === "high"
                    ? "border-coral/30 bg-coral/5"
                    : a.severity === "medium"
                    ? "border-warning/30 bg-warning/5"
                    : "border-border bg-secondary/30"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{a.id}</span>
                    <Badge variant={a.severity === "high" ? "destructive" : a.severity === "medium" ? "secondary" : "outline"}>
                      {a.severity}
                    </Badge>
                    <span className="text-sm font-medium text-primary">{a.type}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground">{a.desc}</p>
                <p className="text-xs text-muted-foreground mt-1">Impact: {a.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </DashboardSection>

      {/* DEEP RESEARCH - Filing Status & Historical Analysis */}
      <DashboardSection
        level="deep"
        title="Statutory Filings & Historical Analysis"
        subtitle="Form 10BD/10BE filing status and year-over-year trends"
        icon={<FileText className="w-5 h-5 text-coral" />}
        defaultExpanded={false}
      >
        <DeepResearchView
          title="Form 10BD / 10BE Filing Tracker"
          subtitle="Quarterly filing status for donation statements"
          onExport={() => console.log("Exporting filing data...")}
        >
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Quarter</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Form 10BD</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Form 10BE</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Due Date</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {quarterlyFilings.map((q) => (
                    <tr key={q.quarter} className="border-b border-border/50">
                      <td className="py-2 px-3 text-foreground font-medium">{q.quarter}</td>
                      <td className="py-2 px-3">
                        <Badge variant={q.form10BD === "Filed" ? "default" : q.form10BD === "Overdue" ? "destructive" : "outline"}>
                          {q.form10BD}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant={q.form10BE === "Filed" ? "default" : q.form10BE === "Pending" ? "secondary" : "outline"}>
                          {q.form10BE}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">{q.dueDate}</td>
                      <td className="py-2 px-3">
                        <Badge variant={q.status === "done" ? "default" : q.status === "overdue" ? "destructive" : "secondary"}>
                          {q.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">₹45.2Cr</p>
                <p className="text-xs text-muted-foreground">Total Donations (FY)</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-primary">₹20.9Cr</p>
                <p className="text-xs text-muted-foreground">Total 80G Eligible</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">97.3%</p>
                <p className="text-xs text-muted-foreground">PAN Compliance Rate</p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground">Year-over-Year Comparison</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "FY 2023-24", donations: "₹38.7Cr", receipts: 156, compliance: "95.1%" },
                { label: "FY 2024-25", donations: "₹45.2Cr", receipts: 187, compliance: "97.3%" },
              ].map((fy) => (
                <div key={fy.label} className="p-4 rounded-xl border border-border bg-secondary/20">
                  <p className="font-semibold text-foreground mb-2">{fy.label}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Donations</span><span className="text-foreground font-mono">{fy.donations}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">80G Receipts</span><span className="text-foreground">{fy.receipts}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">PAN Compliance</span><span className="text-foreground">{fy.compliance}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DeepResearchView>
      </DashboardSection>
    </div>
  );
};
