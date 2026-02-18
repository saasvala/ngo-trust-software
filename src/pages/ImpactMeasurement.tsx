import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Users, Target, TrendingUp, Award, Heart, Download, FileText } from "lucide-react";

const projectImpact = [
  { project: "Women Empowerment", beneficiaries: 4200, cost: 1200000, outcome: 88, indicator: "Employment placement rate" },
  { project: "Child Education", beneficiaries: 8700, cost: 800000, outcome: 92, indicator: "School attendance rate" },
  { project: "Clean Water Initiative", beneficiaries: 12500, cost: 500000, outcome: 96, indicator: "Safe water access" },
  { project: "Rural Health", beneficiaries: 6800, cost: 650000, outcome: 79, indicator: "Health outcome improvement" },
];

const ImpactMeasurement = () => {
  const totalBeneficiaries = projectImpact.reduce((s, p) => s + p.beneficiaries, 0);
  const totalCost = projectImpact.reduce((s, p) => s + p.cost, 0);
  const costPerBeneficiary = Math.round(totalCost / totalBeneficiaries);
  const avgOutcome = Math.round(projectImpact.reduce((s, p) => s + p.outcome, 0) / projectImpact.length);

  return (
    <MainLayout title="Impact Measurement" subtitle="Beneficiary scoring, cost-per-beneficiary, and annual impact reports">
      <div className="space-y-8">

        {/* MACRO */}
        <DashboardSection level="macro" title="Impact Overview" subtitle="Organization-wide impact metrics this fiscal year"
          icon={<Heart className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Beneficiaries" value={totalBeneficiaries} icon={<Users className="w-6 h-6 text-white" />} iconBg="primary" change="+18.3% vs last FY" trend="up" />
            <StatCard3D title="Cost Per Beneficiary" value={costPerBeneficiary} prefix="₹" icon={<Target className="w-6 h-6 text-white" />} iconBg="teal" change="-6% efficiency gain" trend="up" />
            <StatCard3D title="Avg Outcome Score" value={avgOutcome} suffix="%" icon={<Award className="w-6 h-6 text-white" />} iconBg="success" change="Excellent" trend="up" />
            <StatCard3D title="Active Projects" value={projectImpact.length} icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="coral" change="All on track" trend="up" />
          </div>
        </DashboardSection>

        {/* MICRO — Project Impact Cards */}
        <DashboardSection level="micro" title="Project Impact Breakdown" subtitle="Outcome indicators and cost efficiency per project"
          icon={<Target className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-4">
            {projectImpact.map((p) => {
              const cpb = Math.round(p.cost / p.beneficiaries);
              return (
                <div key={p.project} className="p-5 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{p.project}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Indicator: {p.indicator}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">{p.outcome}%</p>
                      <p className="text-xs text-muted-foreground">Outcome Score</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="p-3 rounded-lg bg-secondary/60 text-center">
                      <p className="text-lg font-bold text-foreground">{p.beneficiaries.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Beneficiaries</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/60 text-center">
                      <p className="text-lg font-bold text-foreground">₹{cpb.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Cost/Beneficiary</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/60 text-center">
                      <p className="text-lg font-bold text-foreground">₹{(p.cost / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-muted-foreground">Total Invested</p>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-teal rounded-full transition-all duration-700" style={{ width: `${p.outcome}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSection>

        {/* NANO — Fund vs Impact Comparison */}
        <DashboardSection level="nano" title="Fund vs Impact Comparison" subtitle="Where every rupee creates the most impact"
          icon={<Award className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {projectImpact
              .sort((a, b) => (a.cost / a.beneficiaries) - (b.cost / b.beneficiaries))
              .map((p, i) => (
                <div key={p.project} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-success text-white' : 'bg-secondary text-muted-foreground'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{p.project}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground">₹{Math.round(p.cost / p.beneficiaries).toLocaleString()}/person</p>
                </div>
              ))}
          </div>
        </DashboardSection>

        {/* DEEP — Annual Impact Report */}
        <DashboardSection level="deep" title="Annual Impact Report" subtitle="Downloadable impact summary for board and donors"
          icon={<FileText className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Impact Report Export" subtitle="FY 2024–25 complete impact analysis" onExport={() => {}}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Lives Impacted", value: totalBeneficiaries.toLocaleString() },
                  { label: "Avg Cost/Person", value: `₹${costPerBeneficiary.toLocaleString()}` },
                  { label: "Avg Outcome", value: `${avgOutcome}%` },
                  { label: "Projects Active", value: projectImpact.length },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <FileText className="w-4 h-4" /> Share with Board
                </button>
              </div>
            </div>
          </DeepResearchView>
        </DashboardSection>

      </div>
    </MainLayout>
  );
};

export default ImpactMeasurement;
