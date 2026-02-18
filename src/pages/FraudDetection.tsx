import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import {
  ShieldAlert, AlertTriangle, Eye, Fingerprint, Repeat, Split,
  TrendingUp, Activity, Lock, CheckCircle2, XCircle, Clock
} from "lucide-react";

const fraudAlerts = [
  { id: "FR001", type: "Duplicate Donation", entity: "Ramesh Kumar", detail: "₹50,000 donated twice in 2 hours", risk: 91, status: "open", time: "2h ago" },
  { id: "FR002", type: "Expense Split Detection", entity: "Office Supplies", detail: "3 bills of ₹9,800 from same vendor in 1 day", risk: 78, status: "open", time: "4h ago" },
  { id: "FR003", type: "High-Frequency Transactions", entity: "Operator: Suresh", detail: "48 entries in 2 hours — avg. 2.5 min/entry", risk: 67, status: "reviewing", time: "Yesterday" },
  { id: "FR004", type: "Suspicious Large Donation", entity: "Anonymous Corp", detail: "₹25L single donation with no PAN", risk: 85, status: "escalated", time: "2 days ago" },
  { id: "FR005", type: "Role Abuse Pattern", entity: "Operator: Pooja", detail: "Accessed 7 modules outside role scope", risk: 55, status: "resolved", time: "3 days ago" },
];

const riskScores = [
  { entity: "Donation Module", score: 23, trend: "down" },
  { entity: "Expense Module", score: 41, trend: "up" },
  { entity: "Compliance Module", score: 12, trend: "stable" },
  { entity: "User Activity", score: 38, trend: "up" },
];

const FraudDetection = () => {
  const statusColor: Record<string, string> = {
    open: "bg-coral/20 text-coral",
    reviewing: "bg-warning/20 text-warning",
    escalated: "bg-red-500/20 text-red-400",
    resolved: "bg-success/20 text-success",
  };

  const riskColor = (score: number) => {
    if (score >= 80) return "text-coral";
    if (score >= 60) return "text-warning";
    if (score >= 40) return "text-amber-400";
    return "text-success";
  };

  const riskBg = (score: number) => {
    if (score >= 80) return "bg-coral";
    if (score >= 60) return "bg-warning";
    if (score >= 40) return "bg-amber-400";
    return "bg-success";
  };

  return (
    <MainLayout title="Fraud & Risk Detection" subtitle="AI-powered anomaly detection, duplicate flagging and risk scoring">
      <div className="space-y-8">

        {/* MACRO */}
        <DashboardSection level="macro" title="Risk Engine Overview" subtitle="Real-time fraud detection across all modules"
          icon={<ShieldAlert className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Active Alerts" value={4} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="2 critical" trend="down" />
            <StatCard3D title="Duplicate Detected" value={3} icon={<Repeat className="w-6 h-6 text-white" />} iconBg="warning" change="This month" trend="down" />
            <StatCard3D title="Risk Score (Org)" value={38} suffix="/100" icon={<Activity className="w-6 h-6 text-white" />} iconBg="primary" change="Moderate" trend="up" />
            <StatCard3D title="Resolved This Month" value={12} icon={<CheckCircle2 className="w-6 h-6 text-white" />} iconBg="success" change="94% resolution rate" trend="up" />
          </div>
        </DashboardSection>

        {/* MICRO — Alert Register */}
        <DashboardSection level="micro" title="Fraud Alert Register" subtitle="Active anomalies requiring review or action"
          icon={<Eye className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center ${alert.risk >= 80 ? 'bg-coral/20' : alert.risk >= 60 ? 'bg-warning/20' : 'bg-amber-400/20'}`}>
                    <span className={`text-sm font-bold ${riskColor(alert.risk)}`}>{alert.risk}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">{alert.id}</span>
                      <span className="text-sm font-medium text-foreground">{alert.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.entity}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.detail}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[alert.status]}`}>{alert.status}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* NANO — Module Risk Scores */}
        <DashboardSection level="nano" title="Module Risk Scoring" subtitle="Entity-level risk heat map"
          icon={<Fingerprint className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {riskScores.map((r) => (
              <div key={r.entity} className="p-4 rounded-xl bg-secondary/40 text-center">
                <p className={`text-2xl font-bold ${riskColor(r.score)}`}>{r.score}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.entity}</p>
                <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${riskBg(r.score)}`} style={{ width: `${r.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Detection patterns */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Repeat, label: "Duplicate Detection", desc: "Compares amount + donor + date window (±24h)", active: true },
              { icon: Split, label: "Expense Split Logic", desc: "Same vendor, similar amount, within 3 days", active: true },
              { icon: TrendingUp, label: "Velocity Monitoring", desc: "High-freq entry flagged if >20/hr per operator", active: true },
            ].map((p) => (
              <div key={p.label} className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <p.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* DEEP — Risk Intelligence */}
        <DashboardSection level="deep" title="Risk Intelligence Analysis" subtitle="Immutable hash registry and tamper detection"
          icon={<Lock className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Document Hash & Tamper Protection" subtitle="Verify record integrity across all financial entries" onExport={() => {}}>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Records Hashed", value: "14,832" },
                  { label: "Tamper Attempts", value: "0" },
                  { label: "Hash Mismatches", value: "0" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { entity: "Donation DON-2024-001847", hash: "sha256:a3f9...c821", verified: true },
                  { entity: "Expense EXP-2024-003291", hash: "sha256:b71d...f4a2", verified: true },
                  { entity: "Receipt RCP-2024-000982", hash: "sha256:c55e...9d73", verified: true },
                ].map((rec) => (
                  <div key={rec.entity} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="text-sm text-foreground">{rec.entity}</p>
                      <p className="text-xs text-muted-foreground font-mono">{rec.hash}</p>
                    </div>
                    {rec.verified
                      ? <CheckCircle2 className="w-4 h-4 text-success" />
                      : <XCircle className="w-4 h-4 text-coral" />}
                  </div>
                ))}
              </div>
            </div>
          </DeepResearchView>
        </DashboardSection>

      </div>
    </MainLayout>
  );
};

export default FraudDetection;
