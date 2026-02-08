import { CountryRules, StateRules } from '../types/rules';

export const countries: CountryRules[] = [
  {
    countryCode: 'IN',
    countryName: 'India',
    currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimalPlaces: 2 },
    fiscalYear: { startMonth: 4, startDay: 1, endMonth: 3, endDay: 31, label: 'April - March (FY)' },
    complianceTypes: [
      { id: '12a', name: '12A Registration', description: 'Tax exemption registration under Section 12A', registrationRequired: true, renewalPeriodMonths: 60, taxBenefitApplicable: true },
      { id: '80g', name: '80G Certification', description: 'Donation tax deduction certificate under Section 80G', registrationRequired: true, renewalPeriodMonths: 60, taxBenefitApplicable: true },
      { id: 'fcra', name: 'FCRA Registration', description: 'Foreign Contribution Regulation Act registration', registrationRequired: false, renewalPeriodMonths: 60, taxBenefitApplicable: false },
      { id: 'csr1', name: 'CSR-1 Registration', description: 'Corporate Social Responsibility registration', registrationRequired: false, taxBenefitApplicable: false },
    ],
    taxBenefitRules: [
      { id: '80g_50', name: '80G - 50% Deduction', description: '50% of donation amount deductible', donorPanRequired: true, maxDeductionPercent: 50, applicableTo: ['individual', 'corporate'] },
      { id: '80g_100', name: '80G - 100% Deduction', description: '100% of donation amount deductible (select causes)', donorPanRequired: true, maxDeductionPercent: 100, applicableTo: ['individual', 'corporate'] },
      { id: 'csr', name: 'CSR Funding', description: 'Corporate CSR contribution', donorPanRequired: true, applicableTo: ['csr'] },
    ],
    donationPriority: 'donation',
    governmentApiAvailable: true,
    auditorRoleName: 'Chartered Accountant (CA)',
    receiptFormat: 'government',
    autoFilingAvailable: true,
    requiredDonorFields: ['name', 'pan', 'address'],
    optionalDonorFields: ['email', 'mobile', 'aadhaar'],
    paymentModes: ['Cash', 'Cheque', 'Bank Transfer', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'],
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    currency: { code: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2 },
    fiscalYear: { startMonth: 1, startDay: 1, endMonth: 12, endDay: 31, label: 'January - December' },
    complianceTypes: [
      { id: '501c3', name: '501(c)(3) Status', description: 'Tax-exempt nonprofit organization status', registrationRequired: true, taxBenefitApplicable: true },
      { id: 'state_reg', name: 'State Registration', description: 'State charitable registration', registrationRequired: true, renewalPeriodMonths: 12, taxBenefitApplicable: false },
    ],
    taxBenefitRules: [
      { id: 'itemized', name: 'Itemized Deduction', description: 'Charitable contribution deduction for itemizers', donorPanRequired: false, maxDeductionPercent: 60, applicableTo: ['individual'] },
      { id: 'corporate', name: 'Corporate Deduction', description: 'Corporate charitable deduction', donorPanRequired: false, maxDeductionPercent: 25, applicableTo: ['corporate'] },
    ],
    donationPriority: 'both',
    governmentApiAvailable: false,
    auditorRoleName: 'Certified Public Accountant (CPA)',
    receiptFormat: 'standard',
    autoFilingAvailable: false,
    requiredDonorFields: ['name', 'address'],
    optionalDonorFields: ['email', 'phone', 'ssn'],
    paymentModes: ['Cash', 'Check', 'Wire Transfer', 'Credit Card', 'Debit Card', 'ACH'],
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    currency: { code: 'GBP', symbol: '£', name: 'British Pound', decimalPlaces: 2 },
    fiscalYear: { startMonth: 4, startDay: 6, endMonth: 4, endDay: 5, label: 'April 6 - April 5' },
    complianceTypes: [
      { id: 'charity_reg', name: 'Charity Registration', description: 'Registration with Charity Commission', registrationRequired: true, taxBenefitApplicable: true },
      { id: 'gift_aid', name: 'Gift Aid', description: 'Gift Aid registration for tax-effective giving', registrationRequired: true, taxBenefitApplicable: true },
    ],
    taxBenefitRules: [
      { id: 'gift_aid_basic', name: 'Gift Aid', description: 'Charity claims 25p for every £1 donated', donorPanRequired: false, applicableTo: ['individual'] },
      { id: 'gift_aid_higher', name: 'Higher Rate Relief', description: 'Higher/additional rate taxpayers can claim back difference', donorPanRequired: false, applicableTo: ['individual'] },
    ],
    donationPriority: 'donation',
    governmentApiAvailable: true,
    auditorRoleName: 'Chartered Accountant',
    receiptFormat: 'standard',
    autoFilingAvailable: true,
    requiredDonorFields: ['name', 'address', 'postcode'],
    optionalDonorFields: ['email', 'phone'],
    paymentModes: ['Cash', 'Cheque', 'Bank Transfer', 'Credit Card', 'Debit Card', 'Direct Debit'],
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    currency: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimalPlaces: 2 },
    fiscalYear: { startMonth: 1, startDay: 1, endMonth: 12, endDay: 31, label: 'January - December' },
    complianceTypes: [
      { id: 'cra_reg', name: 'CRA Registration', description: 'Registered charity with Canada Revenue Agency', registrationRequired: true, taxBenefitApplicable: true },
    ],
    taxBenefitRules: [
      { id: 'federal_credit', name: 'Federal Tax Credit', description: '15% on first $200, 29% on remainder', donorPanRequired: false, applicableTo: ['individual'] },
      { id: 'corporate_deduction', name: 'Corporate Deduction', description: 'Deduct up to 75% of net income', donorPanRequired: false, maxDeductionPercent: 75, applicableTo: ['corporate'] },
    ],
    donationPriority: 'both',
    governmentApiAvailable: true,
    auditorRoleName: 'Chartered Professional Accountant (CPA)',
    receiptFormat: 'detailed',
    autoFilingAvailable: false,
    requiredDonorFields: ['name', 'address'],
    optionalDonorFields: ['email', 'phone', 'sin'],
    paymentModes: ['Cash', 'Cheque', 'Wire Transfer', 'Credit Card', 'Debit Card', 'Interac'],
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    currency: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimalPlaces: 2 },
    fiscalYear: { startMonth: 7, startDay: 1, endMonth: 6, endDay: 30, label: 'July - June' },
    complianceTypes: [
      { id: 'acnc_reg', name: 'ACNC Registration', description: 'Australian Charities and Not-for-profits Commission registration', registrationRequired: true, taxBenefitApplicable: true },
      { id: 'dgr', name: 'DGR Status', description: 'Deductible Gift Recipient status', registrationRequired: true, taxBenefitApplicable: true },
    ],
    taxBenefitRules: [
      { id: 'dgr_deduction', name: 'DGR Deduction', description: 'Tax deduction for gifts over $2', donorPanRequired: false, applicableTo: ['individual', 'corporate'] },
    ],
    donationPriority: 'donation',
    governmentApiAvailable: true,
    auditorRoleName: 'Chartered Accountant (CA)',
    receiptFormat: 'standard',
    autoFilingAvailable: true,
    requiredDonorFields: ['name', 'address'],
    optionalDonorFields: ['email', 'phone', 'abn'],
    paymentModes: ['Cash', 'Cheque', 'Bank Transfer', 'Credit Card', 'Debit Card', 'BPAY'],
  },
];

