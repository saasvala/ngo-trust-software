import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { ConfirmActionDialog } from "@/components/common/ConfirmActionDialog";
import { EmptyState } from "@/components/common/StateBlocks";
import { notify } from "@/lib/notify";
import { CheckSquare, Clock, CheckCircle, XCircle, AlertTriangle, Activity, GitBranch, ArrowRight } from "lucide-react";

type ApprovalItem = {
  item: string;
  amount: number;
  requestedBy: string;
  date: string;
  status: string;
  level: string;
  chain: string[];
  rejectionReason?: string;
};

const approvals: ApprovalItem[] = [
  { item: "Expense - Travel to Rampur", amount: 12500, requestedBy: "Operator Raj", date: "Today", status: "pending", level: "Level 1 (Accountant)", chain: ["Accountant", "NGO Admin"] },
  { item: "Expense - Office Supplies", amount: 4800, requestedBy: "Operator Meena", date: "Today", status: "pending", level: "Auto-approved", chain: ["System"] },
  { item: "Fund Transfer - Project Alpha", amount: 250000, requestedBy: "PM Sharma", date: "Yesterday", status: "approved", level: "Level 2 (Admin)", chain: ["Accountant", "NGO Admin", "Super Admin"] },
  { item: "Vendor Payment - PrintHub", amount: 35000, requestedBy: "Accountant Verma", date: "Yesterday", status: "rejected", level: "Level 1 (Admin)", chain: ["NGO Admin"], rejectionReason: "Vendor not in approved list" },
  { item: "Grant Disbursement - UNICEF Q2", amount: 1250000, requestedBy: "PM Sharma", date: "2 days ago", status: "pending", level: "Level 3 (Super Admin)", chain: ["Accountant", "NGO Admin", "Super Admin"] },
];

const workflowRules = [
  { rule: "Auto-approve expenses < ₹5,000", trigger: "Amount threshold", routing: "Direct → System auto-approve", status: "active" },
  { rule: "Single approval ₹5K–₹50K", trigger: "Amount threshold", routing: "Operator → Accountant", status: "active" },
  { rule: "Dual approval ₹50K–₹2L", trigger: "Amount threshold", routing: "Operator → Accountant → NGO Admin", status: "active" },
  { rule: "Triple approval > ₹2L", trigger: "Amount threshold", routing: "Operator → Accountant → NGO Admin → Super Admin", status: "active" },
  { rule: "Escalate if pending > 48 hours", trigger: "Time-based", routing: "Auto-escalate to next level", status: "active" },
  { rule: "Block if project budget exceeded", trigger: "Budget check", routing: "Block + alert PM + Admin", status: "active" },
  { rule: "Rejection requires reason", trigger: "Status change", routing: "Mandatory text field on reject", status: "active" },
];

const timeline = [
  { step: "Submitted", user: "PM Sharma", time: "Feb 14, 10:30 AM", status: "done" },
  { step: "Level 1 Approved", user: "Accountant Verma", time: "Feb 14, 2:15 PM", status: "done" },
  { step: "Level 2 Approved", user: "NGO Admin", time: "Feb 15, 9:00 AM", status: "done" },
  { step: "Level 3 Pending", user: "Super Admin", time: "Awaiting", status: "pending" },
];

