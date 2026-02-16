import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Calculator, TrendingUp, TrendingDown, Target, AlertTriangle, BarChart3, PieChart, ArrowUpDown } from "lucide-react";

const budgetItems = [
  { project: "Rural Education Program", allocated: 2500000, spent: 1850000, forecast: 2400000, variance: -4 },
  { project: "Women Empowerment", allocated: 1800000, spent: 1920000, forecast: 2100000, variance: 16.7 },
  { project: "Clean Water Initiative", allocated: 3200000, spent: 1600000, forecast: 3100000, variance: -3.1 },
  { project: "Healthcare Outreach", allocated: 1500000, spent: 900000, forecast: 1450000, variance: -3.3 },
  { project: "Skill Development", allocated: 800000, spent: 420000, forecast: 780000, variance: -2.5 },
];

const scenarios = [
  { label: "Best Case", donationGrowth: "+18%", expenseControl: "Within 95%", surplus: "₹12.4L", color: "text-success" },
  { label: "Expected", donationGrowth: "+8%", expenseControl: "Within 100%", surplus: "₹4.2L", color: "text-primary" },
  { label: "Risk Case", donationGrowth: "-5%", expenseControl: "105% overrun", surplus: "-₹8.1L", color: "text-coral" },
];

const BudgetPlanning = () => {
  return (
    <MainLayout title="Budget Planning & Forecast" subtitle="Annual budget planner, variance analysis and scenario simulation">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Budget Overview" subtitle="FY budget allocation and utilization summary" icon={<Calculator className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Budget" value={9800000} prefix="₹" icon={<Calculator className="w-6 h-6 text-white" />} iconBg="primary" change="FY 2025-26" trend="neutral" />
            <StatCard3D title="Spent YTD" value={6690000} prefix="₹" icon={<TrendingDown className="w-6 h-6 text-white" />} iconBg="teal" change="68.3% utilized" trend="neutral" />
            <StatCard3D title="Forecast Total" value={9830000} prefix="₹" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="warning" change="0.3% over budget" trend="down" />
            <StatCard3D title="Variance Alert" value={1} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="Women Empowerment +16.7%" trend="down" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Project Budget Tracker" subtitle="Allocated vs spent vs forecast per project" icon={<BarChart3 className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-4">
            {budgetItems.map((b) => {
              const utilPct = Math.round((b.spent / b.allocated) * 100);
              const isOver = b.variance > 10;
              return (
                <div key={b.project} className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{b.project}</p>
                      <p className="text-xs text-muted-foreground">
                        Allocated: ₹{(b.allocated / 100000).toFixed(1)}L · Spent: ₹{(b.spent / 100000).toFixed(1)}L · Forecast: ₹{(b.forecast / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isOver ? 'bg-coral/20 text-coral' : Math.abs(b.variance) < 5 ? 'bg-success/20 text-emerald-400' : 'bg-warning/20 text-warning'}`}>
                        {b.variance > 0 ? '+' : ''}{b.variance}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Utilization</span><span>{utilPct}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${utilPct > 100 ? 'bg-coral' : utilPct > 80 ? 'bg-warning' : 'bg-gradient-to-r from-primary to-teal'}`} style={{ width: `${Math.min(utilPct, 100)}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Scenario Simulation" subtitle="Best / Expected / Risk case projections" icon={<ArrowUpDown className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((s) => (
              <div key={s.label} className="p-5 rounded-xl bg-secondary/30 text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.label}</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Donation Growth</span><span className="text-foreground font-medium">{s.donationGrowth}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expense Control</span><span className="text-foreground font-medium">{s.expenseControl}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Net Surplus</span><span className={`font-bold ${s.color}`}>{s.surplus}</span></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Budget Intelligence" subtitle="Multi-year budget trends and deviation analysis" icon={<PieChart className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Budget Trend Analysis" subtitle="3-year budget performance comparison" onExport={() => {}}>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "FY 2023-24", value: "₹72L", sub: "92% utilized" },
                { label: "FY 2024-25", value: "₹85L", sub: "97% utilized" },
                { label: "FY 2025-26", value: "₹98L", sub: "68% YTD" },
                { label: "Avg Variance", value: "3.2%", sub: "Within tolerance" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-xs text-primary mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </DeepResearchView>
        </DashboardSection>
      </div>
    </MainLayout>
  );
};

export default BudgetPlanning;
