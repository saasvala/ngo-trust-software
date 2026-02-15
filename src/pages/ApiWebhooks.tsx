import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Webhook, Key, Zap, BarChart3, Clock, Copy, Plus, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const apiTokens = [
  { id: "tk_live_abc123", name: "Production API", createdAt: "2026-01-10", expiresAt: "2026-07-10", lastUsed: "2 min ago", calls: 45200, rateLimit: 1000 },
  { id: "tk_test_def456", name: "Staging API", createdAt: "2026-02-01", expiresAt: "2026-08-01", lastUsed: "1 hour ago", calls: 8900, rateLimit: 500 },
  { id: "tk_int_ghi789", name: "Integration Partner", createdAt: "2025-12-15", expiresAt: "2026-06-15", lastUsed: "3 days ago", calls: 2100, rateLimit: 200 },
];

const webhooks = [
  { id: "WH-001", name: "Donation Created", url: "https://api.partner.org/hooks/donation", events: ["donation.created"], status: "active", lastTriggered: "5 min ago", successRate: 99.2 },
  { id: "WH-002", name: "Expense Approved", url: "https://accounting.ngo.org/webhook", events: ["expense.approved", "expense.rejected"], status: "active", lastTriggered: "2 hours ago", successRate: 100 },
  { id: "WH-003", name: "Compliance Expiring", url: "https://alerts.ngo.org/compliance", events: ["compliance.expiring"], status: "paused", lastTriggered: "1 day ago", successRate: 97.5 },
];

const webhookLogs = [
  { id: "WHL-901", webhookId: "WH-001", event: "donation.created", status: "delivered", responseCode: 200, attempt: 1, time: "5 min ago" },
  { id: "WHL-900", webhookId: "WH-002", event: "expense.approved", status: "delivered", responseCode: 200, attempt: 1, time: "2 hours ago" },
  { id: "WHL-899", webhookId: "WH-001", event: "donation.created", status: "failed", responseCode: 500, attempt: 3, time: "6 hours ago" },
  { id: "WHL-898", webhookId: "WH-003", event: "compliance.expiring", status: "delivered", responseCode: 200, attempt: 1, time: "1 day ago" },
];

const ApiWebhooks = () => {
  return (
    <MainLayout title="API & Webhook Engine" subtitle="Token management, rate limiting, and event-driven webhooks">
      <div className="space-y-8">
        <DashboardSection level="macro" title="API & Webhook Engine" subtitle="Secure token management, rate limiting, and event-driven webhooks" icon={<Webhook className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Active Tokens" value={3} icon={<Key className="w-6 h-6 text-white" />} iconBg="primary" change="All valid" trend="up" />
            <StatCard3D title="API Calls Today" value={56300} icon={<Zap className="w-6 h-6 text-white" />} iconBg="teal" change="+18% vs avg" trend="up" />
            <StatCard3D title="Webhooks Active" value={2} suffix="/3" icon={<Webhook className="w-6 h-6 text-white" />} iconBg="success" change="1 paused" trend="neutral" />
            <StatCard3D title="Delivery Rate" value={98.9} suffix="%" icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="coral" change="3 retries today" trend="up" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="API Token Management" subtitle="Generate and manage secure API tokens" icon={<Key className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-2">
            <div className="flex justify-end mb-4">
              <Button size="sm" onClick={() => toast.success("New API token generated")}>
                <Plus className="w-4 h-4 mr-2" />Generate Token
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Token</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Expires</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Rate Limit</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Calls</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Used</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiTokens.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-3 px-4 font-medium">{t.name}</td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {t.id.slice(0, 12)}...
                        <button onClick={() => { navigator.clipboard.writeText(t.id); toast.success("Copied"); }} className="ml-2 text-muted-foreground hover:text-foreground">
                          <Copy className="w-3 h-3 inline" />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{t.expiresAt}</td>
                      <td className="py-3 px-4">{t.rateLimit}/min</td>
                      <td className="py-3 px-4">{t.calls.toLocaleString()}</td>
                      <td className="py-3 px-4 text-muted-foreground">{t.lastUsed}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Token rotated")}>
                          <RefreshCw className="w-3 h-3 mr-1" />Rotate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Webhook Configuration" subtitle="Event-based triggers with retry queue" icon={<Webhook className="w-5 h-5 text-teal" />} defaultExpanded={true}>
          <div className="space-y-3">
            <div className="flex justify-end mb-2">
              <Button variant="outline" size="sm" onClick={() => toast.success("Webhook creator opened")}>
                <Plus className="w-4 h-4 mr-2" />Create Webhook
              </Button>
            </div>
            {webhooks.map((w) => (
              <div key={w.id} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{w.name}</p>
                      <Badge variant={w.status === 'active' ? 'default' : 'secondary'} className={w.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-0' : ''}>{w.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{w.url}</p>
                    <div className="flex gap-1 mt-2">
                      {w.events.map((e) => (
                        <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{w.successRate}% delivery</p>
                    <p className="text-xs text-muted-foreground">Last: {w.lastTriggered}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Webhook Delivery Logs" subtitle="Complete delivery audit trail" icon={<BarChart3 className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Delivery Logs" subtitle="Recent webhook delivery attempts" onExport={() => toast.success("Logs exported")}>
            <div className="space-y-2">
              {webhookLogs.map((l) => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    {l.status === 'delivered' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">{l.event}</p>
                      <p className="text-xs text-muted-foreground">→ {l.webhookId} · Attempt {l.attempt} · HTTP {l.responseCode}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{l.time}</span>
                </div>
              ))}
            </div>
          </DeepResearchView>
        </DashboardSection>
      </div>
    </MainLayout>
  );
};

export default ApiWebhooks;
