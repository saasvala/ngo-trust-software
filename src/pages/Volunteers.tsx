import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Input } from "@/components/ui/input";
import { TableSkeleton, EmptyState, StatCardSkeleton } from "@/components/ui/loading";
import { ErrorState, NoResultsState } from "@/components/common/StateBlocks";
import { useTableData } from "@/hooks/useTableData";
import {
  UserCheck, Search, Users, Briefcase, MapPin, Clock,
  Activity, Download, FileText, Award
} from "lucide-react";
import { toast } from "sonner";

interface StaffRow {
  id: string;
  ref_code: string;
  name: string;
  role: string;
  department: string;
  staff_type: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  hours_this_month: number;
  status: string;
  joined_on: string;
}

const Volunteers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { data: staffData, loading, error, refetch } = useTableData<StaffRow>("volunteers", {
    orderBy: "joined_on",
  });

  const filtered = staffData.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);
    const matchesType = filterType === "all" || s.staff_type === filterType;
    return matchesSearch && matchesType;
  });

  const hasFilters = searchQuery.trim() !== "" || filterType !== "all";
  const types = ["all", ...new Set(staffData.map(s => s.staff_type))];
  const staffCount = staffData.filter(s => s.staff_type === "staff").length;
  const volunteerCount = staffData.filter(s => s.staff_type === "volunteer").length;
  const locations = new Set(staffData.map(s => s.location).filter(Boolean)).size;
  const total = staffData.length;

  const departments = useMemo(() => {
    const map = new Map<string, StaffRow[]>();
    staffData.forEach(s => map.set(s.department, [...(map.get(s.department) ?? []), s]));
    return [...map.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([dept, members]) => ({
        dept,
        count: members.length,
        hours: members.reduce((sum, m) => sum + m.hours_this_month, 0),
      }));
  }, [staffData]);

  const avgTenure = useMemo(() => {
    if (!total) return "—";
    const years =
      staffData.reduce(
        (sum, s) => sum + (Date.now() - new Date(s.joined_on).getTime()) / 31557600000,
        0
      ) / total;
    return `${years.toFixed(1)} years`;
  }, [staffData, total]);

  const activeRate = total
    ? `${Math.round((staffData.filter(s => s.status === "active").length / total) * 100)}%`
    : "—";
  const avgHours = total
    ? (staffData.reduce((s, m) => s + m.hours_this_month, 0) / total).toFixed(1)
    : "—";

  return (
    <MainLayout title="Volunteers & Staff" subtitle="Team management, assignments and activity tracking">
      <div className="space-y-8">
        {/* Level 1: Macro */}
        <DashboardSection level="macro" title="Team Overview" subtitle="Organizational human resources" icon={<Users className="w-6 h-6 text-white" />}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard3D title="Total Team" value={total} icon={<Users className="w-6 h-6 text-white" />} iconBg="primary" change="Across all locations" trend="neutral" />
              <StatCard3D title="Full-time Staff" value={staffCount} icon={<Briefcase className="w-6 h-6 text-white" />} iconBg="teal" change={total ? `${Math.round((staffCount / total) * 100)}% of team` : "—"} trend="up" />
              <StatCard3D title="Volunteers" value={volunteerCount} icon={<UserCheck className="w-6 h-6 text-white" />} iconBg="coral" change={total ? `${Math.round((volunteerCount / total) * 100)}% of team` : "—"} trend="up" />
              <StatCard3D title="Field Locations" value={locations} icon={<MapPin className="w-6 h-6 text-white" />} iconBg="warning" change="Active postings" trend="neutral" />
            </div>
          )}
        </DashboardSection>

        {/* Level 2: Team Register */}
        <DashboardSection level="micro" title="Team Register" subtitle="All staff, volunteers and consultants" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input placeholder="Search team members..." aria-label="Search team members" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-border" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterType === t ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => filtered.length ? toast.success(`Exported ${filtered.length} team members`) : toast.warning("Nothing to export")} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary">
              <Download className="w-3 h-3" aria-hidden="true" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <TableSkeleton rows={5} columns={8} />
            ) : error ? (
              <ErrorState description={error} onRetry={() => void refetch()} />
            ) : filtered.length === 0 && hasFilters ? (
              <NoResultsState entity="team members" onClearFilters={() => { setSearchQuery(""); setFilterType("all"); }} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Users className="w-6 h-6 text-muted-foreground" />}
                title="No team members yet"
                description="Add your first staff member or volunteer to build the team register."
              />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Role</th><th>Department</th><th>Location</th><th>Type</th><th>Hours (mo)</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td className="font-mono text-xs text-primary">{s.ref_code}</td>
                      <td className="font-medium text-foreground">{s.name}</td>
                      <td className="text-muted-foreground text-xs">{s.role}</td>
                      <td className="text-muted-foreground text-xs">{s.department}</td>
                      <td className="text-muted-foreground text-xs">{s.location ?? "—"}</td>
                      <td><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.staff_type === "staff" ? "bg-primary/20 text-purple-400" : s.staff_type === "volunteer" ? "bg-teal/20 text-teal" : "bg-coral/20 text-coral"}`}>{s.staff_type}</span></td>
                      <td className="text-muted-foreground">{s.hours_this_month}</td>
                      <td><span className={s.status === "active" ? "badge-success" : "badge-warning"}>{s.status.replace("_", " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DashboardSection>

        {/* Level 3: Department Breakdown */}
        <DashboardSection level="nano" title="Department Distribution" subtitle="Team allocation across departments" icon={<Award className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          {departments.length === 0 ? (
            <EmptyState icon={<Award className="w-6 h-6 text-muted-foreground" />} title="No departments yet" description="Departments appear once team members are added." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {departments.map(d => (
                <div key={d.dept} className="p-4 rounded-xl bg-secondary/30 text-center">
                  <p className="text-2xl font-bold text-foreground">{d.count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{d.dept}</p>
                  <p className="text-xs text-primary mt-0.5 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />{d.hours} hrs
                  </p>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        {/* Level 4: Deep Research */}
        <DashboardSection level="deep" title="HR Intelligence" subtitle="Retention, performance and capacity analytics" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Team Analytics" subtitle="Workforce trends and capacity planning" onExport={() => toast.success("HR analytics exported")}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Avg Tenure", value: avgTenure },
                { label: "Active Rate", value: activeRate },
                { label: "Avg Hours / Member", value: avgHours },
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
