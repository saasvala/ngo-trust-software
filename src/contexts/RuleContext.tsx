import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocationConfig, CountryRules, StateRules, CityRules, AppRole, RolePermissions, TransparencySettings } from '@/lib/types/rules';
import { getCountryByCode, getStateByCode } from '@/lib/data/countries';
import { getRolePermissions } from '@/lib/data/roles';

interface RuleContextType {
  location: LocationConfig;
  currentRole: AppRole;
  permissions: RolePermissions | null;
  transparency: TransparencySettings;
  isSetupComplete: boolean;
  setCountry: (countryCode: string) => void;
  setState: (stateCode: string) => void;
  setCity: (city: CityRules | null) => void;
  completeSetup: () => void;
  setRole: (role: AppRole) => void;
  setTransparency: (settings: Partial<TransparencySettings>) => void;
  formatCurrency: (amount: number) => string;
  getFiscalYearLabel: () => string;
  getAuditorName: () => string;
}

const defaultLocation: LocationConfig = {
  country: null,
  state: null,
  city: null,
  isConfigured: false,
};

const defaultTransparency: TransparencySettings = {
  enabled: false,
  showProfile: true,
  showProjects: true,
  showUtilization: true,
  showImpactMetrics: true,
  showAnnualReports: true,
  showCertificates: true,
  seoEnabled: true,
};

const RuleContext = createContext<RuleContextType | undefined>(undefined);

const STORAGE_KEY = 'ngo_location_config';
const ROLE_KEY = 'ngo_current_role';
const TRANSPARENCY_KEY = 'ngo_transparency';

export const RuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultLocation;
      }
    }
    return defaultLocation;
  });

  const [currentRole, setCurrentRole] = useState<AppRole>(() => {
    const stored = localStorage.getItem(ROLE_KEY);
    return (stored as AppRole) || 'ngo_admin';
  });

  const [transparency, setTransparencyState] = useState<TransparencySettings>(() => {
    const stored = localStorage.getItem(TRANSPARENCY_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultTransparency;
      }
    }
    return defaultTransparency;
  });

  const [permissions, setPermissions] = useState<RolePermissions | null>(() => {
    return getRolePermissions(currentRole) || null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, currentRole);
    setPermissions(getRolePermissions(currentRole) || null);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(TRANSPARENCY_KEY, JSON.stringify(transparency));
  }, [transparency]);

  const setCountry = (countryCode: string) => {
    const country = getCountryByCode(countryCode);
    if (country) {
      setLocation(prev => ({
        ...prev,
        country,
        state: null,
        city: null,
      }));
    }
  };

  const setState = (stateCode: string) => {
    if (!location.country) return;
    const state = getStateByCode(location.country.countryCode, stateCode);
    if (state) {
      setLocation(prev => ({
        ...prev,
        state,
        city: null,
      }));
    }
  };

  const setCity = (city: CityRules | null) => {
    setLocation(prev => ({
      ...prev,
      city,
    }));
  };

  const completeSetup = () => {
    if (location.country && location.state) {
      setLocation(prev => ({
        ...prev,
        isConfigured: true,
        configuredAt: new Date().toISOString(),
      }));
    }
  };

  const setRole = (role: AppRole) => {
    setCurrentRole(role);
  };

  const setTransparency = (settings: Partial<TransparencySettings>) => {
    setTransparencyState(prev => ({
      ...prev,
      ...settings,
    }));
  };

  const formatCurrency = (amount: number): string => {
    if (!location.country) return amount.toFixed(2);
    const { currency } = location.country;
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces,
    }).format(amount);
  };

  const getFiscalYearLabel = (): string => {
    return location.country?.fiscalYear.label || 'January - December';
  };

  const getAuditorName = (): string => {
    return location.country?.auditorRoleName || 'Auditor';
  };

  const isSetupComplete = location.isConfigured && !!location.country && !!location.state;

  return (
    <RuleContext.Provider
      value={{
        location,
        currentRole,
        permissions,
        transparency,
        isSetupComplete,
        setCountry,
        setState,
        setCity,
        completeSetup,
        setRole,
        setTransparency,
        formatCurrency,
        getFiscalYearLabel,
        getAuditorName,
      }}
    >
      {children}
    </RuleContext.Provider>
  );
};

export const useRules = (): RuleContextType => {
  const context = useContext(RuleContext);
  if (!context) {
    throw new Error('useRules must be used within a RuleProvider');
  }
  return context;
};
