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
  Lock
} from "lucide-react";

export const AuditorDashboard = () => {
  const { location, getAuditorName } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";
  const auditorTitle = getAuditorName();

  const complianceItems = [
    { name: "12A Registration", status: "Verified", lastAudit: "Jan 2025" },
    { name: "80G Certificate", status: "Verified", lastAudit: "Jan 2025" },
    { name: "FCRA Compliance", status: "Review Needed", lastAudit: "Oct 2024" },
    { name: "Annual Returns", status: "Pending", lastAudit: "Mar 2024" },
  ];

  const exceptionReports = [
    { id: "EXC-001", type: "Large Donation", description: "Single donation > ₹10L without PAN", severity: "high" },
    { id: "EXC-002", type: "Expense Variance", description: "Travel expenses 25% over budget", severity: "medium" },
    { id: "EXC-003", type: "Missing Document", description: "Invoice missing for EXP-234", severity: "low" },
  ];

  return (
    <div className="space-y-8">
      {/* Read-only Notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <Lock className="w-5 h-5 text-primary" />
        <p className="text-sm text-foreground">
          <span className="font-medium">{auditorTitle} View</span> — Read-only access to all financial records and compliance documents
        </p>
      </div>

      {/* MACRO LEVEL - Compliance Overview */}
      <DashboardSection
        level="macro"
        title="Compliance Dashboard"
        subtitle="Overall compliance health and audit status"
        icon={<FileCheck className="w-6 h-6 text-white" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D
            title="Compliance Score"
            value={92}
            suffix="%"
            icon={<Shield className="w-6 h-6 text-white" />}
            iconBg="success"
            change="Good standing"
            trend="up"
          />
          <StatCard3D
            title="Pending Reviews"
            value={3}
            icon={<Eye className="w-6 h-6 text-white" />}
            iconBg="warning"
            change="2 urgent"
            trend="neutral"
          />
          <StatCard3D
            title="Exceptions Found"
            value={8}
            icon={<AlertTriangle className="w-6 h-6 text-white" />}
            iconBg="coral"
            change="3 resolved"
            trend="down"
          />
          <StatCard3D
            title="Documents Verified"
            value={247}
            icon={<FileText className="w-6 h-6 text-white" />}
            iconBg="teal"
            change="This FY"
            trend="up"
          />
        </div>
      </DashboardSection>

      {/* MICRO LEVEL - Compliance Status */}
      <DashboardSection
        level="micro"
        title="Compliance Verification Status"
        subtitle="Registration and certificate audit status"
        icon={<Shield className="w-5 h-5 text-primary" />}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceItems.map((item) => (
            <div
              key={item.name}
              className={`p-4 rounded-xl border ${
                item.status === "Verified"
                  ? "border-success/30 bg-success/5"
                  : item.status === "Review Needed"
                  ? "border-warning/30 bg-warning/5"
                  : "border-coral/30 bg-coral/5"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-foreground">{item.name}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "Verified"
                      ? "bg-success/20 text-success"
                      : item.status === "Review Needed"
                      ? "bg-warning/20 text-warning"
                      : "bg-coral/20 text-coral"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Last audit: {item.lastAudit}</p>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* NANO LEVEL - Exception Reports */}
      <DashboardSection
        level="nano"
        title="Exception Reports"
        subtitle="Anomalies and items requiring attention"
        icon={<AlertTriangle className="w-5 h-5 text-teal" />}
        defaultExpanded={false}
      >
        <div className="space-y-3">
          {exceptionReports.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border ${
                item.severity === "high"
                  ? "border-coral/30 bg-coral/5"
                  : item.severity === "medium"
                  ? "border-warning/30 bg-warning/5"
                  : "border-border bg-secondary/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{item.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        item.severity === "high"
                          ? "bg-coral/20 text-coral"
                          : item.severity === "medium"
                          ? "bg-warning/20 text-warning"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                  <p className="text-sm text-foreground mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* DEEP RESEARCH LEVEL */}
      <DashboardSection
        level="deep"
        title="Immutable Audit Trail"
        subtitle="Complete transaction history and verification"
        icon={<FileText className="w-5 h-5 text-coral" />}
        defaultExpanded={false}
      >
        <DeepResearchView
          title="Audit Log Analysis"
          subtitle="Comprehensive audit trail with filters"
          onExport={() => console.log("Exporting audit log...")}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Access immutable records of all financial transactions, user actions, and system events.
              All records are cryptographically signed and tamper-proof.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Transactions", value: "12,847" },
                { label: "Audit Entries", value: "45,231" },
                { label: "Verified Records", value: "100%" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </DeepResearchView>
      </DashboardSection>
    </div>
  );
};
