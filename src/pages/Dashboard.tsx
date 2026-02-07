import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentDonations } from "@/components/dashboard/RecentDonations";
import { ComplianceAlerts } from "@/components/dashboard/ComplianceAlerts";
import { ProjectProgress } from "@/components/dashboard/ProjectProgress";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DonationChart } from "@/components/dashboard/DonationChart";
import { IndianRupee, Users, FolderKanban, Percent, AlertTriangle, Receipt } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's your NGO overview.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total Donations"
          value="₹1.24 Cr"
          change="+18.2%"
          trend="up"
          icon={IndianRupee}
          iconBg="primary"
        />
        <StatCard
          title="80G Eligible"
          value="₹98.5 L"
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
          <DonationChart />
          <RecentDonations />
        </div>

        {/* Right Column - Widgets */}
        <div className="space-y-6">
          <QuickActions />
          <ComplianceAlerts />
          <ProjectProgress />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
