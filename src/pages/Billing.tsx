import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { CreditCard, Users, TrendingUp, Receipt, Star, Clock, Download, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const plans = [
  { name: "Free", price: 0, tenants: 12, features: ["5 users", "1 project", "Basic reports", "Community support"], color: "text-muted-foreground" },
  { name: "Pro", price: 49, tenants: 18, features: ["25 users", "10 projects", "Advanced reports", "Priority support", "API access", "Webhooks"], color: "text-primary" },
  { name: "Enterprise", price: 199, tenants: 8, features: ["Unlimited users", "Unlimited projects", "Custom reports", "Dedicated support", "Full API", "Webhooks", "SSO", "Audit logs"], color: "text-coral" },
];

const subscriptions = [
  { tenant: "Global Relief Foundation", plan: "Enterprise", status: "active", renewDate: "2026-04-15", mrr: 199, users: 124 },
  { tenant: "Education First India", plan: "Pro", status: "active", renewDate: "2026-03-22", mrr: 49, users: 87 },
  { tenant: "Green Earth UK", plan: "Pro", status: "expiring", renewDate: "2026-02-28", mrr: 49, users: 56 },
  { tenant: "Hope Alliance Canada", plan: "Free", status: "active", renewDate: "—", mrr: 0, users: 34 },
  { tenant: "Child Future Australia", plan: "Pro", status: "active", renewDate: "2026-05-10", mrr: 49, users: 21 },
  { tenant: "Water for All Africa", plan: "Enterprise", status: "past_due", renewDate: "2026-02-01", mrr: 199, users: 92 },
];

const invoices = [
  { id: "INV-2026-045", tenant: "Global Relief Foundation", amount: 199, status: "paid", date: "2026-02-01" },
  { id: "INV-2026-044", tenant: "Education First India", amount: 49, status: "paid", date: "2026-02-01" },
  { id: "INV-2026-043", tenant: "Water for All Africa", amount: 199, status: "overdue", date: "2026-02-01" },
  { id: "INV-2026-042", tenant: "Green Earth UK", amount: 49, status: "paid", date: "2026-02-01" },
];

const Billing = () => {
  const totalMrr = subscriptions.reduce((s, t) => s + t.mrr, 0);

  return (
    <MainLayout title="Subscription & Billing" subtitle="SaaS plan management, invoicing, and revenue tracking">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Subscription & Billing Engine" subtitle="SaaS plan management, invoicing, and revenue tracking" icon={<CreditCard className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Monthly Revenue" value={totalMrr} prefix="$" icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="success" change="+12% MoM" trend="up" />
            <StatCard3D title="Active Tenants" value={38} icon={<Users className="w-6 h-6 text-white" />} iconBg="primary" change="+3 this month" trend="up" />
            <StatCard3D title="Pro Plans" value={18} icon={<Star className="w-6 h-6 text-white" />} iconBg="teal" change="47% of tenants" trend="up" />
            <StatCard3D title="Overdue Invoices" value={1} icon={<Receipt className="w-6 h-6 text-white" />} iconBg="coral" change="$199 outstanding" trend="down" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Plan Overview" subtitle="Feature flags per subscription tier" icon={<Star className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => (
              <div key={p.name} className="p-5 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${p.color}`}>{p.name}</h3>
                  <span className="text-2xl font-bold text-foreground">{p.price > 0 ? `$${p.price}` : 'Free'}<span className="text-xs text-muted-foreground">/mo</span></span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{p.tenants} active tenants</p>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Tenant Subscriptions" subtitle="Status, renewal dates, and payment tracking" icon={<Users className="w-5 h-5 text-teal" />} defaultExpanded={true}>
          <div className="space-y-3">
            {subscriptions.map((s) => (
              <div key={s.tenant} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-medium text-foreground">{s.tenant}</p>
                  <p className="text-xs text-muted-foreground">{s.users} users · Renews {s.renewDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{s.plan}</Badge>
                  <Badge className={s.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-0' : s.status === 'expiring' ? 'bg-amber-500/20 text-amber-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                    {s.status}
                  </Badge>
                  {s.mrr > 0 && <span className="text-sm font-medium text-foreground">${s.mrr}/mo</span>}
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Invoice History & Revenue" subtitle="Payment history and revenue analytics" icon={<Receipt className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Revenue Analytics" subtitle="MRR trends and invoice tracking" onExport={() => toast.success("Billing report exported")}>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Annual Revenue", value: `$${(totalMrr * 12).toLocaleString()}` },
                  { label: "Avg Revenue/Tenant", value: `$${Math.round(totalMrr / 38)}` },
                  { label: "Churn Rate", value: "2.1%" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Recent Invoices</h4>
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="text-sm font-medium text-foreground">{inv.id}</p>
                      <p className="text-xs text-muted-foreground">{inv.tenant} · {inv.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">${inv.amount}</span>
                      <Badge className={inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>{inv.status}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => toast.success(`Invoice ${inv.id} downloaded`)}>
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DeepResearchView>
        </DashboardSection>
      </div>
    </MainLayout>
  );
};

export default Billing;
