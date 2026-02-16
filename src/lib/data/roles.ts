import { AppRole, RolePermissions } from '../types/rules';

export const rolePermissions: RolePermissions[] = [
  {
    role: 'super_admin',
    canViewDashboard: true, canManageDonors: true, canManageDonations: true, canManageExpenses: true, canApproveExpenses: true,
    canManageProjects: true, canManageCompliance: true, canViewReports: true, canExportData: true, canManageUsers: true,
    canConfigureLocation: true, canManageFederation: true, canAccessAuditLogs: true, canToggleTransparency: true,
    dashboardWidgets: ['stats', 'donations', 'compliance', 'projects', 'federation', 'ai_suggestions', 'audit_logs'],
  },
  {
    role: 'system_owner',
    canViewDashboard: true, canManageDonors: false, canManageDonations: false, canManageExpenses: false, canApproveExpenses: false,
    canManageProjects: false, canManageCompliance: true, canViewReports: true, canExportData: true, canManageUsers: true,
    canConfigureLocation: true, canManageFederation: true, canAccessAuditLogs: true, canToggleTransparency: true,
    dashboardWidgets: ['stats', 'compliance', 'federation', 'audit_logs'],
  },
  {
    role: 'country_admin',
    canViewDashboard: true, canManageDonors: true, canManageDonations: true, canManageExpenses: true, canApproveExpenses: true,
    canManageProjects: true, canManageCompliance: true, canViewReports: true, canExportData: true, canManageUsers: true,
    canConfigureLocation: false, canManageFederation: true, canAccessAuditLogs: true, canToggleTransparency: true,
    dashboardWidgets: ['stats', 'donations', 'compliance', 'projects', 'federation', 'ai_suggestions'],
  },
  {
    role: 'state_admin',
    canViewDashboard: true, canManageDonors: true, canManageDonations: true, canManageExpenses: true, canApproveExpenses: true,
    canManageProjects: true, canManageCompliance: true, canViewReports: true, canExportData: true, canManageUsers: true,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: true, canToggleTransparency: true,
    dashboardWidgets: ['stats', 'donations', 'compliance', 'projects', 'ai_suggestions'],
  },
  {
    role: 'ngo_admin',
    canViewDashboard: true, canManageDonors: true, canManageDonations: true, canManageExpenses: true, canApproveExpenses: true,
    canManageProjects: true, canManageCompliance: true, canViewReports: true, canExportData: true, canManageUsers: true,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: true, canToggleTransparency: true,
    dashboardWidgets: ['stats', 'donations', 'compliance', 'projects', 'quick_actions', 'ai_suggestions'],
  },
  {
    role: 'accountant',
    canViewDashboard: true, canManageDonors: true, canManageDonations: true, canManageExpenses: true, canApproveExpenses: false,
    canManageProjects: false, canManageCompliance: true, canViewReports: true, canExportData: true, canManageUsers: false,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: false, canToggleTransparency: false,
    dashboardWidgets: ['stats', 'donations', 'compliance', 'quick_actions'],
  },
  {
    role: 'operator',
    canViewDashboard: true, canManageDonors: true, canManageDonations: true, canManageExpenses: false, canApproveExpenses: false,
    canManageProjects: false, canManageCompliance: false, canViewReports: false, canExportData: false, canManageUsers: false,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: false, canToggleTransparency: false,
    dashboardWidgets: ['stats', 'donations', 'quick_actions'],
  },
  {
    role: 'project_manager',
    canViewDashboard: true, canManageDonors: false, canManageDonations: false, canManageExpenses: true, canApproveExpenses: false,
    canManageProjects: true, canManageCompliance: false, canViewReports: true, canExportData: true, canManageUsers: false,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: false, canToggleTransparency: false,
    dashboardWidgets: ['stats', 'projects', 'quick_actions'],
  },
  {
    role: 'field_executor',
    canViewDashboard: true, canManageDonors: false, canManageDonations: false, canManageExpenses: false, canApproveExpenses: false,
    canManageProjects: false, canManageCompliance: false, canViewReports: false, canExportData: false, canManageUsers: false,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: false, canToggleTransparency: false,
    dashboardWidgets: ['stats', 'quick_actions'],
  },
  {
    role: 'auditor',
    canViewDashboard: true, canManageDonors: false, canManageDonations: false, canManageExpenses: false, canApproveExpenses: false,
    canManageProjects: false, canManageCompliance: false, canViewReports: true, canExportData: true, canManageUsers: false,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: true, canToggleTransparency: false,
    dashboardWidgets: ['stats', 'compliance', 'audit_logs'],
  },
  {
    role: 'government_officer',
    canViewDashboard: true, canManageDonors: false, canManageDonations: false, canManageExpenses: false, canApproveExpenses: false,
    canManageProjects: false, canManageCompliance: false, canViewReports: true, canExportData: false, canManageUsers: false,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: false, canToggleTransparency: false,
    dashboardWidgets: ['stats', 'compliance'],
  },
  {
    role: 'donor',
    canViewDashboard: true, canManageDonors: false, canManageDonations: false, canManageExpenses: false, canApproveExpenses: false,
    canManageProjects: false, canManageCompliance: false, canViewReports: false, canExportData: false, canManageUsers: false,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: false, canToggleTransparency: false,
    dashboardWidgets: ['donation_history', 'tax_summary', 'receipts'],
  },
  {
    role: 'view_only',
    canViewDashboard: true, canManageDonors: false, canManageDonations: false, canManageExpenses: false, canApproveExpenses: false,
    canManageProjects: false, canManageCompliance: false, canViewReports: true, canExportData: false, canManageUsers: false,
    canConfigureLocation: false, canManageFederation: false, canAccessAuditLogs: false, canToggleTransparency: false,
    dashboardWidgets: ['stats'],
  },
];

