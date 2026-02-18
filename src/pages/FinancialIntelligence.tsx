import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import {
  TrendingUp, TrendingDown, DollarSign, Activity, BarChart3,
  Zap, Target, AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Flame, Droplets, Brain, LineChart
} from "lucide-react";

const burnRateData = [
  { project: "Women Empowerment", budget: 1200000, spent: 876000, burn: 92000, months: 3.6 },
  { project: "Child Education", budget: 800000, spent: 420000, burn: 52000, months: 7.3 },
  { project: "Clean Water Initiative", budget: 500000, spent: 211000, burn: 28000, months: 10.3 },
  { project: "Rural Health", budget: 650000, spent: 540000, burn: 71000, months: 1.5 },
];

const cashFlowData = [
  { month: "Sep", inflow: 2100000, outflow: 1450000 },
  { month: "Oct", inflow: 1850000, outflow: 1620000 },
  { month: "Nov", inflow: 2400000, outflow: 1780000 },
  { month: "Dec", inflow: 3100000, outflow: 2100000 },
  { month: "Jan", inflow: 2750000, outflow: 1920000 },
  { month: "Feb", inflow: 2980000, outflow: 2050000 },
];

const projectionData = [
  { period: "Next 3 Months", scenario: "optimistic", value: 8400000, confidence: 82 },
  { period: "Next 6 Months", scenario: "expected", value: 15200000, confidence: 71 },
  { period: "Next 12 Months", scenario: "conservative", value: 26800000, confidence: 58 },
];

