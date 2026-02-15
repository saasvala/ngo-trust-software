import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Shield, Lock, Fingerprint, Globe, Monitor, AlertTriangle, Clock, Users, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const securityEvents = [
  { type: "Failed Login", source: "IP 103.24.x.x", user: "unknown", time: "5 min ago", severity: "high", action: "Account locked after 5 attempts" },
  { type: "Suspicious Login", source: "IP 45.67.x.x (New device)", user: "admin@ngo.org", time: "22 min ago", severity: "medium", action: "2FA verification sent" },
  { type: "Session Expired", source: "Chrome/Windows", user: "operator@ngo.org", time: "1 hour ago", severity: "low", action: "Re-authentication required" },
  { type: "API Rate Limit", source: "Token: tk_int_ghi789", user: "integration", time: "2 hours ago", severity: "medium", action: "Request throttled" },
  { type: "Bulk Export", source: "Reports module", user: "accountant@ngo.org", time: "3 hours ago", severity: "info", action: "Audit log recorded" },
];

const activeSessions = [
  { user: "admin@ngo.org", device: "Chrome · macOS", ip: "192.168.1.x", location: "Mumbai, IN", loginTime: "Today 09:15", status: "active" },
  { user: "accountant@ngo.org", device: "Firefox · Windows", ip: "10.0.0.x", location: "Delhi, IN", loginTime: "Today 10:30", status: "active" },
  { user: "operator@ngo.org", device: "Safari · iOS", ip: "172.16.0.x", location: "Bangalore, IN", loginTime: "Today 11:45", status: "idle" },
];

const securityPolicies = [
  { name: "Two-Factor Authentication", description: "Require 2FA for all admin roles", enabled: true },
  { name: "Session Timeout", description: "Auto-logout after 30 minutes of inactivity", enabled: true },
  { name: "IP Restriction", description: "Restrict access to whitelisted IP ranges", enabled: false },
  { name: "Failed Login Lockout", description: "Lock account after 5 failed login attempts for 30 minutes", enabled: true },
  { name: "Device Tracking", description: "Track and alert on new device logins", enabled: true },
  { name: "Export Audit Logging", description: "Log all data export operations", enabled: true },
];

const SecurityAdmin = () => {
  return (
    <MainLayout title="Security Hardening" subtitle="Authentication, session management, and threat monitoring">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Security Hardening" subtitle="Advanced authentication, session management, and threat monitoring" icon={<Shield className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="2FA Enabled" value={92} suffix="%" icon={<Fingerprint className="w-6 h-6 text-white" />} iconBg="success" change="Of admin users" trend="up" />
            <StatCard3D title="Active Sessions" value={24} icon={<Monitor className="w-6 h-6 text-white" />} iconBg="primary" change="3 idle" trend="neutral" />
            <StatCard3D title="Blocked Attempts" value={47} icon={<Lock className="w-6 h-6 text-white" />} iconBg="coral" change="This month" trend="down" />
            <StatCard3D title="Security Score" value={94} suffix="/100" icon={<Shield className="w-6 h-6 text-white" />} iconBg="teal" change="+2 vs last month" trend="up" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Security Policies" subtitle="Toggle and configure security rules" icon={<Lock className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {securityPolicies.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
                <Switch defaultChecked={p.enabled} onCheckedChange={(checked) => toast.success(`${p.name} ${checked ? 'enabled' : 'disabled'}`)} />
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Active Sessions & Device Tracking" subtitle="Currently authenticated sessions" icon={<Monitor className="w-5 h-5 text-teal" />} defaultExpanded={true}>
          <div className="space-y-3">
            {activeSessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <div>
                    <p className="font-medium text-foreground">{s.user}</p>
                    <p className="text-xs text-muted-foreground">{s.device} · {s.ip}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{s.location}</p>
                  <p className="text-xs text-muted-foreground">{s.loginTime}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Security Event Log" subtitle="Comprehensive threat and access audit trail" icon={<AlertTriangle className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Security Events" subtitle="Recent security incidents and actions" onExport={() => toast.success("Security log exported")}>
            <div className="space-y-2">
              {securityEvents.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${e.severity === 'high' ? 'bg-red-400' : e.severity === 'medium' ? 'bg-amber-400' : e.severity === 'low' ? 'bg-blue-400' : 'bg-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{e.type}</p>
                      <p className="text-xs text-muted-foreground">{e.source} · {e.user}</p>
                      <p className="text-xs text-muted-foreground italic">{e.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={e.severity === 'high' ? 'bg-red-500/20 text-red-400 border-0' : e.severity === 'medium' ? 'bg-amber-500/20 text-amber-400 border-0' : 'bg-blue-500/20 text-blue-400 border-0'}>
                      {e.severity}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </DeepResearchView>
        </DashboardSection>
      </div>
    </MainLayout>
  );
};

export default SecurityAdmin;
