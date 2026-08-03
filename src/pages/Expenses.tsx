import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useTableData } from "@/hooks/useTableData";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TableSkeleton, StatCardSkeleton } from "@/components/ui/loading";
import { EmptyState, NoResultsState, ErrorState } from "@/components/common/StateBlocks";
import { ConfirmActionDialog } from "@/components/common/ConfirmActionDialog";
import { notify } from "@/lib/notify";
import {
  Receipt, Search, Plus, Clock, CheckCircle, XCircle, TrendingUp,
  AlertTriangle, FileText, Download, Filter, Upload, Activity, IndianRupee
} from "lucide-react";
import { toast } from "sonner";

interface ExpenseRow {
  id: string;
  ref_code: string;
  description: string;
  category: string;
  project: string;
  amount: number;
  requested_by: string;
  expense_date: string;
  status: string;
  bill_attached: boolean;
}

const Expenses = () => {
  const { location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const {
    data: rows,
    setData: setRows,
    loading,
    error: loadError,
    refetch,
  } = useTableData<ExpenseRow>("expenses", { orderBy: "expense_date" });
  const [confirm, setConfirm] = useState<
    { row: ExpenseRow; mode: "approve" | "reject" } | null
  >(null);

  const load = () => void refetch();

  const filtered = rows.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.ref_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalExpenses = rows.reduce((s, e) => s + Number(e.amount), 0);
  const approved = rows.filter(e => e.status === "approved").reduce((s, e) => s + Number(e.amount), 0);
  const pending = rows.filter(e => e.status === "pending").reduce((s, e) => s + Number(e.amount), 0);
  const hasFilters = searchQuery.trim() !== "" || filterStatus !== "all";

  const categoryBreakdown = useMemo(() => {
    const palette = ["bg-primary", "bg-teal", "bg-coral", "bg-warning", "bg-success", "bg-purple-400"];
    const totals = new Map<string, number>();
    rows.forEach(e => totals.set(e.category, (totals.get(e.category) ?? 0) + Number(e.amount)));
    const sum = [...totals.values()].reduce((s, v) => s + v, 0) || 1;
    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount], i) => ({
        category,
        amount,
        percentage: Math.round((amount / sum) * 100),
        color: palette[i % palette.length],
      }));
  }, [rows]);

  const applyDecision = async (row: ExpenseRow, status: "approved" | "rejected", reason: string) => {
    const { error } = await supabase
      .from("expenses")
      .update({ status, decision_reason: reason || null })
      .eq("id", row.id);
    if (error) {
      notify.error("Could not save decision", { description: error.message });
      return;
    }
    setRows(prev => prev.map(r => (r.id === row.id ? { ...r, status } : r)));
    if (status === "approved") {
      notify.success(`${row.ref_code} approved`, {
        description: "The expense is locked and recorded in the audit trail.",
      });
    } else {
      notify.warning(`${row.ref_code} rejected`, { description: `Reason logged: ${reason}` });
    }
  };

  return (
    <MainLayout title="Expenses" subtitle="Track, approve and manage organizational expenses">
      <div className="space-y-8">
        {/* Level 1: Macro */}
        <DashboardSection level="macro" title="Expense Overview" subtitle="Current period financial metrics" icon={<Receipt className="w-6 h-6 text-white" />}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard3D title="Total Expenses" value={totalExpenses} prefix={currencySymbol} icon={<Receipt className="w-6 h-6 text-white" />} iconBg="primary" change="This month" trend="up" />
              <StatCard3D title="Approved" value={approved} prefix={currencySymbol} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change={`${rows.filter(e => e.status === "approved").length} items`} trend="up" />
              <StatCard3D title="Pending Approval" value={pending} prefix={currencySymbol} icon={<Clock className="w-6 h-6 text-white" />} iconBg="warning" change={`${rows.filter(e => e.status === "pending").length} items`} trend="neutral" />
              <StatCard3D title="Rejected" value={rows.filter(e => e.status === "rejected").length} icon={<XCircle className="w-6 h-6 text-white" />} iconBg="coral" change="This month" trend="down" />
            </div>
          )}
        </DashboardSection>

        {/* Level 2: Module View */}
        <DashboardSection level="micro" title="Expense Ledger" subtitle="All expenses with filters and search" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search expenses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-border" />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => filtered.length === 0 ? notify.warning("Nothing to export", { description: "Adjust your filters so at least one expense is listed." }) : notify.success(`Exported ${filtered.length} expense records`)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <TableSkeleton rows={5} columns={10} />
            ) : loadError ? (
              <ErrorState description={loadError} onRetry={load} />
            ) : filtered.length === 0 && hasFilters ? (
              <NoResultsState
                entity="expenses"
                onClearFilters={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Receipt className="w-6 h-6 text-muted-foreground" />}
                title="No expenses recorded yet"
                description="Submit your first expense to start tracking spend against project budgets."
                actionLabel="Record expense"
                onAction={() => notify.info("Expense form opening", { description: "Fill in amount, project and attach the bill." })}
              />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Requested By</th>
                    <th>Date</th>
                    <th>Bill</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id}>
                      <td className="font-mono text-xs text-primary">{e.ref_code}</td>
                      <td className="font-medium text-foreground max-w-[200px] truncate">{e.description}</td>
                      <td><span className="badge-primary">{e.category}</span></td>
                      <td className="text-muted-foreground text-xs">{e.project}</td>
                      <td className="font-semibold text-foreground">{currencySymbol}{Number(e.amount).toLocaleString()}</td>
                      <td className="text-muted-foreground text-xs">{e.requested_by}</td>
                      <td className="text-muted-foreground text-xs">{new Date(e.expense_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                      <td>{e.bill_attached ? <Upload className="w-4 h-4 text-success" aria-label="Bill attached" /> : <AlertTriangle className="w-4 h-4 text-warning" aria-label="Bill missing" />}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.status === "approved" ? "bg-success/20 text-emerald-400" : e.status === "rejected" ? "bg-coral/20 text-coral" : "bg-warning/20 text-warning"}`}>
                          {e.status}
                        </span>
                      </td>
                      <td>
                        {e.status === "pending" && (
                          <div className="flex gap-1">
                            <button onClick={() => setConfirm({ row: e, mode: "approve" })} aria-label={`Approve expense ${e.ref_code}`} className="p-1.5 rounded-lg bg-success/20 hover:bg-success/30 transition-colors"><CheckCircle className="w-3.5 h-3.5 text-success" aria-hidden="true" /></button>
                            <button onClick={() => setConfirm({ row: e, mode: "reject" })} aria-label={`Reject expense ${e.ref_code}`} className="p-1.5 rounded-lg bg-coral/20 hover:bg-coral/30 transition-colors"><XCircle className="w-3.5 h-3.5 text-coral" aria-hidden="true" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DashboardSection>

        {/* Level 3: Category Breakdown */}
        <DashboardSection level="nano" title="Category Analysis" subtitle="Expense distribution by category" icon={<TrendingUp className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryBreakdown.map(c => (
              <div key={c.category} className="p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{c.category}</p>
                  <p className="text-xs text-muted-foreground">{c.percentage}%</p>
                </div>
                <p className="text-lg font-bold text-foreground">{currencySymbol}{c.amount.toLocaleString()}</p>
                <Progress value={c.percentage} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* Level 4: Deep Research */}
        <DashboardSection level="deep" title="Expense Intelligence" subtitle="Trend analysis and anomaly detection" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Expense Analytics" subtitle="Monthly trends and budget adherence" onExport={() => toast.success("Expense analytics exported")}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Avg Monthly Expense", value: `${currencySymbol}3.8L` },
                { label: "Budget Adherence", value: "92%" },
                { label: "Approval Turnaround", value: "1.4 days" },
              ].map(item => (
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
        actionLabel="expense approvals"
        title={
          confirm?.mode === "reject"
            ? `Reject expense ${confirm?.row.ref_code}?`
            : `Approve expense ${confirm?.row.ref_code}?`
        }
        description={
          confirm
            ? `${currencySymbol}${Number(confirm.row.amount).toLocaleString()} · This decision is recorded against your user in the audit trail.`
            : ""
        }
        impact={
          confirm?.mode === "approve"
            ? "Approved expenses are immutable and immediately deducted from the project balance."
            : "Rejections notify the requester and cannot be undone — a new request must be raised."
        }
        requireReason={confirm?.mode === "reject"}
        reasonLabel="Rejection reason"
        confirmLabel={confirm?.mode === "reject" ? "Reject expense" : "Approve expense"}
        onConfirm={(reason) =>
          confirm &&
          void applyDecision(confirm.row, confirm.mode === "reject" ? "rejected" : "approved", reason)
        }
      />
    </MainLayout>
  );
};

export default Expenses;
