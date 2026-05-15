import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Input } from "@/components/ui/input";
import { TableSkeleton, EmptyState, StatCardSkeleton } from "@/components/ui/loading";
import {
  FileText, Search, FolderOpen, Upload, Download, Clock,
  Shield, Activity, Lock, Eye, File, Image, FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";

const documentData = [
  { id: "DOC-001", name: "12A Registration Certificate", category: "Compliance", type: "PDF", size: "2.1 MB", uploadedBy: "NGO Admin", date: "2024-04-01", version: 3, access: "admin", linked: "Compliance" },
  { id: "DOC-002", name: "80G Certificate - 2023-28", category: "Compliance", type: "PDF", size: "1.8 MB", uploadedBy: "NGO Admin", date: "2024-05-15", version: 2, access: "admin", linked: "Compliance" },
  { id: "DOC-003", name: "Annual Report FY 2023-24", category: "Reports", type: "PDF", size: "12.4 MB", uploadedBy: "Accountant", date: "2024-07-20", version: 1, access: "all", linked: "Reports" },
  { id: "DOC-004", name: "FCRA License Copy", category: "Compliance", type: "PDF", size: "890 KB", uploadedBy: "NGO Admin", date: "2024-03-10", version: 1, access: "admin", linked: "Compliance" },
  { id: "DOC-005", name: "Board Meeting Minutes - Jan 2025", category: "Governance", type: "DOCX", size: "345 KB", uploadedBy: "Secretary", date: "2025-01-28", version: 1, access: "admin", linked: "Governance" },
  { id: "DOC-006", name: "Project Proposal - Digital Literacy", category: "Projects", type: "PDF", size: "5.6 MB", uploadedBy: "PM Sharma", date: "2025-01-15", version: 2, access: "staff", linked: "Projects" },
  { id: "DOC-007", name: "Donor Agreement - Tata Trust", category: "Grants", type: "PDF", size: "3.2 MB", uploadedBy: "NGO Admin", date: "2024-11-20", version: 1, access: "admin", linked: "Grants" },
  { id: "DOC-008", name: "Staff Policy Handbook", category: "HR", type: "PDF", size: "4.8 MB", uploadedBy: "HR Manager", date: "2024-09-01", version: 4, access: "all", linked: "HR" },
  { id: "DOC-009", name: "Expense Vouchers - Dec 2024", category: "Finance", type: "XLSX", size: "1.2 MB", uploadedBy: "Accountant", date: "2025-01-05", version: 1, access: "finance", linked: "Expenses" },
  { id: "DOC-010", name: "Field Visit Photos - Rampur", category: "Media", type: "ZIP", size: "48.5 MB", uploadedBy: "Field Team", date: "2025-02-08", version: 1, access: "all", linked: "Projects" },
];

const categories = [
  { name: "Compliance", count: 3, icon: Shield, color: "text-coral" },
  { name: "Reports", count: 2, icon: FileText, color: "text-primary" },
  { name: "Projects", count: 2, icon: FolderOpen, color: "text-teal" },
  { name: "Governance", count: 1, icon: Lock, color: "text-warning" },
  { name: "Finance", count: 1, icon: FileSpreadsheet, color: "text-success" },
  { name: "HR", count: 1, icon: File, color: "text-purple-400" },
  { name: "Grants", count: 1, icon: File, color: "text-coral" },
  { name: "Media", count: 1, icon: Image, color: "text-teal" },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "PDF": return <FileText className="w-4 h-4 text-coral" />;
    case "DOCX": return <File className="w-4 h-4 text-primary" />;
    case "XLSX": return <FileSpreadsheet className="w-4 h-4 text-teal" />;
    case "ZIP": return <FolderOpen className="w-4 h-4 text-warning" />;
    default: return <File className="w-4 h-4 text-muted-foreground" />;
  }
};

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = documentData.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout title="Documents" subtitle="Document vault with version control and role-based access">
      <div className="space-y-8">
        {/* Level 1: Macro */}
        <DashboardSection level="macro" title="Document Overview" subtitle="Organization-wide document metrics" icon={<FileText className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Documents" value={documentData.length * 12} icon={<FileText className="w-6 h-6 text-white" />} iconBg="primary" change="Across all categories" trend="neutral" />
            <StatCard3D title="Categories" value={categories.length} icon={<FolderOpen className="w-6 h-6 text-white" />} iconBg="teal" change="Organized folders" trend="neutral" />
            <StatCard3D title="Total Size" value={82} suffix=" MB" icon={<Upload className="w-6 h-6 text-white" />} iconBg="coral" change="Storage used" trend="up" />
            <StatCard3D title="Versions Tracked" value={16} icon={<Clock className="w-6 h-6 text-white" />} iconBg="warning" change="With full history" trend="neutral" />
          </div>
        </DashboardSection>

        {/* Level 2: Document Browser */}
        <DashboardSection level="micro" title="Document Browser" subtitle="Search, filter and manage documents" icon={<FolderOpen className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search documents..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-border" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilterCategory("all")} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterCategory === "all" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>All</button>
              {categories.slice(0, 5).map(c => (
                <button key={c.name} onClick={() => setFilterCategory(c.name)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterCategory === c.name ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{c.name}</button>
              ))}
            </div>
            <button onClick={() => toast.success(`Exported ${filtered.length} document records`)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>File</th><th>Name</th><th>Category</th><th>Size</th><th>Uploaded By</th><th>Date</th><th>Ver</th><th>Access</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td>{getFileIcon(d.type)}</td>
                    <td className="font-medium text-foreground max-w-[220px] truncate">{d.name}</td>
                    <td><span className="badge-primary">{d.category}</span></td>
                    <td className="text-muted-foreground text-xs">{d.size}</td>
                    <td className="text-muted-foreground text-xs">{d.uploadedBy}</td>
                    <td className="text-muted-foreground text-xs">{new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}</td>
                    <td className="text-center"><span className="px-1.5 py-0.5 rounded bg-secondary text-xs text-muted-foreground">v{d.version}</span></td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.access === "admin" ? "bg-coral/20 text-coral" : d.access === "finance" ? "bg-warning/20 text-warning" : "bg-success/20 text-emerald-400"}`}>
                        {d.access}
                      </span>
                    </td>
                    <td>
                       <div className="flex gap-1">
                        <button onClick={() => toast.info(`Opening ${d.name}`)} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors" title="View"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => toast.success(`Downloading ${d.name}`)} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors" title="Download"><Download className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>

        {/* Level 3: Category Folders */}
        <DashboardSection level="nano" title="Category Folders" subtitle="Documents organized by type" icon={<FolderOpen className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.name} className="p-4 rounded-xl bg-secondary/30 text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                  <Icon className={`w-8 h-8 ${c.color} mx-auto mb-2`} />
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.count} files</p>
                </div>
              );
            })}
          </div>
        </DashboardSection>

        {/* Level 4: Deep Research */}
        <DashboardSection level="deep" title="Document Intelligence" subtitle="Storage analytics and access patterns" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Document Analytics" subtitle="Usage patterns and storage trends" onExport={() => toast.success("Document analytics exported")}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Most Accessed", value: "Annual Report" },
                { label: "Downloads This Month", value: "47" },
                { label: "Avg Version Count", value: "2.3" },
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

export default Documents;
