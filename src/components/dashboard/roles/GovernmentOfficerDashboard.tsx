import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import {
  Landmark,
  Shield,
  FileCheck,
  Eye,
  Lock,
  AlertTriangle,
  TrendingUp,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const GovernmentOfficerDashboard = () => {
  const { location, formatCurrency } = useRules();

  const ngoComplianceOverview = [
    { name: "Hope Foundation", reg12A: "Valid", reg80G: "Valid", fcra: "Valid", filingStatus: "Up to date", riskScore: 12 },
    { name: "Rural Aid Society", reg12A: "Valid", reg80G: "Expiring", fcra: "N/A", filingStatus: "1 overdue", riskScore: 38 },
    { name: "Green Earth Trust", reg12A: "Valid", reg80G: "Valid", fcra: "Expired", filingStatus: "Up to date", riskScore: 45 },
    { name: "Children First NGO", reg12A: "Under Review", reg80G: "Valid", fcra: "Valid", filingStatus: "Up to date", riskScore: 22 },
  ];

  const sectorUtilization = [
    { sector: "Education", allocated: 12000000, utilized: 9800000, ngos: 4 },
    { sector: "Healthcare", allocated: 8500000, utilized: 7200000, ngos: 3 },
    { sector: "Rural Development", allocated: 15000000, utilized: 11500000, ngos: 6 },
    { sector: "Environment", allocated: 5000000, utilized: 4100000, ngos: 2 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <Lock className="w-5 h-5 text-primary" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Government Officer View</span> — Read-only regulatory oversight of registered NGOs and compliance status
        </p>
      </div>

      {/* MACRO */}
      <DashboardSection
        level="macro"
        title="Regulatory Overview"
        subtitle="NGO compliance and fund utilization across jurisdiction"
        icon={<Landmark className="w-6 h-6 text-white" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D title="Registered NGOs" value={47} icon={<Landmark className="w-6 h-6 text-white" />} iconBg="teal" change="In jurisdiction" trend="up" />
          <StatCard3D title="Compliant" value={41} suffix="/47" icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change="87.2% compliance" trend="up" />
          <StatCard3D title="Funds Disbursed" value="₹40.5Cr" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="warning" change="This FY" trend="up" />
          <StatCard3D title="Risk Flags" value={6} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="2 critical" trend="neutral" />
        </div>
      </DashboardSection>

      {/* MICRO */}
      <DashboardSection
        level="micro"
        title="NGO Compliance Matrix"
        subtitle="Registration and filing status per NGO"
        icon={<Shield className="w-5 h-5 text-primary" />}
        defaultExpanded={true}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">NGO Name</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">12A</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">80G</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">FCRA</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Filing</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {ngoComplianceOverview.map((ngo) => (
                <tr key={ngo.name} className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium text-foreground">{ngo.name}</td>
                  {[ngo.reg12A, ngo.reg80G, ngo.fcra].map((s, i) => (
                    <td key={i} className="py-2 px-3">
                      <Badge variant={s === "Valid" ? "default" : s === "N/A" ? "outline" : "destructive"}>{s}</Badge>
                    </td>
                  ))}
                  <td className="py-2 px-3">
                    <Badge variant={ngo.filingStatus === "Up to date" ? "default" : "destructive"}>{ngo.filingStatus}</Badge>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className={`font-mono font-medium ${ngo.riskScore > 30 ? "text-coral" : ngo.riskScore > 20 ? "text-warning" : "text-success"}`}>
                      {ngo.riskScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* NANO */}
      <DashboardSection
        level="nano"
        title="Sector-wise Fund Utilization"
        subtitle="Government fund allocation and NGO utilization rates"
        icon={<BarChart3 className="w-5 h-5 text-teal" />}
        defaultExpanded={false}
      >
        <div className="space-y-4">
          {sectorUtilization.map((s) => {
            const pct = Math.round((s.utilized / s.allocated) * 100);
            return (
              <div key={s.sector} className="p-4 rounded-xl border border-border bg-secondary/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{s.sector}</p>
                    <p className="text-xs text-muted-foreground">{s.ngos} NGOs</p>
                  </div>
                  <span className={`text-sm font-semibold ${pct >= 80 ? "text-success" : pct >= 60 ? "text-warning" : "text-coral"}`}>{pct}%</span>
                </div>
                <Progress value={pct} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Allocated: {formatCurrency(s.allocated)}</span>
                  <span>Utilized: {formatCurrency(s.utilized)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </DashboardSection>

      {/* DEEP */}
      <DashboardSection
        level="deep"
        title="Regulatory Filings & Trend Analysis"
        subtitle="Historical compliance data and deviation patterns"
        icon={<FileText className="w-5 h-5 text-coral" />}
        defaultExpanded={false}
      >
        <DeepResearchView title="Compliance Trend Analysis" subtitle="Year-over-year regulatory compliance rates" onExport={() => console.log("Export gov data")}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "3-Year Compliance Avg", value: "89.4%" },
                { label: "UC Submission Rate", value: "94.1%" },
                { label: "NGOs Under Scrutiny", value: "3" },
              ].map((i) => (
                <div key={i.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-bold text-foreground">{i.value}</p>
                  <p className="text-xs text-muted-foreground">{i.label}</p>
                </div>
              ))}
            </div>
          </div>
        </DeepResearchView>
      </DashboardSection>
    </div>
  );
};
