import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTableData } from "@/hooks/useTableData";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Input } from "@/components/ui/input";
import { TableSkeleton, EmptyState, StatCardSkeleton } from "@/components/ui/loading";
import { ErrorState, NoResultsState } from "@/components/common/StateBlocks";
import {
  Users, Search, Heart, MapPin, GraduationCap, Baby,
  Activity, Download, FileText, UserCheck, TrendingUp, Shield
} from "lucide-react";
import { toast } from "sonner";

interface BeneficiaryRow {
  id: string;
  ref_code: string;
  name: string;
  age: number | null;
  gender: string | null;
  category: string;
  project: string | null;
  village: string | null;
  district: string | null;
  status: string;
  enrolled_on: string;
}

const Beneficiaries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { data: beneficiaryData, loading, error, refetch } = useTableData<BeneficiaryRow>(
    "beneficiaries",
    { orderBy: "enrolled_on" }
  );

  const filtered = beneficiaryData.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ref_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.village ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(beneficiaryData.map(b => b.category))];
  const hasFilters = searchQuery.trim() !== "" || filterCategory !== "all";
  const women = beneficiaryData.filter(b => b.gender === "Female").length;
  const children = beneficiaryData.filter(b => (b.age ?? 99) < 18).length;
  const districts = new Set(beneficiaryData.map(b => b.district).filter(Boolean)).size;
  const total = beneficiaryData.length;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const demographics = useMemo(() => {
    const counts = new Map<string, number>();
    beneficiaryData.forEach(b => counts.set(b.category, (counts.get(b.category) ?? 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count, pct: `${pct(count)}%` }));
  }, [beneficiaryData]);

  const activeCount = beneficiaryData.filter(b => b.status === "active").length;
  const completedCount = beneficiaryData.filter(b => b.status === "completed").length;

  return (
    <MainLayout title="Beneficiaries" subtitle="Track and manage aid recipients across programs">
      <div className="space-y-8">
        {/* Level 1: Macro */}
        <DashboardSection level="macro" title="Beneficiary Overview" subtitle="Impact metrics and demographics" icon={<Users className="w-6 h-6 text-white" />}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard3D title="Total Beneficiaries" value={total} icon={<Users className="w-6 h-6 text-white" />} iconBg="primary" change={`${activeCount} active · ${completedCount} completed`} trend="up" />
              <StatCard3D title="Women & Girls" value={women} icon={<Heart className="w-6 h-6 text-white" />} iconBg="coral" change={`${pct(women)}% of total`} trend="up" />
              <StatCard3D title="Children (<18)" value={children} icon={<Baby className="w-6 h-6 text-white" />} iconBg="teal" change={`${pct(children)}% of total`} trend="up" />
              <StatCard3D title="Districts Covered" value={districts} icon={<MapPin className="w-6 h-6 text-white" />} iconBg="warning" change="Active field districts" trend="neutral" />
            </div>
          )}
        </DashboardSection>

        {/* Level 2: Module View */}
        <DashboardSection level="micro" title="Beneficiary Register" subtitle="Complete beneficiary database with filters" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search beneficiaries..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-border" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilterCategory("all")} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterCategory === "all" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>All</button>
              {categories.map(c => (
                <button key={c} onClick={() => setFilterCategory(c)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterCategory === c ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
            <button onClick={() => filtered.length ? toast.success(`Exported ${filtered.length} beneficiaries`) : toast.warning("Nothing to export")} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <TableSkeleton rows={5} columns={9} />
            ) : error ? (
              <ErrorState description={error} onRetry={() => void refetch()} />
            ) : filtered.length === 0 && hasFilters ? (
              <NoResultsState
                entity="beneficiaries"
                onClearFilters={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                }}
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Users className="w-6 h-6 text-muted-foreground" />}
                title="No beneficiaries enrolled yet"
                description="Enrol your first beneficiary to start tracking programme reach."
              />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Category</th><th>Project</th><th>Village</th><th>District</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id}>
                      <td className="font-mono text-xs text-primary">{b.ref_code}</td>
                      <td className="font-medium text-foreground">{b.name}</td>
                      <td className="text-muted-foreground">{b.age}</td>
                      <td className="text-muted-foreground">{b.gender}</td>
                      <td><span className="badge-primary">{b.category}</span></td>
                      <td className="text-muted-foreground text-xs">{b.project}</td>
                      <td className="text-muted-foreground text-xs">{b.village}</td>
                      <td className="text-muted-foreground text-xs">{b.district}</td>
                      <td>
                        <span className={b.status === "active" ? "badge-success" : "badge-warning"}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DashboardSection>

        {/* Level 3: Demographics */}
        <DashboardSection level="nano" title="Demographic Breakdown" subtitle="Beneficiary distribution by category" icon={<GraduationCap className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {demographics.map(d => (
              <div key={d.label} className="p-4 rounded-xl bg-secondary/30 text-center">
                <p className="text-2xl font-bold text-foreground">{d.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.label}</p>
                <p className="text-xs text-primary mt-0.5">{d.pct}</p>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* Level 4: Deep Research */}
        <DashboardSection level="deep" title="Impact Intelligence" subtitle="Beneficiary outcome tracking and analysis" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Impact Analytics" subtitle="Outcome measurement across programs" onExport={() => toast.success("Impact analytics exported")}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Avg Benefit Duration", value: "14 months" },
                { label: "Outcome Achievement", value: "78%" },
                { label: "Retention Rate", value: "91%" },
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

export default Beneficiaries;