export const getRolePermissions = (role: AppRole): RolePermissions | undefined => {
  return rolePermissions.find(rp => rp.role === role);
};

export const getRoleLabel = (role: AppRole): string => {
  const labels: Record<AppRole, string> = {
    super_admin: 'Super Admin',
    system_owner: 'System Owner',
    country_admin: 'Country Admin',
    state_admin: 'State/Region Admin',
    ngo_admin: 'NGO Admin',
    accountant: 'Accountant',
    operator: 'Operator',
    project_manager: 'Project Manager',
    field_executor: 'Field Executor',
    auditor: 'CA / Auditor',
    government_officer: 'Government Officer',
    donor: 'Donor',
    view_only: 'View Only',
  };
  return labels[role];
};

export const getMenuItemsForRole = (role: AppRole): string[] => {
  const permissions = getRolePermissions(role);
  if (!permissions) return [];

  const items: string[] = ['/'];
  
  if (permissions.canManageDonors) items.push('/donors');
  if (permissions.canManageDonations) items.push('/beneficiaries', '/donations');
  if (permissions.canManageProjects) items.push('/projects');
  if (permissions.canManageExpenses) items.push('/expenses');
  if (permissions.canManageUsers) items.push('/volunteers');
  if (permissions.canManageCompliance) items.push('/compliance', '/audit');
  if (permissions.canViewReports) items.push('/reports', '/risk');
  if (permissions.canManageFederation) items.push('/grants', '/approvals');
  if (permissions.canManageProjects || role === 'project_manager') items.push('/assets', '/budget');
  if (permissions.canApproveExpenses) items.push('/automation');
  if (permissions.canManageCompliance) items.push('/government-filing');
  if (role === 'super_admin' || role === 'system_owner' || role === 'ngo_admin') items.push('/data-governance');
  items.push('/documents');

  // Infrastructure pages - System Owner & Super Admin only
  if (role === 'system_owner' || role === 'super_admin') {
    items.push('/backups', '/system-health', '/api-webhooks', '/bulk-import', '/billing', '/security', '/usage-analytics');
  }

  if (permissions.canConfigureLocation || role === 'ngo_admin') items.push('/settings');
  
  // Field executor gets minimal
  if (role === 'field_executor') return ['/', '/documents'];
  // View only gets dashboard + reports + documents
  if (role === 'view_only') return ['/', '/reports', '/documents'];
  
  return items;
};
