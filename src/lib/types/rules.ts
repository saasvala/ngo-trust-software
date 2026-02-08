// Global Rule Engine Types

export type AppRole = 
  | 'super_admin'
  | 'country_admin'
  | 'state_admin'
  | 'ngo_admin'
  | 'accountant'
  | 'operator'
  | 'auditor'
  | 'government_officer'
  | 'donor';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimalPlaces: number;
}

export interface FiscalYear {
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number;
  endDay: number;
  label: string; // e.g., "April - March (FY)"
}

export interface ComplianceType {
  id: string;
  name: string;
  description: string;
  registrationRequired: boolean;
  renewalPeriodMonths?: number;
  taxBenefitApplicable: boolean;
}

export interface TaxBenefitRule {
  id: string;
  name: string;
  description: string;
  donorPanRequired: boolean;
  maxDeductionPercent?: number;
  maxDeductionAmount?: number;
  applicableTo: ('individual' | 'corporate' | 'csr')[];
}

export interface CountryRules {
  countryCode: string;
  countryName: string;
  currency: Currency;
  fiscalYear: FiscalYear;
  complianceTypes: ComplianceType[];
  taxBenefitRules: TaxBenefitRule[];
  donationPriority: 'donation' | 'grant' | 'both';
  governmentApiAvailable: boolean;
  auditorRoleName: string; // e.g., "CA" in India, "CPA" in USA
  receiptFormat: 'standard' | 'detailed' | 'government';
  autoFilingAvailable: boolean;
  requiredDonorFields: string[];
  optionalDonorFields: string[];
  paymentModes: string[];
}

export interface StateRules {
  stateCode: string;
  stateName: string;
  countryCode: string;
  localRegistrations: ComplianceType[];
  regionalGrants: string[];
  reportingDeadlines: { name: string; dayOfYear: number }[];
  federationLevel?: 'state' | 'region' | 'district';
  additionalFields?: string[];
}

export interface CityRules {
  cityCode: string;
  cityName: string;
  stateCode: string;
  countryCode: string;
  localRequirements?: string[];
}

export interface LocationConfig {
  country: CountryRules | null;
  state: StateRules | null;
  city: CityRules | null;
  isConfigured: boolean;
  configuredAt?: string;
  configuredBy?: string;
}

export interface RolePermissions {
  role: AppRole;
  canViewDashboard: boolean;
  canManageDonors: boolean;
  canManageDonations: boolean;
  canManageExpenses: boolean;
  canApproveExpenses: boolean;
  canManageProjects: boolean;
  canManageCompliance: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
  canConfigureLocation: boolean;
  canManageFederation: boolean;
  canAccessAuditLogs: boolean;
  canToggleTransparency: boolean;
  dashboardWidgets: string[];
}

export interface FederationLevel {
  id: string;
  name: string;
  type: 'global_hq' | 'country' | 'state' | 'ngo';
  parentId?: string;
  countryCode?: string;
  stateCode?: string;
}

export interface TransparencySettings {
  enabled: boolean;
  showProfile: boolean;
  showProjects: boolean;
  showUtilization: boolean;
  showImpactMetrics: boolean;
  showAnnualReports: boolean;
  showCertificates: boolean;
  seoEnabled: boolean;
}
