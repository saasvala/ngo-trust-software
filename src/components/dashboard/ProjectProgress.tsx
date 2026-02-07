import { FolderKanban, ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "Education for All",
    budget: "₹25,00,000",
    utilized: 68,
    status: "active",
  },
  {
    name: "Healthcare Initiative",
    budget: "₹15,00,000",
    utilized: 42,
    status: "active",
  },
  {
    name: "Rural Development",
    budget: "₹30,00,000",
    utilized: 85,
    status: "active",
  },
  {
    name: "Women Empowerment",
    budget: "₹10,00,000",
    utilized: 23,
    status: "active",
  },
];

export const ProjectProgress = () => {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-teal" />
          <h3 className="font-semibold text-foreground">Project Utilization</h3>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {project.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {project.utilized}% of {project.budget}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  project.utilized > 80
                    ? "bg-gradient-to-r from-amber-500 to-coral"
                    : project.utilized > 50
                    ? "bg-gradient-to-r from-teal to-emerald-400"
                    : "bg-gradient-to-r from-primary to-purple-400"
                }`}
                style={{ width: `${project.utilized}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