const Approvals = () => {
  const [items, setItems] = useState(approvals);
  const [confirm, setConfirm] = useState<
    { index: number; mode: "approve" | "reject" } | null
  >(null);

  const active = confirm !== null ? items[confirm.index] : null;

  const decide = (index: number, mode: "approve" | "reject", reason: string) => {
    setItems((prev) =>
      prev.map((a, i) =>
        i === index
          ? {
              ...a,
              status: mode === "approve" ? "approved" : "rejected",
              ...(mode === "reject" ? { rejectionReason: reason } : {}),
            }
          : a,
      ),
    );
    if (mode === "approve") {
      notify.success(`${items[index].item} approved`, {
        description: "Moved to the next approval level and written to the audit log.",
      });
    } else {
      notify.warning(`${items[index].item} rejected`, {
        description: `Reason logged: ${reason}`,
      });
    }
  };

  return (
    <MainLayout title="Approval Workflow" subtitle="Multi-level dynamic approval engine with condition-based routing">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Approval Queue" subtitle="Pending approvals and workflow metrics" icon={<CheckSquare className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Pending Approvals" value={8} icon={<Clock className="w-6 h-6 text-white" />} iconBg="warning" change="3 urgent" trend="neutral" />
            <StatCard3D title="Approved Today" value={5} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change="₹4.2L total" trend="up" />
            <StatCard3D title="Rejected" value={1} icon={<XCircle className="w-6 h-6 text-white" />} iconBg="coral" change="Reason logged" trend="neutral" />
            <StatCard3D title="Avg Turnaround" value={1.4} suffix=" days" icon={<Activity className="w-6 h-6 text-white" />} iconBg="primary" change="Within SLA" trend="up" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Approval Items" subtitle="All pending and recent approval actions with chain visibility" icon={<CheckSquare className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          {items.length === 0 ? (
            <EmptyState
              icon={<CheckSquare className="w-6 h-6 text-muted-foreground" />}
              title="Nothing waiting on you"
              description="New expense, transfer and grant requests will appear here as soon as they are submitted."
            />
          ) : (
          <div className="space-y-3">
            {items.map((a, i) => (
              <div key={i} className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
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
                        <button onClick={() => setConfirm({ index: i, mode: "approve" })} aria-label={`Approve ${a.item}`} className="p-1.5 rounded-lg bg-success/20 hover:bg-success/30 transition-colors"><CheckCircle className="w-4 h-4 text-success" aria-hidden="true" /></button>
                        <button onClick={() => setConfirm({ index: i, mode: "reject" })} aria-label={`Reject ${a.item}`} className="p-1.5 rounded-lg bg-coral/20 hover:bg-coral/30 transition-colors"><XCircle className="w-4 h-4 text-coral" aria-hidden="true" /></button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-muted-foreground">Chain:</span>
                  {a.chain.map((step, j) => (
                    <span key={j} className="flex items-center gap-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-foreground">{step}</span>
                      {j < a.chain.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                    </span>
                  ))}
                </div>
                {a.rejectionReason && (
                  <p className="text-xs text-coral mt-2">Reason: {a.rejectionReason}</p>
                )}
              </div>
            ))}
          </div>
          )}
        </DashboardSection>

        <DashboardSection level="nano" title="Approval Timeline" subtitle="Step-by-step view of a multi-level approval" icon={<GitBranch className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="relative pl-6">
            {timeline.map((t, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                <div className={`absolute left-[-18px] w-3 h-3 rounded-full ${t.status === 'done' ? 'bg-success' : 'bg-warning'}`} />
                {i < timeline.length - 1 && <div className="absolute left-[-13px] top-3 w-0.5 h-full bg-border" />}
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-sm font-medium text-foreground">{t.step}</p>
                  <p className="text-xs text-muted-foreground">{t.user} · {t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Workflow Rules" subtitle="Dynamic routing rules for approval chains" icon={<AlertTriangle className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {workflowRules.map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{r.rule}</p>
                  <span className="badge-success">{r.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">Trigger: {r.trigger} · Routing: {r.routing}</p>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Approval Analytics" subtitle="Historical workflow performance and bottleneck analysis" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Workflow Intelligence" subtitle="Approval patterns, SLA compliance and bottleneck detection" onExport={() => notify.success("Workflow analytics exported")}>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Processed", value: "2,847" },
                { label: "Avg Approval Time", value: "1.2 days" },
                { label: "Auto-Approved", value: "34%" },
                { label: "SLA Compliance", value: "97.8%" },
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

      <ConfirmActionDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
        tone={confirm?.mode === "reject" ? "destructive" : "default"}
        requiredPermission="canApproveExpenses"
        actionLabel="approvals at this level"
        title={
          confirm?.mode === "reject"
            ? `Reject "${active?.item}"?`
            : `Approve "${active?.item}"?`
        }
        description={
          active
            ? `₹${active.amount.toLocaleString()} · requested by ${active.requestedBy} · ${active.level}`
            : ""
        }
        impact={
          confirm?.mode === "approve"
            ? "Approving advances the request in the chain and releases funds at the final level. This cannot be reversed."
            : "Rejection is final for this request and is permanently stored with your reason."
        }
        requireReason={confirm?.mode === "reject"}
        reasonLabel="Rejection reason"
        confirmLabel={confirm?.mode === "reject" ? "Reject request" : "Approve request"}
        onConfirm={(reason) => confirm && decide(confirm.index, confirm.mode, reason)}
      />
    </MainLayout>
  );
};

export default Approvals;
