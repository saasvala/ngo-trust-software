import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useRules } from "@/contexts/RuleContext";
import { countries, getStatesByCountry } from "@/lib/data/countries";
import { 
  Globe, 
  MapPin, 
  Building2, 
  Shield, 
  Eye, 
  EyeOff, 
  Bell, 
  Lock,
  Save,
  RefreshCw
} from "lucide-react";

const Settings = () => {
  const { 
    location, 
    transparency, 
    permissions, 
    setCountry, 
    setState, 
    setTransparency,
    isSetupComplete 
  } = useRules();

  const [editingLocation, setEditingLocation] = useState(false);
  const states = location.country ? getStatesByCountry(location.country.countryCode) : [];

  const getCountryFlag = (code: string): string => {
    const flags: Record<string, string> = { IN: '🇮🇳', US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺' };
    return flags[code] || '🌍';
  };

  return (
    <MainLayout title="Settings" subtitle="Configure your NGO software">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Configuration */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Location Configuration</h3>
                <p className="text-sm text-muted-foreground">Country & state determine all rules</p>
              </div>
            </div>
            {permissions?.canConfigureLocation && (
              <button
                onClick={() => setEditingLocation(!editingLocation)}
                className="text-sm text-primary hover:underline"
              >
                {editingLocation ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>

          {!editingLocation ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCountryFlag(location.country?.countryCode || '')}</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium text-foreground">{location.country?.countryName || 'Not configured'}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">State / Region</p>
                    <p className="font-medium text-foreground">{location.state?.stateName || 'Not configured'}</p>
                  </div>
                </div>
              </div>
              {location.country && (
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-2">Active Features</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs">
                      {location.country.currency.symbol} {location.country.currency.code}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-teal/20 text-teal text-xs">
                      {location.country.fiscalYear.label}
                    </span>
                    {location.country.complianceTypes.slice(0, 2).map(ct => (
                      <span key={ct.id} className="px-2 py-1 rounded-full bg-coral/20 text-coral text-xs">
                        {ct.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                <select
                  value={location.country?.countryCode || ''}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full input-dark"
                >
                  <option value="">Select country</option>
                  {countries.map(c => (
                    <option key={c.countryCode} value={c.countryCode}>
                      {getCountryFlag(c.countryCode)} {c.countryName}
                    </option>
                  ))}
                </select>
              </div>
              {location.country && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">State / Region</label>
                  <select
                    value={location.state?.stateCode || ''}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full input-dark"
                  >
                    <option value="">Select state</option>
                    {states.map(s => (
                      <option key={s.stateCode} value={s.stateCode}>{s.stateName}</option>
                    ))}
                  </select>
                </div>
              )}
              <button
                onClick={() => setEditingLocation(false)}
                className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Location
              </button>
            </div>
          )}

          {!permissions?.canConfigureLocation && (
            <div className="mt-4 p-3 rounded-lg bg-secondary/50 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              Only Super Admin can change location
            </div>
          )}
        </div>

        {/* Transparency Portal */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-teal/20">
              {transparency.enabled ? <Eye className="w-5 h-5 text-teal" /> : <EyeOff className="w-5 h-5 text-teal" />}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Public Transparency Portal</h3>
              <p className="text-sm text-muted-foreground">Control public visibility of your NGO</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Main Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="font-medium text-foreground">Enable Transparency</p>
                <p className="text-xs text-muted-foreground">Make NGO profile publicly visible</p>
              </div>
              <button
                onClick={() => setTransparency({ enabled: !transparency.enabled })}
                disabled={!permissions?.canToggleTransparency}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  transparency.enabled ? "bg-primary" : "bg-muted"
                } ${!permissions?.canToggleTransparency ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    transparency.enabled ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            {transparency.enabled && (
              <>
                {[
                  { key: 'showProfile', label: 'NGO Profile' },
                  { key: 'showProjects', label: 'Projects' },
                  { key: 'showUtilization', label: 'Fund Utilization %' },
                  { key: 'showImpactMetrics', label: 'Impact Metrics' },
                  { key: 'showAnnualReports', label: 'Annual Reports' },
                  { key: 'showCertificates', label: 'Certificates' },
                  { key: 'seoEnabled', label: 'SEO Optimization' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-secondary/30">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <button
                      onClick={() => setTransparency({ [item.key]: !transparency[item.key as keyof typeof transparency] })}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        transparency[item.key as keyof typeof transparency] ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          transparency[item.key as keyof typeof transparency] ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Compliance Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-coral/20">
              <Shield className="w-5 h-5 text-coral" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Compliance Configuration</h3>
              <p className="text-sm text-muted-foreground">Auto-generated based on location</p>
            </div>
          </div>

          {location.country ? (
            <div className="space-y-3">
              {location.country.complianceTypes.map(ct => (
                <div key={ct.id} className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{ct.name}</p>
                    {ct.taxBenefitApplicable && (
                      <span className="px-2 py-0.5 rounded-full bg-teal/20 text-teal text-xs">Tax Benefit</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{ct.description}</p>
                  {ct.renewalPeriodMonths && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Renewal: Every {ct.renewalPeriodMonths / 12} years
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Configure location to see compliance requirements</p>
          )}
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/20">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground">How you receive alerts</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Email Notifications', description: 'Compliance and deadline alerts', enabled: true },
              { label: 'SMS Alerts', description: 'Critical notifications via SMS', enabled: false },
              { label: 'WhatsApp Updates', description: 'Donation and report updates', enabled: true },
              { label: 'Browser Notifications', description: 'Real-time in-app alerts', enabled: true },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <button
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    item.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      item.enabled ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
