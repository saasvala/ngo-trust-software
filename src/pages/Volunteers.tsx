import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Input } from "@/components/ui/input";
import {
  UserCheck, Search, Users, Briefcase, MapPin, Clock,
  Activity, Download, FileText, Star, Award, Shield
} from "lucide-react";
import { toast } from "sonner";

const staffData = [
  { id: "VOL-001", name: "Ankit Sharma", role: "Field Coordinator", department: "Programs", location: "Varanasi", status: "active", type: "staff", joinDate: "2023-01-15", projects: 3 },
  { id: "VOL-002", name: "Priya Mishra", role: "Community Mobilizer", department: "Outreach", location: "Allahabad", status: "active", type: "volunteer", joinDate: "2024-03-20", projects: 2 },
  { id: "VOL-003", name: "Suresh Yadav", role: "Project Manager", department: "Programs", location: "Head Office", status: "active", type: "staff", joinDate: "2022-06-01", projects: 4 },
  { id: "VOL-004", name: "Kavita Singh", role: "Health Worker", department: "Health", location: "Jaunpur", status: "active", type: "volunteer", joinDate: "2024-07-10", projects: 1 },
  { id: "VOL-005", name: "Ramesh Gupta", role: "Accountant", department: "Finance", location: "Head Office", status: "active", type: "staff", joinDate: "2021-11-01", projects: 0 },
  { id: "VOL-006", name: "Neha Pandey", role: "Training Facilitator", department: "Capacity Building", location: "Mirzapur", status: "active", type: "consultant", joinDate: "2024-09-01", projects: 2 },
  { id: "VOL-007", name: "Deepak Tiwari", role: "Driver", department: "Admin", location: "Head Office", status: "active", type: "staff", joinDate: "2020-04-15", projects: 0 },
  { id: "VOL-008", name: "Sonia Kumari", role: "Data Entry Operator", department: "MIS", location: "Head Office", status: "on_leave", type: "staff", joinDate: "2023-08-20", projects: 1 },
];

const Volunteers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = staffData.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || s.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <MainLayout title="Volunteers & Staff" subtitle="Team management, assignments and activity tracking">
      <div className="space-y-8">
        {/* Level 1: Macro */}
        <DashboardSection level="macro" title="Team Overview" subtitle="Organizational human resources" icon={<Users className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Team" value={42} icon={<Users className="w-6 h-6 text-white" />} iconBg="primary" change="Across all locations" trend="neutral" />
            <StatCard3D title="Full-time Staff" value={28} icon={<Briefcase className="w-6 h-6 text-white" />} iconBg="teal" change="67% of team" trend="up" />
            <StatCard3D title="Volunteers" value={11} icon={<UserCheck className="w-6 h-6 text-white" />} iconBg="coral" change="+3 this quarter" trend="up" />
            <StatCard3D title="Field Locations" value={6} icon={<MapPin className="w-6 h-6 text-white" />} iconBg="warning" change="3 states" trend="neutral" />
          </div>
        </DashboardSection>

        {/* Level 2: Team Register */}
        <DashboardSection level="micro" title="Team Register" subtitle="All staff, volunteers and consultants" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search team members..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-border" />
            </div>
            <div className="flex gap-2">
              {["all", "staff", "volunteer", "consultant"].map(t => (
                <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterType === t ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => toast.success(`Exported ${filtered.length} team members`)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Role</th><th>Department</th><th>Location</th><th>Type</th><th>Projects</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs text-primary">{s.id}</td>
                    <td className="font-medium text-foreground">{s.name}</td>
                    <td className="text-muted-foreground text-xs">{s.role}</td>
                    <td className="text-muted-foreground text-xs">{s.department}</td>
                    <td className="text-muted-foreground text-xs">{s.location}</td>
                    <td><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.type === "staff" ? "bg-primary/20 text-purple-400" : s.type === "volunteer" ? "bg-teal/20 text-teal" : "bg-coral/20 text-coral"}`}>{s.type}</span></td>
                    <td className="text-muted-foreground">{s.projects}</td>
                    <td><span className={s.status === "active" ? "badge-success" : "badge-warning"}>{s.status.replace("_", " ")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>

        {/* Level 3: Department Breakdown */}
        <DashboardSection level="nano" title="Department Distribution" subtitle="Team allocation across departments" icon={<Award className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { dept: "Programs", count: 15, head: "Suresh Yadav" },
              { dept: "Finance", count: 5, head: "Ramesh Gupta" },
              { dept: "Outreach", count: 8, head: "Priya Mishra" },
              { dept: "Admin & MIS", count: 7, head: "HR Manager" },
            ].map(d => (
              <div key={d.dept} className="p-4 rounded-xl bg-secondary/30 text-center">
                <p className="text-2xl font-bold text-foreground">{d.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.dept}</p>
                <p className="text-xs text-primary mt-0.5">{d.head}</p>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* Level 4: Deep Research */}
        <DashboardSection level="deep" title="HR Intelligence" subtitle="Retention, performance and capacity analytics" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Team Analytics" subtitle="Workforce trends and capacity planning" onExport={() => toast.success("HR analytics exported")}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Avg Tenure", value: "2.8 years" },
                { label: "Retention Rate", value: "89%" },
                { label: "Training Hours/Month", value: "12.5" },
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

export default Volunteers;
