import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import { 
  Calculator,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export const AccountantDashboard = () => {
  const { formatCurrency, location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";

  const pendingApprovals = [
    { id: "EXP-001", type: "Project Expense", amount: 45000, project: "Education Initiative", date: "Today" },
    { id: "EXP-002", type: "Admin Expense", amount: 12500, project: "General", date: "Yesterday" },
    { id: "EXP-003", type: "Travel Expense", amount: 8700, project: "Healthcare Camp", date: "2 days ago" },
    { id: "EXP-004", type: "Equipment", amount: 125000, project: "Rural Development", date: "3 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* MACRO LEVEL - Financial Overview */}
      <DashboardSection
        level="macro"
        title="Financial Dashboard"
        subtitle="Today's financial position and pending actions"
        icon={<Calculator className="w-6 h-6 text-white" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D
            title="Pending Approvals"
            value={8}
            icon={<Clock className="w-6 h-6 text-white" />}
            iconBg="warning"
            change="4 urgent"
            trend="neutral"
          />
          <StatCard3D
            title="Approved Today"
            value={12}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            iconBg="success"
            change={`${currencySymbol}2.4L processed`}
            trend="up"
          />
          <StatCard3D
            title="Monthly Expenses"
            value={3450000}
            prefix={currencySymbol}
            icon={<Receipt className="w-6 h-6 text-white" />}
            iconBg="coral"
            change="+5.2% vs budget"
            trend="down"
          />
          <StatCard3D
            title="Available Balance"
            value={4000000}
            prefix={currencySymbol}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            iconBg="teal"
            change="32.2% of corpus"
            trend="up"
          />
        </div>
      </DashboardSection>

      {/* MICRO LEVEL - Approval Queue */}
      <DashboardSection
        level="micro"
        title="Expense Approval Queue"
        subtitle="Pending expenses requiring your action"
        icon={<Clock className="w-5 h-5 text-primary" />}
        defaultExpanded={true}
      >
        <div className="space-y-3">
          {pendingApprovals.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.type} • {item.project}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {currencySymbol}{item.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* NANO LEVEL - Ledger View */}
      <DashboardSection
        level="nano"
        title="Today's Ledger Entries"
        subtitle="All financial transactions recorded today"
        icon={<FileText className="w-5 h-5 text-teal" />}
        defaultExpanded={false}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Time</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Type</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Description</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Debit</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Credit</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: "09:15", type: "Donation", desc: "Rajesh Kumar", debit: 0, credit: 50000 },
                { time: "10:30", type: "Expense", desc: "Office Supplies", debit: 2500, credit: 0 },
                { time: "11:45", type: "Donation", desc: "ABC Corp CSR", debit: 0, credit: 500000 },
                { time: "14:20", type: "Expense", desc: "Travel Reimbursement", debit: 8700, credit: 0 },
                { time: "16:00", type: "Transfer", desc: "Project Allocation", debit: 200000, credit: 0 },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 px-4 text-muted-foreground">{row.time}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.type === "Donation"
                          ? "bg-success/20 text-success"
                          : row.type === "Expense"
                          ? "bg-coral/20 text-coral"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground">{row.desc}</td>
                  <td className="py-3 px-4 text-right text-coral">
                    {row.debit > 0 && `${currencySymbol}${row.debit.toLocaleString()}`}
                  </td>
                  <td className="py-3 px-4 text-right text-success">
                    {row.credit > 0 && `${currencySymbol}${row.credit.toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* DEEP RESEARCH LEVEL */}
      <DashboardSection
        level="deep"
        title="Audit Preparation"
        subtitle="Compliance reports and audit-ready data"
        icon={<AlertTriangle className="w-5 h-5 text-coral" />}
        defaultExpanded={false}
      >
        <DeepResearchView
          title="Audit Trail & Reports"
          subtitle="Generate statutory reports for CA filing"
          onExport={() => console.log("Exporting...")}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Income & Expenditure", status: "Ready", icon: FileText },
              { label: "Balance Sheet", status: "Ready", icon: Calculator },
              { label: "80G Donation Report", status: "Ready", icon: Receipt },
            ].map((item) => (
              <button
                key={item.label}
                className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
                <span className="text-xs text-success">{item.status}</span>
              </button>
            ))}
          </div>
        </DeepResearchView>
      </DashboardSection>
    </div>
  );
};
