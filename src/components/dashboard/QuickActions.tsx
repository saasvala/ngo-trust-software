import { Plus, FileText, UserPlus, IndianRupee } from "lucide-react";

const actions = [
  {
    icon: IndianRupee,
    label: "New Donation",
    description: "Record a donation",
    gradient: "from-primary to-purple-400",
  },
  {
    icon: UserPlus,
    label: "Add Donor",
    description: "Register new donor",
    gradient: "from-teal to-emerald-400",
  },
  {
    icon: FileText,
    label: "80G Receipt",
    description: "Generate receipt",
    gradient: "from-coral to-amber-400",
  },
  {
    icon: Plus,
    label: "New Expense",
    description: "Log an expense",
    gradient: "from-blue-500 to-cyan-400",
  },
];

export const QuickActions = () => {
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="group p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-200 text-left"
          >
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-medium text-sm text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
