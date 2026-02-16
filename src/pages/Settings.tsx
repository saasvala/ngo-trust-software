import { MainLayout } from "@/components/layout/MainLayout";
import { LocationSettings } from "@/components/settings/LocationSettings";
import { useRules } from "@/contexts/RuleContext";
import { Bell, Shield, Eye, EyeOff, LogOut, Globe, Building2, Clock, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { transparency, setTransparency, permissions, location, currentRole } = useRules();
  const isSuperAdmin = currentRole === 'super_admin';

  const handleLogout = () => {
    localStorage.removeItem('ngo_location_config');
    localStorage.removeItem('ngo_current_role');
    window.location.href = '/login';
  };

  return (
    <MainLayout title="Settings" subtitle="Configure your NGO software">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Configuration - Super Admin Only */}
        <LocationSettings />

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
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${transparency.enabled ? "left-7" : "left-1"}`} />
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
                      className={`relative w-10 h-5 rounded-full transition-colors ${transparency[item.key as keyof typeof transparency] ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${transparency[item.key as keyof typeof transparency] ? "left-5" : "left-0.5"}`} />
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
                    <p className="text-xs text-muted-foreground mt-1">Renewal: Every {ct.renewalPeriodMonths / 12} years</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Configure location to see compliance requirements</p>
          )}
        </div>

        {/* Tenant Branding */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/20">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Tenant Branding</h3>
              <p className="text-sm text-muted-foreground">Customize your organization appearance</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Organization Name", value: "Demo NGO Foundation", editable: true },
              { label: "Logo", value: "Default logo active", editable: true },
              { label: "Favicon", value: "Default favicon", editable: true },
              { label: "Primary Color", value: "System default", editable: true },
              { label: "Tenant ID", value: "TNT-DEMO-001", editable: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
                {item.editable && <button className="text-xs text-primary hover:underline">Edit</button>}
              </div>
            ))}
          </div>
        </div>

        {/* Globalization */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-teal/20">
              <Globe className="w-5 h-5 text-teal" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Globalization</h3>
              <p className="text-sm text-muted-foreground">Timezone, locale and language settings</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Timezone", value: location.country?.countryCode === 'IN' ? 'Asia/Kolkata (IST)' : 'UTC', icon: Clock },
              { label: "Date Format", value: location.country?.countryCode === 'IN' ? 'DD/MM/YYYY' : 'MM/DD/YYYY', icon: Clock },
              { label: "Number Format", value: location.country?.countryCode === 'IN' ? '12,34,567.89' : '1,234,567.89', icon: Globe },
              { label: "Fiscal Year", value: location.country?.fiscalYear.label || 'January - December', icon: Clock },
              { label: "Language", value: "English (System default)", icon: Languages },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                <button className={`relative w-10 h-5 rounded-full transition-colors ${item.enabled ? "bg-primary" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${item.enabled ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Flags */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-warning/20">
              <Shield className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Feature Flags</h3>
              <p className="text-sm text-muted-foreground">Tenant-level feature toggles</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Multi-Currency Support", enabled: true, plan: "Pro" },
              { label: "AI Suggestions", enabled: true, plan: "Pro" },
              { label: "Federation Module", enabled: false, plan: "Enterprise" },
              { label: "Offline Mode", enabled: false, plan: "Enterprise" },
              { label: "Advanced Report Builder", enabled: true, plan: "Pro" },
              { label: "Government API Filing", enabled: false, plan: "Enterprise" },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${f.enabled ? 'bg-success' : 'bg-muted'}`} />
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                </div>
                <span className="text-xs text-muted-foreground">{f.plan}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <LogOut className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Exit Demo</h3>
                  <p className="text-sm text-muted-foreground">Return to role selection screen</p>
                </div>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                Exit Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
