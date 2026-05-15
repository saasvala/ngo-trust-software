import { useState, useEffect } from "react";
import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import { StatCardSkeleton } from "@/components/ui/loading";
import { 
  Globe, 
  Building2, 
  Users, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  Map,
  Activity
} from "lucide-react";

export const SuperAdminDashboard = () => {
  const { formatCurrency } = useRules();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* MACRO LEVEL - Global Overview */}
      <DashboardSection
        level="macro"
        title="Global Federation Overview"
        subtitle="Real-time metrics across all countries and NGOs"
        icon={<Globe className="w-6 h-6 text-white" />}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D
              title="Total Countries"
              value={5}
              icon={<Globe className="w-6 h-6 text-white" />}
              iconBg="primary"
              change="+1 this year"
              trend="up"
            />
            <StatCard3D
              title="Active NGOs"
              value={247}
              icon={<Building2 className="w-6 h-6 text-white" />}
              iconBg="teal"
              change="+23 this month"
              trend="up"
            />
            <StatCard3D
              title="Total Beneficiaries"
              value={1250000}
              icon={<Users className="w-6 h-6 text-white" />}
              iconBg="coral"
              change="+8.5%"
              trend="up"
            />
            <StatCard3D
              title="Global Donations"
              value={4500000000}
              prefix="$"
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              iconBg="success"
              change="+15.2% YoY"
              trend="up"
            />
          </div>
        )}
      </DashboardSection>

      {/* MICRO LEVEL - Country Breakdown */}
      <DashboardSection
        level="micro"
        title="Country-wise Analytics"
        subtitle="Performance breakdown by region"
        icon={<Map className="w-5 h-5 text-primary" />}
        defaultExpanded={true}
      >
        <div className="space-y-4">
          {[
            { country: "India", flag: "🇮🇳", ngos: 124, donations: 1200000000, utilization: 78 },
            { country: "United States", flag: "🇺🇸", ngos: 67, donations: 2100000000, utilization: 82 },
            { country: "United Kingdom", flag: "🇬🇧", ngos: 34, donations: 650000000, utilization: 75 },
            { country: "Canada", flag: "🇨🇦", ngos: 15, donations: 380000000, utilization: 80 },
            { country: "Australia", flag: "🇦🇺", ngos: 7, donations: 170000000, utilization: 85 },
          ].map((item) => (
            <div
              key={item.country}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{item.flag}</span>
                <div>
                  <p className="font-medium text-foreground">{item.country}</p>
                  <p className="text-sm text-muted-foreground">{item.ngos} NGOs active</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="font-semibold text-foreground">${(item.donations / 1000000).toFixed(0)}M</p>
                  <p className="text-xs text-muted-foreground">Total Donations</p>
                </div>
                <div className="w-32">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Utilization</span>
                    <span className="text-xs font-medium text-foreground">{item.utilization}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-teal rounded-full transition-all duration-1000"
                      style={{ width: `${item.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* NANO LEVEL - Compliance Heatmap */}
      <DashboardSection
        level="nano"
        title="Compliance Risk Heatmap"
        subtitle="Real-time compliance status across federation"
        icon={<Shield className="w-5 h-5 text-teal" />}
        defaultExpanded={false}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { status: "Compliant", count: 198, color: "bg-success" },
            { status: "Expiring Soon", count: 32, color: "bg-warning" },
            { status: "Action Required", count: 12, color: "bg-coral" },
            { status: "Under Review", count: 5, color: "bg-primary" },
          ].map((item) => (
            <div key={item.status} className="p-4 rounded-xl bg-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-muted-foreground">{item.status}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{item.count}</p>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* DEEP RESEARCH LEVEL */}
      <DashboardSection
        level="deep"
        title="Advanced Analytics"
        subtitle="Deep dive into federation data"
        icon={<Activity className="w-5 h-5 text-coral" />}
        defaultExpanded={false}
      >
        <DeepResearchView
          title="Historical Trend Analysis"
          subtitle="Multi-year performance comparison"
          onExport={() => console.log("Exporting...")}
        >
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Access comprehensive historical data, audit trails, and advanced filtering for compliance reporting.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Records", value: "2.4M" },
                { label: "Audit Entries", value: "156K" },
                { label: "Reports Generated", value: "1,247" },
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
