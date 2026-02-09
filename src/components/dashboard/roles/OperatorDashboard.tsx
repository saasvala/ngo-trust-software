import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { useRules } from "@/contexts/RuleContext";
import { 
  UserCog,
  Receipt,
  CheckCircle,
  Clock,
  Plus,
  Users,
  FileText
} from "lucide-react";

export const OperatorDashboard = () => {
  const { location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";

  const todaysTasks = [
    { id: 1, task: "Process donation from Rajesh Kumar", status: "pending", priority: "high" },
    { id: 2, task: "Generate 80G receipt #1247", status: "pending", priority: "medium" },
    { id: 3, task: "Update donor contact details", status: "completed", priority: "low" },
    { id: 4, task: "Send thank you email to ABC Corp", status: "pending", priority: "medium" },
  ];

  const recentEntries = [
    { type: "Donation", name: "Priya Sharma", amount: 25000, time: "10 mins ago" },
    { type: "Donation", name: "XYZ Foundation", amount: 100000, time: "45 mins ago" },
    { type: "Beneficiary", name: "Ravi Kumar", amount: null, time: "1 hour ago" },
    { type: "Donation", name: "Anonymous", amount: 5000, time: "2 hours ago" },
  ];

  return (
    <div className="space-y-8">
      {/* MACRO LEVEL - Today's Overview */}
      <DashboardSection
        level="macro"
        title="Today's Dashboard"
        subtitle="Your daily tasks and quick actions"
        icon={<UserCog className="w-6 h-6 text-white" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D
            title="Donations Today"
            value={12}
            icon={<Receipt className="w-6 h-6 text-white" />}
            iconBg="primary"
            change={`${currencySymbol}4.5L collected`}
            trend="up"
          />
          <StatCard3D
            title="Receipts Generated"
            value={10}
            icon={<FileText className="w-6 h-6 text-white" />}
            iconBg="teal"
            change="2 pending"
            trend="neutral"
          />
          <StatCard3D
            title="Pending Tasks"
            value={6}
            icon={<Clock className="w-6 h-6 text-white" />}
            iconBg="warning"
            change="3 urgent"
            trend="neutral"
          />
          <StatCard3D
            title="Completed Today"
            value={18}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            iconBg="success"
            change="+4 vs yesterday"
            trend="up"
          />
        </div>
      </DashboardSection>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Donation", icon: Plus, color: "primary" },
          { label: "New Donor", icon: Users, color: "teal" },
          { label: "Generate Receipt", icon: FileText, color: "coral" },
          { label: "Search Donor", icon: Users, color: "success" },
        ].map((action) => (
          <button
            key={action.label}
            className={`glass-card p-4 flex flex-col items-center gap-3 hover:scale-[1.02] transition-all group`}
          >
            <div className={`w-12 h-12 rounded-xl bg-${action.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className={`w-6 h-6 text-${action.color}`} />
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </button>
        ))}
      </div>

      {/* MICRO LEVEL - Today's Tasks */}
      <DashboardSection
        level="micro"
        title="Today's Tasks"
        subtitle="Pending actions requiring attention"
        icon={<Clock className="w-5 h-5 text-primary" />}
        defaultExpanded={true}
      >
        <div className="space-y-3">
          {todaysTasks.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                item.status === "completed"
                  ? "bg-success/10 border border-success/20"
                  : "bg-secondary/30 hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.status === "completed"
                      ? "bg-success border-success"
                      : "border-muted-foreground hover:border-primary"
                  }`}
                >
                  {item.status === "completed" && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </button>
                <span
                  className={`text-sm ${
                    item.status === "completed"
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {item.task}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === "high"
                    ? "bg-coral/20 text-coral"
                    : item.priority === "medium"
                    ? "bg-warning/20 text-warning"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* NANO LEVEL - Recent Entries */}
      <DashboardSection
        level="nano"
        title="Recent Entries"
        subtitle="Entries made in the last few hours"
        icon={<FileText className="w-5 h-5 text-teal" />}
        defaultExpanded={false}
      >
        <div className="space-y-3">
          {recentEntries.map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    entry.type === "Donation" ? "bg-primary/20" : "bg-teal/20"
                  }`}
                >
                  {entry.type === "Donation" ? (
                    <Receipt className="w-4 h-4 text-primary" />
                  ) : (
                    <Users className="w-4 h-4 text-teal" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.type}</p>
                </div>
              </div>
              <div className="text-right">
                {entry.amount && (
                  <p className="text-sm font-medium text-foreground">
                    {currencySymbol}{entry.amount.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
};