const FinancialIntelligence = () => {
  const { formatCurrency } = useRules();

  const maxInflow = Math.max(...cashFlowData.map(d => d.inflow));

  return (
    <MainLayout title="Financial Intelligence" subtitle="AI-powered cash flow, burn rate, projection & health scoring">
      <div className="space-y-8">

        {/* MACRO — KPI Summary */}
        <DashboardSection level="macro" title="Financial Health Overview" subtitle="Real-time financial intelligence dashboard"
          icon={<Brain className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Financial Health Score" value={84} suffix="/100" icon={<Activity className="w-6 h-6 text-white" />} iconBg="success" change="AI-derived · Healthy" trend="up" />
            <StatCard3D title="Cash on Hand" value={4820000} prefix="₹" icon={<DollarSign className="w-6 h-6 text-white" />} iconBg="primary" change="+12.4% vs last month" trend="up" />
            <StatCard3D title="Donation Velocity" value={2980000} prefix="₹" icon={<Zap className="w-6 h-6 text-white" />} iconBg="teal" change="This month" trend="up" suffix="/mo" />
            <StatCard3D title="Avg Burn Rate" value={61000} prefix="₹" icon={<Flame className="w-6 h-6 text-white" />} iconBg="coral" change="-8% vs last quarter" trend="up" suffix="/mo" />
          </div>
        </DashboardSection>

        {/* MICRO — Cash Flow + Burn Rate */}
        <DashboardSection level="micro" title="Cash Flow Tracker" subtitle="Monthly inflow vs outflow analysis"
          icon={<BarChart3 className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                <p className="text-xs text-muted-foreground">Total Inflow (6M)</p>
                <p className="text-xl font-bold text-success">₹1.52 Cr</p>
              </div>
              <div className="p-4 rounded-xl bg-coral/10 border border-coral/20">
                <p className="text-xs text-muted-foreground">Total Outflow (6M)</p>
                <p className="text-xl font-bold text-coral">₹1.09 Cr</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-xs text-muted-foreground">Net Surplus (6M)</p>
                <p className="text-xl font-bold text-primary">₹43.2 L</p>
              </div>
            </div>
            {cashFlowData.map((d) => (
              <div key={d.month} className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{d.month} 2024</span>
                  <span className={`text-xs font-medium ${d.inflow > d.outflow ? 'text-success' : 'text-coral'}`}>
                    {d.inflow > d.outflow ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                    {' '}Net: ₹{((d.inflow - d.outflow) / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-14">Inflow</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full transition-all duration-700" style={{ width: `${(d.inflow / maxInflow) * 100}%` }} />
                    </div>
                    <span className="text-xs text-foreground w-20 text-right">₹{(d.inflow / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-14">Outflow</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-coral rounded-full transition-all duration-700" style={{ width: `${(d.outflow / maxInflow) * 100}%` }} />
                    </div>
                    <span className="text-xs text-foreground w-20 text-right">₹{(d.outflow / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* NANO — Project Burn Rate */}
        <DashboardSection level="nano" title="Project Burn Rate Calculator" subtitle="Estimated months of runway per project"
          icon={<Flame className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {burnRateData.map((p) => {
              const utilPct = Math.round((p.spent / p.budget) * 100);
              const critical = p.months < 2;
              return (
                <div key={p.project} className={`p-4 rounded-xl ${critical ? 'bg-coral/10 border border-coral/20' : 'bg-secondary/40'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.project}</p>
                      <p className="text-xs text-muted-foreground">₹{(p.burn / 1000).toFixed(0)}K/mo burn · {utilPct}% utilized</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${critical ? 'text-coral' : p.months < 4 ? 'text-warning' : 'text-success'}`}>{p.months.toFixed(1)} mo</p>
                      <p className="text-xs text-muted-foreground">runway left</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${utilPct > 90 ? 'bg-coral' : utilPct > 70 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${utilPct}%` }} />
                  </div>
                  {critical && <p className="text-xs text-coral mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Critical: Budget depleting soon</p>}
                </div>
              );
            })}
          </div>
        </DashboardSection>

        {/* NANO — Funding Projections */}
        <DashboardSection level="nano" title="3/6/12 Month Funding Projections" subtitle="AI-powered donation velocity forecast"
          icon={<LineChart className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projectionData.map((p) => (
              <div key={p.period} className="p-5 rounded-xl bg-secondary/40 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">{p.period}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.scenario === 'optimistic' ? 'bg-success/20 text-success' : p.scenario === 'expected' ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'}`}>
                    {p.scenario}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">₹{(p.value / 100000).toFixed(1)}L</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">AI Confidence</span>
                    <span className="text-xs font-medium text-foreground">{p.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${p.confidence}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              AI projection based on 18-month historical trend, seasonal patterns, and donor retention rate of 74%.
            </p>
          </div>
        </DashboardSection>

        {/* DEEP — Utilization Efficiency + Surplus Forecast */}
        <DashboardSection level="deep" title="Financial Intelligence Deep Dive" subtitle="Efficiency scoring and surplus/deficit forecasting"
          icon={<Target className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Utilization Efficiency & Surplus Forecast" subtitle="CFO-grade financial analysis" onExport={() => {}}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Utilization Efficiency", value: "79.2%", status: "ok" },
                  { label: "Admin Cost Ratio", value: "10.8%", status: "ok" },
                  { label: "Surplus This FY", value: "₹43.2L", status: "ok" },
                  { label: "Deficit Risk Q4", value: "Low", status: "ok" },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                    <CheckCircle2 className="w-4 h-4 text-success mx-auto mb-1" />
                    <p className="text-xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-secondary/30">
                <p className="text-sm font-medium text-foreground mb-2">AI Financial Health Breakdown</p>
                {[
                  { factor: "Donation Consistency", score: 88 },
                  { factor: "Expense Control", score: 82 },
                  { factor: "Compliance Status", score: 94 },
                  { factor: "Project Utilization", score: 76 },
                  { factor: "Reserve Adequacy", score: 71 },
                ].map((f) => (
                  <div key={f.factor} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-muted-foreground w-36">{f.factor}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-teal rounded-full" style={{ width: `${f.score}%` }} />
                    </div>
                    <span className="text-xs font-medium text-foreground w-8">{f.score}</span>
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

export default FinancialIntelligence;
