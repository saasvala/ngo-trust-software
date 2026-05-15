import { useState, useEffect } from "react";
import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { MicroPanel } from "../layers/MicroPanel";
import { DeepResearchView } from "../layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import { StatCardSkeleton, TableSkeleton } from "@/components/ui/loading";
import { 
  Building2, 
  Users, 
  Heart, 
  FolderKanban,
  TrendingUp,
  FileCheck,
  Receipt,
  AlertCircle
} from "lucide-react";

export const NGOAdminDashboard = () => {
  const { formatCurrency, location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";

  return (
    <div className="space-y-8">
      {/* MACRO LEVEL - NGO Overview */}
      <DashboardSection
        level="macro"
        title="NGO Performance Dashboard"
        subtitle="Today's snapshot and key metrics"
        icon={<Building2 className="w-6 h-6 text-white" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D
            title="Total Donations"
            value={12400000}
            prefix={currencySymbol}
            icon={<Heart className="w-6 h-6 text-white" />}
            iconBg="primary"
            change="+18.2% vs last month"
            trend="up"
          />
          <StatCard3D
            title="Tax Deductible"
            value={9850000}
            prefix={currencySymbol}
            icon={<Receipt className="w-6 h-6 text-white" />}
            iconBg="teal"
            change="79.4% of total"
            trend="up"
          />
          <StatCard3D
            title="Active Donors"
            value={2847}
            icon={<Users className="w-6 h-6 text-white" />}
            iconBg="coral"
            change="+142 new this month"
            trend="up"
          />
          <StatCard3D
            title="Active Projects"
            value={12}
            icon={<FolderKanban className="w-6 h-6 text-white" />}
            iconBg="success"
            change="3 completing soon"
            trend="neutral"
          />
        </div>
      </DashboardSection>

      {/* MICRO LEVEL - Donation vs Utilization */}
      <DashboardSection
        level="micro"
        title="Donation vs Utilization"
        subtitle="Fund flow analysis this fiscal year"
        icon={<TrendingUp className="w-5 h-5 text-primary" />}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donation Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Donation Sources</h4>
            {[
              { source: "Individual Donors", amount: 7500000, percent: 60 },
              { source: "Corporate CSR", amount: 3100000, percent: 25 },
              { source: "Grants", amount: 1240000, percent: 10 },
              { source: "Government", amount: 560000, percent: 5 },
            ].map((item) => (
              <div key={item.source} className="p-4 rounded-xl bg-secondary/30">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">{item.source}</span>
                  <span className="text-sm font-medium text-foreground">
                    {currencySymbol}{(item.amount / 100000).toFixed(1)}L
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-coral rounded-full transition-all duration-1000"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Utilization by Project */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Project Utilization</h4>
            {[
              { project: "Education Initiative", utilized: 85, budget: 2500000 },
              { project: "Healthcare Camp", utilized: 72, budget: 1800000 },
              { project: "Rural Development", utilized: 45, budget: 3200000 },
              { project: "Women Empowerment", utilized: 90, budget: 1200000 },
            ].map((item) => (
              <div key={item.project} className="p-4 rounded-xl bg-secondary/30">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">{item.project}</span>
                  <span className="text-sm font-medium text-foreground">{item.utilized}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      item.utilized > 80 ? "bg-success" : item.utilized > 50 ? "bg-primary" : "bg-warning"
                    }`}
                    style={{ width: `${item.utilized}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardSection>

      {/* NANO LEVEL - Compliance Status */}
      <DashboardSection
        level="nano"
        title="Compliance Status"
        subtitle="Registration and certificate tracking"
        icon={<FileCheck className="w-5 h-5 text-teal" />}
        defaultExpanded={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "12A Registration", status: "Active", expiry: "Mar 2028", daysLeft: 1100 },
            { name: "80G Certificate", status: "Active", expiry: "Mar 2028", daysLeft: 1100 },
            { name: "FCRA Registration", status: "Expiring", expiry: "Dec 2025", daysLeft: 45 },
            { name: "CSR-1 Form", status: "Filed", expiry: "FY 2024-25", daysLeft: null },
          ].map((item) => (
            <div
              key={item.name}
              className={`p-4 rounded-xl border ${
                item.status === "Expiring" ? "border-warning bg-warning/10" : "border-border bg-secondary/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Valid till: {item.expiry}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "Active"
                      ? "bg-success/20 text-success"
                      : item.status === "Expiring"
                      ? "bg-warning/20 text-warning"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              {item.daysLeft && item.daysLeft < 100 && (
                <div className="flex items-center gap-2 mt-3 text-warning text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{item.daysLeft} days remaining</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* DEEP RESEARCH LEVEL */}
      <DashboardSection
        level="deep"
        title="Audit & Reports"
        subtitle="Comprehensive data export and analysis"
        icon={<Receipt className="w-5 h-5 text-coral" />}
        defaultExpanded={false}
      >
        <DeepResearchView
          title="Financial Analysis"
          subtitle="FY-wise donation and expense reports"
          onExport={() => console.log("Exporting...")}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Fiscal Year</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Donations</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Expenses</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { fy: "2024-25", donations: 12400000, expenses: 8400000, util: 67.8 },
                  { fy: "2023-24", donations: 10500000, expenses: 9200000, util: 87.6 },
                  { fy: "2022-23", donations: 8200000, expenses: 7800000, util: 95.1 },
                ].map((row) => (
                  <tr key={row.fy} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4 text-foreground font-medium">{row.fy}</td>
                    <td className="py-3 px-4 text-right text-foreground">
                      {currencySymbol}{(row.donations / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">
                      {currencySymbol}{(row.expenses / 100000).toFixed(1)}L
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.util > 80 ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
                        }`}
                      >
                        {row.util}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DeepResearchView>
      </DashboardSection>
    </div>
  );
};
