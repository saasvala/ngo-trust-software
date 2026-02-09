import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { useRules } from "@/contexts/RuleContext";
import { 
  Heart,
  Receipt,
  Download,
  TrendingUp,
  Calendar,
  FileText,
  Gift
} from "lucide-react";

export const DonorPortalDashboard = () => {
  const { location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";
  const taxBenefitName = location.country?.countryCode === "IN" ? "80G" : "Tax Deductible";

  const donationHistory = [
    { id: "DON-1247", date: "Feb 5, 2025", amount: 25000, project: "Education Initiative", receipt: true },
    { id: "DON-1198", date: "Jan 15, 2025", amount: 50000, project: "Healthcare Camp", receipt: true },
    { id: "DON-1156", date: "Dec 20, 2024", amount: 10000, project: "General Fund", receipt: true },
    { id: "DON-1089", date: "Nov 5, 2024", amount: 100000, project: "Rural Development", receipt: true },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-primary/10 to-coral/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back, Donor!</h2>
            <p className="text-muted-foreground">Thank you for your continued support</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
            <Gift className="w-5 h-5" />
            Donate Now
          </button>
        </div>
      </div>

      {/* MACRO LEVEL - Personal Summary */}
      <DashboardSection
        level="macro"
        title="Your Donation Summary"
        subtitle="Lifetime contribution and tax benefits"
        icon={<Heart className="w-6 h-6 text-white" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D
            title="Total Donated"
            value={485000}
            prefix={currencySymbol}
            icon={<Heart className="w-6 h-6 text-white" />}
            iconBg="primary"
            change="Lifetime"
            trend="up"
          />
          <StatCard3D
            title={`${taxBenefitName} Eligible`}
            value={435000}
            prefix={currencySymbol}
            icon={<Receipt className="w-6 h-6 text-white" />}
            iconBg="teal"
            change="89.7% of total"
            trend="up"
          />
          <StatCard3D
            title="This Financial Year"
            value={185000}
            prefix={currencySymbol}
            icon={<Calendar className="w-6 h-6 text-white" />}
            iconBg="coral"
            change="FY 2024-25"
            trend="up"
          />
          <StatCard3D
            title="Tax Saved (Est.)"
            value={55500}
            prefix={currencySymbol}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            iconBg="success"
            change="30% bracket"
            trend="up"
          />
        </div>
      </DashboardSection>

      {/* MICRO LEVEL - Donation History */}
      <DashboardSection
        level="micro"
        title="Donation History"
        subtitle="All your contributions with receipts"
        icon={<FileText className="w-5 h-5 text-primary" />}
        defaultExpanded={true}
      >
        <div className="space-y-3">
          {donationHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.project}</p>
                  <p className="text-sm text-muted-foreground">{item.date} • {item.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {currencySymbol}{item.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-success">{taxBenefitName} Eligible</p>
                </div>
                {item.receipt && (
                  <button className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* NANO LEVEL - Year-wise Summary */}
      <DashboardSection
        level="nano"
        title="Year-wise Tax Summary"
        subtitle="For CA filing and ITR preparation"
        icon={<Receipt className="w-5 h-5 text-teal" />}
        defaultExpanded={false}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Financial Year</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total Donated</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">{taxBenefitName} Amount</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Receipts</th>
              </tr>
            </thead>
            <tbody>
              {[
                { fy: "2024-25", total: 185000, eligible: 185000 },
                { fy: "2023-24", total: 150000, eligible: 130000 },
                { fy: "2022-23", total: 100000, eligible: 80000 },
                { fy: "2021-22", total: 50000, eligible: 40000 },
              ].map((row) => (
                <tr key={row.fy} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 px-4 text-foreground font-medium">{row.fy}</td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {currencySymbol}{row.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-success">
                    {currencySymbol}{row.eligible.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors">
                      Download All
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Impact Visualization */}
      <DashboardSection
        level="nano"
        title="Your Impact"
        subtitle="See how your donations are making a difference"
        icon={<TrendingUp className="w-5 h-5 text-coral" />}
        defaultExpanded={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { metric: "Children Educated", value: "45", icon: "📚" },
            { metric: "Medical Camps", value: "12", icon: "🏥" },
            { metric: "Villages Reached", value: "8", icon: "🏘️" },
          ].map((item) => (
            <div key={item.metric} className="p-4 rounded-xl bg-secondary/30 text-center">
              <span className="text-3xl mb-2 block">{item.icon}</span>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.metric}</p>
            </div>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
};
