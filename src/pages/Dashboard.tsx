import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentDonations } from "@/components/dashboard/RecentDonations";
import { ComplianceAlerts } from "@/components/dashboard/ComplianceAlerts";
import { ProjectProgress } from "@/components/dashboard/ProjectProgress";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DonationChart } from "@/components/dashboard/DonationChart";
import { FederationWidget } from "@/components/dashboard/FederationWidget";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { AuditLogWidget } from "@/components/dashboard/AuditLogWidget";
import { DonorDashboard } from "@/components/dashboard/DonorDashboard";
import { useRules } from "@/contexts/RuleContext";
import { IndianRupee, Users, FolderKanban, Percent, AlertTriangle, Receipt, DollarSign, PoundSterling, Coins } from "lucide-react";

const getCurrencyIcon = (currencyCode: string) => {
  switch (currencyCode) {
    case 'INR': return IndianRupee;
    case 'USD': return DollarSign;
    case 'GBP': return PoundSterling;
    default: return Coins;
  }
};

const Dashboard = () => {
  const { permissions, currentRole, location, formatCurrency } = useRules();

  // Donor role gets completely different dashboard
  if (currentRole === 'donor') {
    return (
      <MainLayout title="Donor Dashboard" subtitle="Your donation history and tax documents">
        <DonorDashboard />
      </MainLayout>
    );
  }

  const CurrencyIcon = location.country ? getCurrencyIcon(location.country.currency.code) : IndianRupee;
  const widgets = permissions?.dashboardWidgets || [];

  const showWidget = (name: string) => widgets.includes(name);

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's your NGO overview.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total Donations"
          value={formatCurrency(12400000)}
          change="+18.2%"
          trend="up"
          icon={CurrencyIcon}
          iconBg="primary"
        />
        <StatCard
          title={location.country?.countryCode === 'IN' ? '80G Eligible' : 'Tax Deductible'}
          value={formatCurrency(9850000)}
          change="+12.5%"
          trend="up"
          icon={Receipt}
          iconBg="teal"
        />
        <StatCard
          title="Total Donors"
          value="2,847"
          change="+8.3%"
          trend="up"
          icon={Users}
          iconBg="coral"
        />
        <StatCard
          title="Active Projects"
          value="12"
          change="+2"
          trend="up"
          icon={FolderKanban}
          iconBg="success"
        />
        <StatCard
          title="Fund Utilization"
          value="67.8%"
          change="+5.2%"
          trend="up"
          icon={Percent}
          iconBg="primary"
        />
        <StatCard
          title="Pending Approvals"
          value="8"
          change="-3"
          trend="down"
          icon={AlertTriangle}
          iconBg="coral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Chart & Table */}
        <div className="xl:col-span-2 space-y-6">
          {showWidget('donations') && <DonationChart />}
          {showWidget('donations') && <RecentDonations />}
          {showWidget('federation') && <FederationWidget />}
          {showWidget('audit_logs') && <AuditLogWidget />}
        </div>

        {/* Right Column - Widgets */}
        <div className="space-y-6">
          {showWidget('quick_actions') && <QuickActions />}
          {showWidget('ai_suggestions') && <AISuggestions />}
          {showWidget('compliance') && <ComplianceAlerts />}
          {showWidget('projects') && <ProjectProgress />}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
