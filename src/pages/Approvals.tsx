import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { CheckSquare, Clock, CheckCircle, XCircle, AlertTriangle, Activity } from "lucide-react";

const approvals = [
  { item: "Expense - Travel to Rampur", amount: 12500, requestedBy: "Operator Raj", date: "Today", status: "pending" },
  { item: "Expense - Office Supplies", amount: 4800, requestedBy: "Operator Meena", date: "Today", status: "pending" },
  { item: "Fund Transfer - Project Alpha", amount: 250000, requestedBy: "PM Sharma", date: "Yesterday", status: "approved" },
  { item: "Vendor Payment - PrintHub", amount: 35000, requestedBy: "Accountant Verma", date: "Yesterday", status: "rejected" },
];

const Approvals = () => {
  return (
    <MainLayout title="Approval Workflow" subtitle="Multi-stage approval engine for expenses, transfers and actions">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Approval Queue" subtitle="Pending approvals and workflow metrics" icon={<CheckSquare className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Pending Approvals" value={8} icon={<Clock className="w-6 h-6 text-white" />} iconBg="warning" change="3 urgent" trend="neutral" />
            <StatCard3D title="Approved Today" value={5} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change="₹4.2L total" trend="up" />
            <StatCard3D title="Rejected" value={1} icon={<XCircle className="w-6 h-6 text-white" />} iconBg="coral" change="This week" trend="neutral" />
            <StatCard3D title="Avg Turnaround" value={1.4} suffix=" days" icon={<Activity className="w-6 h-6 text-white" />} iconBg="primary" change="Within SLA" trend="up" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Approval Items" subtitle="All pending and recent approval actions" icon={<CheckSquare className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {approvals.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.item}</p>
                  <p className="text-xs text-muted-foreground">₹{a.amount.toLocaleString()} · {a.requestedBy} · {a.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === 'approved' ? 'bg-success/20 text-emerald-400' : a.status === 'rejected' ? 'bg-coral/20 text-coral' : 'bg-warning/20 text-warning'}`}>
                    {a.status}
                  </span>
                  {a.status === 'pending' && (
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg bg-success/20 hover:bg-success/30 transition-colors"><CheckCircle className="w-4 h-4 text-success" /></button>
                      <button className="p-1.5 rounded-lg bg-coral/20 hover:bg-coral/30 transition-colors"><XCircle className="w-4 h-4 text-coral" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Workflow Rules" subtitle="Active automation rules for approvals" icon={<AlertTriangle className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {[
              { rule: "Auto-approve expenses < ₹5,000", trigger: "Amount threshold", status: "active" },
              { rule: "Require dual approval > ₹1,00,000", trigger: "Amount threshold", status: "active" },
              { rule: "Escalate if pending > 48 hours", trigger: "Time-based", status: "active" },
              { rule: "Block if project budget exceeded", trigger: "Budget check", status: "active" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.rule}</p>
                  <p className="text-xs text-muted-foreground">Trigger: {r.trigger}</p>
                </div>
                <span className="badge-success">{r.status}</span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Approval Analytics" subtitle="Historical workflow performance" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Workflow Intelligence" subtitle="Approval patterns and bottleneck analysis" onExport={() => {}}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Processed", value: "2,847" },
                { label: "Avg Approval Time", value: "1.2 days" },
                { label: "Auto-Approved", value: "34%" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </DeepResearchView>
        </DashboardSection>
      </div>
    </MainLayout>
  );
};

export default Approvals;