export const statesByCountry: Record<string, StateRules[]> = {
  IN: [
    { stateCode: 'MH', stateName: 'Maharashtra', countryCode: 'IN', localRegistrations: [{ id: 'mh_trust', name: 'Maharashtra Trust Registration', description: 'State trust registration', registrationRequired: true, taxBenefitApplicable: false }], regionalGrants: ['CM Relief Fund', 'State Welfare Grants'], reportingDeadlines: [{ name: 'Annual Return', dayOfYear: 270 }], federationLevel: 'state' },
    { stateCode: 'DL', stateName: 'Delhi', countryCode: 'IN', localRegistrations: [{ id: 'dl_society', name: 'Delhi Society Registration', description: 'Delhi society registration', registrationRequired: true, taxBenefitApplicable: false }], regionalGrants: ['Delhi State Grants'], reportingDeadlines: [{ name: 'Annual Return', dayOfYear: 270 }], federationLevel: 'state' },
    { stateCode: 'KA', stateName: 'Karnataka', countryCode: 'IN', localRegistrations: [{ id: 'ka_trust', name: 'Karnataka Trust Registration', description: 'Karnataka trust act registration', registrationRequired: true, taxBenefitApplicable: false }], regionalGrants: ['Karnataka State Grants'], reportingDeadlines: [{ name: 'Annual Return', dayOfYear: 270 }], federationLevel: 'state' },
    { stateCode: 'TN', stateName: 'Tamil Nadu', countryCode: 'IN', localRegistrations: [{ id: 'tn_trust', name: 'Tamil Nadu Trust Registration', description: 'TN trust registration', registrationRequired: true, taxBenefitApplicable: false }], regionalGrants: ['TN State Welfare'], reportingDeadlines: [{ name: 'Annual Return', dayOfYear: 270 }], federationLevel: 'state' },
    { stateCode: 'GJ', stateName: 'Gujarat', countryCode: 'IN', localRegistrations: [{ id: 'gj_trust', name: 'Gujarat Trust Registration', description: 'Gujarat public trust registration', registrationRequired: true, taxBenefitApplicable: false }], regionalGrants: ['Gujarat State Grants'], reportingDeadlines: [{ name: 'Annual Return', dayOfYear: 270 }], federationLevel: 'state' },
    { stateCode: 'WB', stateName: 'West Bengal', countryCode: 'IN', localRegistrations: [], regionalGrants: ['WB State Welfare'], reportingDeadlines: [{ name: 'Annual Return', dayOfYear: 270 }], federationLevel: 'state' },
    { stateCode: 'UP', stateName: 'Uttar Pradesh', countryCode: 'IN', localRegistrations: [], regionalGrants: ['UP State Grants'], reportingDeadlines: [{ name: 'Annual Return', dayOfYear: 270 }], federationLevel: 'state' },
    { stateCode: 'RJ', stateName: 'Rajasthan', countryCode: 'IN', localRegistrations: [], regionalGrants: ['Rajasthan Welfare'], reportingDeadlines: [{ name: 'Annual Return', dayOfYear: 270 }], federationLevel: 'state' },
  ],
  US: [
    { stateCode: 'CA', stateName: 'California', countryCode: 'US', localRegistrations: [{ id: 'ca_ag', name: 'California AG Registration', description: 'Attorney General charitable registration', registrationRequired: true, renewalPeriodMonths: 12, taxBenefitApplicable: false }], regionalGrants: ['CA Community Foundation'], reportingDeadlines: [{ name: 'Form RRF-1', dayOfYear: 135 }], federationLevel: 'state' },
    { stateCode: 'NY', stateName: 'New York', countryCode: 'US', localRegistrations: [{ id: 'ny_charities', name: 'NY Charities Bureau', description: 'NY State charities registration', registrationRequired: true, renewalPeriodMonths: 12, taxBenefitApplicable: false }], regionalGrants: ['NY Community Trust'], reportingDeadlines: [{ name: 'CHAR500', dayOfYear: 135 }], federationLevel: 'state' },
    { stateCode: 'TX', stateName: 'Texas', countryCode: 'US', localRegistrations: [], regionalGrants: ['TX Foundation Grants'], reportingDeadlines: [], federationLevel: 'state' },
    { stateCode: 'FL', stateName: 'Florida', countryCode: 'US', localRegistrations: [{ id: 'fl_solicitation', name: 'FL Solicitation License', description: 'Florida charitable solicitation', registrationRequired: true, renewalPeriodMonths: 12, taxBenefitApplicable: false }], regionalGrants: [], reportingDeadlines: [{ name: 'Annual Report', dayOfYear: 105 }], federationLevel: 'state' },
  ],
  GB: [
    { stateCode: 'ENG', stateName: 'England', countryCode: 'GB', localRegistrations: [], regionalGrants: ['National Lottery Grants'], reportingDeadlines: [], federationLevel: 'region' },
    { stateCode: 'SCT', stateName: 'Scotland', countryCode: 'GB', localRegistrations: [{ id: 'oscr', name: 'OSCR Registration', description: 'Scottish Charity Regulator registration', registrationRequired: true, taxBenefitApplicable: false }], regionalGrants: ['Scottish Government Grants'], reportingDeadlines: [], federationLevel: 'region' },
    { stateCode: 'WLS', stateName: 'Wales', countryCode: 'GB', localRegistrations: [], regionalGrants: ['Welsh Government Grants'], reportingDeadlines: [], federationLevel: 'region' },
    { stateCode: 'NIR', stateName: 'Northern Ireland', countryCode: 'GB', localRegistrations: [{ id: 'ccni', name: 'CCNI Registration', description: 'Charity Commission NI registration', registrationRequired: true, taxBenefitApplicable: false }], regionalGrants: [], reportingDeadlines: [], federationLevel: 'region' },
  ],
  CA: [
    { stateCode: 'ON', stateName: 'Ontario', countryCode: 'CA', localRegistrations: [], regionalGrants: ['Ontario Trillium Foundation'], reportingDeadlines: [], federationLevel: 'state' },
    { stateCode: 'BC', stateName: 'British Columbia', countryCode: 'CA', localRegistrations: [], regionalGrants: ['BC Gaming Grants'], reportingDeadlines: [], federationLevel: 'state' },
    { stateCode: 'QC', stateName: 'Quebec', countryCode: 'CA', localRegistrations: [{ id: 'qc_reg', name: 'Revenu Québec', description: 'Quebec charity registration', registrationRequired: true, taxBenefitApplicable: false }], regionalGrants: ['Quebec Foundation Grants'], reportingDeadlines: [], federationLevel: 'state' },
    { stateCode: 'AB', stateName: 'Alberta', countryCode: 'CA', localRegistrations: [], regionalGrants: ['Alberta Foundation Grants'], reportingDeadlines: [], federationLevel: 'state' },
  ],
  AU: [
    { stateCode: 'NSW', stateName: 'New South Wales', countryCode: 'AU', localRegistrations: [{ id: 'nsw_fundraising', name: 'NSW Fundraising License', description: 'NSW charitable fundraising authority', registrationRequired: true, renewalPeriodMonths: 12, taxBenefitApplicable: false }], regionalGrants: ['NSW Community Grants'], reportingDeadlines: [], federationLevel: 'state' },
    { stateCode: 'VIC', stateName: 'Victoria', countryCode: 'AU', localRegistrations: [], regionalGrants: ['Victoria State Grants'], reportingDeadlines: [], federationLevel: 'state' },
    { stateCode: 'QLD', stateName: 'Queensland', countryCode: 'AU', localRegistrations: [], regionalGrants: ['QLD Community Grants'], reportingDeadlines: [], federationLevel: 'state' },
    { stateCode: 'WA', stateName: 'Western Australia', countryCode: 'AU', localRegistrations: [], regionalGrants: ['WA Lotterywest Grants'], reportingDeadlines: [], federationLevel: 'state' },
  ],
};

export const getCountryByCode = (code: string): CountryRules | undefined => {
  return countries.find(c => c.countryCode === code);
};

export const getStatesByCountry = (countryCode: string): StateRules[] => {
  return statesByCountry[countryCode] || [];
};

export const getStateByCode = (countryCode: string, stateCode: string): StateRules | undefined => {
  const states = statesByCountry[countryCode];
  return states?.find(s => s.stateCode === stateCode);
};
