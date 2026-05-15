import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TableSkeleton, EmptyState, StatCardSkeleton } from "@/components/ui/loading";
import {
  Receipt, Search, Plus, Clock, CheckCircle, XCircle, TrendingUp,
  AlertTriangle, FileText, Download, Filter, Upload, Activity, IndianRupee
} from "lucide-react";
import { toast } from "sonner";

const expenseData = [
  { id: "EXP-001", description: "Travel to Rampur field visit", category: "Travel", project: "Rural Education", amount: 12500, requestedBy: "Raj Kumar", date: "2025-02-10", status: "pending", billAttached: true },
  { id: "EXP-002", description: "Office supplies - Stationery", category: "Admin", project: "General", amount: 4800, requestedBy: "Meena Sharma", date: "2025-02-09", status: "pending", billAttached: true },
  { id: "EXP-003", description: "Workshop venue booking", category: "Program", project: "Women Empowerment", amount: 35000, requestedBy: "Priya Verma", date: "2025-02-08", status: "approved", billAttached: true },
  { id: "EXP-004", description: "Printing - Annual Report 500 copies", category: "Communication", project: "General", amount: 28000, requestedBy: "Amit Singh", date: "2025-02-07", status: "approved", billAttached: true },
  { id: "EXP-005", description: "Laptop for field coordinator", category: "IT Equipment", project: "Rural Education", amount: 52000, requestedBy: "PM Sharma", date: "2025-02-06", status: "rejected", billAttached: false },
  { id: "EXP-006", description: "Community health camp supplies", category: "Program", project: "Health Initiative", amount: 18500, requestedBy: "Dr. Gupta", date: "2025-02-05", status: "approved", billAttached: true },
  { id: "EXP-007", description: "Vehicle fuel - January", category: "Transport", project: "General", amount: 8200, requestedBy: "Driver Ramu", date: "2025-02-04", status: "approved", billAttached: true },
  { id: "EXP-008", description: "Internet and phone bills", category: "Utilities", project: "General", amount: 6500, requestedBy: "Admin Team", date: "2025-02-03", status: "approved", billAttached: true },
];

const categoryBreakdown = [
  { category: "Program", amount: 53500, percentage: 32, color: "bg-primary" },
  { category: "Travel", amount: 20700, percentage: 12, color: "bg-teal" },
  { category: "Admin", amount: 11300, percentage: 7, color: "bg-coral" },
  { category: "IT Equipment", amount: 52000, percentage: 31, color: "bg-warning" },
  { category: "Utilities", amount: 14700, percentage: 9, color: "bg-success" },
  { category: "Communication", amount: 28000, percentage: 17, color: "bg-purple-400" },
];

const Expenses = () => {
  const { location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = expenseData.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalExpenses = expenseData.reduce((s, e) => s + e.amount, 0);
  const approved = expenseData.filter(e => e.status === "approved").reduce((s, e) => s + e.amount, 0);
  const pending = expenseData.filter(e => e.status === "pending").reduce((s, e) => s + e.amount, 0);

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
              <StatCard3D title="Approved" value={approved} prefix={currencySymbol} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change={`${expenseData.filter(e => e.status === "approved").length} items`} trend="up" />
              <StatCard3D title="Pending Approval" value={pending} prefix={currencySymbol} icon={<Clock className="w-6 h-6 text-white" />} iconBg="warning" change={`${expenseData.filter(e => e.status === "pending").length} items`} trend="neutral" />
              <StatCard3D title="Rejected" value={expenseData.filter(e => e.status === "rejected").length} icon={<XCircle className="w-6 h-6 text-white" />} iconBg="coral" change="This month" trend="down" />
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
            <button onClick={() => toast.success(`Exported ${filtered.length} expense records`)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <TableSkeleton rows={5} columns={10} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Receipt className="w-6 h-6 text-muted-foreground" />}
                title="No expenses found"
                description="Try adjusting your search or filters."
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
                      <td className="font-mono text-xs text-primary">{e.id}</td>
                      <td className="font-medium text-foreground max-w-[200px] truncate">{e.description}</td>
                      <td><span className="badge-primary">{e.category}</span></td>
                      <td className="text-muted-foreground text-xs">{e.project}</td>
                      <td className="font-semibold text-foreground">{currencySymbol}{e.amount.toLocaleString()}</td>
                      <td className="text-muted-foreground text-xs">{e.requestedBy}</td>
                      <td className="text-muted-foreground text-xs">{new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                      <td>{e.billAttached ? <Upload className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-warning" />}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.status === "approved" ? "bg-success/20 text-emerald-400" : e.status === "rejected" ? "bg-coral/20 text-coral" : "bg-warning/20 text-warning"}`}>
                          {e.status}
                        </span>
                      </td>
                      <td>
                        {e.status === "pending" && (
                          <div className="flex gap-1">
                            <button onClick={() => toast.success(`${e.id} approved`)} className="p-1.5 rounded-lg bg-success/20 hover:bg-success/30 transition-colors" title="Approve"><CheckCircle className="w-3.5 h-3.5 text-success" /></button>
                            <button onClick={() => toast.error(`${e.id} rejected`)} className="p-1.5 rounded-lg bg-coral/20 hover:bg-coral/30 transition-colors" title="Reject"><XCircle className="w-3.5 h-3.5 text-coral" /></button>
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
    </MainLayout>
  );
};

export default Expenses;
