import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Input } from "@/components/ui/input";
import { TableSkeleton, EmptyState, StatCardSkeleton } from "@/components/ui/loading";
import {
  Users, Search, Heart, MapPin, GraduationCap, Baby,
  Activity, Download, FileText, UserCheck, TrendingUp, Shield
} from "lucide-react";
import { toast } from "sonner";

const beneficiaryData = [
  { id: "BEN-001", name: "Sunita Devi", age: 32, gender: "Female", category: "Women Empowerment", project: "Skill Training", village: "Rampur", district: "Varanasi", status: "active", enrolled: "2024-06-15" },
  { id: "BEN-002", name: "Ravi Kumar", age: 14, gender: "Male", category: "Education", project: "Rural Education", village: "Chandpur", district: "Allahabad", status: "active", enrolled: "2024-08-20" },
  { id: "BEN-003", name: "Lakshmi Bai", age: 45, gender: "Female", category: "Health", project: "Health Initiative", village: "Sultanpur", district: "Varanasi", status: "active", enrolled: "2024-03-10" },
  { id: "BEN-004", name: "Mohan Lal", age: 58, gender: "Male", category: "Livelihood", project: "Farmer Support", village: "Ghazipur", district: "Ghazipur", status: "completed", enrolled: "2023-12-01" },
  { id: "BEN-005", name: "Aarti Kumari", age: 8, gender: "Female", category: "Education", project: "Rural Education", village: "Jaunpur", district: "Jaunpur", status: "active", enrolled: "2024-07-01" },
  { id: "BEN-006", name: "Bablu Prasad", age: 22, gender: "Male", category: "Skill Development", project: "Skill Training", village: "Mirzapur", district: "Mirzapur", status: "active", enrolled: "2024-09-15" },
  { id: "BEN-007", name: "Kamla Devi", age: 40, gender: "Female", category: "Women Empowerment", project: "Women SHG", village: "Azamgarh", district: "Azamgarh", status: "active", enrolled: "2024-05-20" },
  { id: "BEN-008", name: "Rahul Yadav", age: 16, gender: "Male", category: "Education", project: "Digital Literacy", village: "Bhadohi", district: "Bhadohi", status: "active", enrolled: "2024-10-01" },
];

const Beneficiaries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = beneficiaryData.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(beneficiaryData.map(b => b.category))];

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
              <StatCard3D title="Total Beneficiaries" value={2847} icon={<Users className="w-6 h-6 text-white" />} iconBg="primary" change="+124 this quarter" trend="up" />
              <StatCard3D title="Women & Girls" value={1623} icon={<Heart className="w-6 h-6 text-white" />} iconBg="coral" change="57% of total" trend="up" />
              <StatCard3D title="Children (<18)" value={892} icon={<Baby className="w-6 h-6 text-white" />} iconBg="teal" change="31% of total" trend="up" />
              <StatCard3D title="Districts Covered" value={14} icon={<MapPin className="w-6 h-6 text-white" />} iconBg="warning" change="Across 3 states" trend="neutral" />
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
            <button onClick={() => toast.success(`Exported ${filtered.length} beneficiaries`)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <TableSkeleton rows={5} columns={9} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Users className="w-6 h-6 text-muted-foreground" />}
                title="No beneficiaries found"
                description="Try adjusting your search filters."
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
                      <td className="font-mono text-xs text-primary">{b.id}</td>
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
            {[
              { label: "Education", count: 1245, pct: "44%" },
              { label: "Health", count: 567, pct: "20%" },
              { label: "Women Empowerment", count: 623, pct: "22%" },
              { label: "Livelihood", count: 412, pct: "14%" },
            ].map(d => (
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
