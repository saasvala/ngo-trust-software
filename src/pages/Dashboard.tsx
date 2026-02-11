import { MainLayout } from "@/components/layout/MainLayout";
import { useRules } from "@/contexts/RuleContext";
import { SuperAdminDashboard } from "@/components/dashboard/roles/SuperAdminDashboard";
import { SystemOwnerDashboard } from "@/components/dashboard/roles/SystemOwnerDashboard";
import { NGOAdminDashboard } from "@/components/dashboard/roles/NGOAdminDashboard";
import { AccountantDashboard } from "@/components/dashboard/roles/AccountantDashboard";
import { OperatorDashboard } from "@/components/dashboard/roles/OperatorDashboard";
import { ProjectManagerDashboard } from "@/components/dashboard/roles/ProjectManagerDashboard";
import { FieldExecutorDashboard } from "@/components/dashboard/roles/FieldExecutorDashboard";
import { AuditorDashboard } from "@/components/dashboard/roles/AuditorDashboard";
import { DonorPortalDashboard } from "@/components/dashboard/roles/DonorPortalDashboard";
import { ViewOnlyDashboard } from "@/components/dashboard/roles/ViewOnlyDashboard";
import { getRoleLabel } from "@/lib/data/roles";

const Dashboard = () => {
  const { currentRole, location } = useRules();

  const renderDashboard = () => {
    switch (currentRole) {
      case 'super_admin': return <SuperAdminDashboard />;
      case 'system_owner': return <SystemOwnerDashboard />;
      case 'country_admin':
      case 'state_admin':
      case 'ngo_admin': return <NGOAdminDashboard />;
      case 'accountant': return <AccountantDashboard />;
      case 'operator': return <OperatorDashboard />;
      case 'project_manager': return <ProjectManagerDashboard />;
      case 'field_executor': return <FieldExecutorDashboard />;
      case 'auditor':
      case 'government_officer': return <AuditorDashboard />;
      case 'donor': return <DonorPortalDashboard />;
      case 'view_only': return <ViewOnlyDashboard />;
      default: return <NGOAdminDashboard />;
    }
  };

  const getSubtitle = () => {
    switch (currentRole) {
      case 'super_admin': return 'Global federation overview and analytics';
      case 'system_owner': return 'Platform health, tenant management & security';
      case 'country_admin': return `Country-level management for ${location.country?.countryName || 'your region'}`;
      case 'state_admin': return `State-level oversight for ${location.state?.stateName || 'your state'}`;
      case 'ngo_admin': return 'Your NGO performance and compliance status';
      case 'accountant': return 'Financial management and approval queue';
      case 'operator': return 'Daily tasks and quick actions';
      case 'project_manager': return 'Project portfolio, milestones & budget tracking';
      case 'field_executor': return 'Assigned field tasks and evidence capture';
      case 'auditor':
      case 'government_officer': return 'Compliance verification and audit access';
      case 'donor': return 'Your donation history and tax documents';
      case 'view_only': return 'Read-only organization overview';
      default: return 'Welcome to NGO Manager';
    }
  };

  return (
    <MainLayout title={`${getRoleLabel(currentRole)} Dashboard`} subtitle={getSubtitle()}>
      {renderDashboard()}
    </MainLayout>
  );
};

export default Dashboard;
