import { MainLayout } from "@/components/layout/MainLayout";
import { useRules } from "@/contexts/RuleContext";
import { SuperAdminDashboard } from "@/components/dashboard/roles/SuperAdminDashboard";
import { NGOAdminDashboard } from "@/components/dashboard/roles/NGOAdminDashboard";
import { AccountantDashboard } from "@/components/dashboard/roles/AccountantDashboard";
import { OperatorDashboard } from "@/components/dashboard/roles/OperatorDashboard";
import { AuditorDashboard } from "@/components/dashboard/roles/AuditorDashboard";
import { DonorPortalDashboard } from "@/components/dashboard/roles/DonorPortalDashboard";
import { getRoleLabel } from "@/lib/data/roles";

const Dashboard = () => {
  const { currentRole, location } = useRules();

  // Role-specific dashboard content
  const renderDashboard = () => {
    switch (currentRole) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'country_admin':
      case 'state_admin':
      case 'ngo_admin':
        return <NGOAdminDashboard />;
      case 'accountant':
        return <AccountantDashboard />;
      case 'operator':
        return <OperatorDashboard />;
      case 'auditor':
      case 'government_officer':
        return <AuditorDashboard />;
      case 'donor':
        return <DonorPortalDashboard />;
      default:
        return <NGOAdminDashboard />;
    }
  };

  // Role-specific subtitles
  const getSubtitle = () => {
    switch (currentRole) {
      case 'super_admin':
        return 'Global federation overview and analytics';
      case 'country_admin':
        return `Country-level management for ${location.country?.countryName || 'your region'}`;
      case 'state_admin':
        return `State-level oversight for ${location.state?.stateName || 'your state'}`;
      case 'ngo_admin':
        return 'Your NGO performance and compliance status';
      case 'accountant':
        return 'Financial management and approval queue';
      case 'operator':
        return 'Daily tasks and quick actions';
      case 'auditor':
      case 'government_officer':
        return 'Compliance verification and audit access';
      case 'donor':
        return 'Your donation history and tax documents';
      default:
        return 'Welcome to NGO Manager';
    }
  };

  return (
    <MainLayout 
      title={`${getRoleLabel(currentRole)} Dashboard`} 
      subtitle={getSubtitle()}
    >
      {renderDashboard()}
    </MainLayout>
  );
};

export default Dashboard;
