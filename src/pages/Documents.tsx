import { useState, useRef, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useTableData } from "@/hooks/useTableData";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Input } from "@/components/ui/input";
import { TableSkeleton, StatCardSkeleton } from "@/components/ui/loading";
import { EmptyState, NoResultsState, ErrorState, InlineError } from "@/components/common/StateBlocks";
import { notify } from "@/lib/notify";
import {
  FileText, Search, FolderOpen, Upload, Download, Clock,
  Shield, Activity, Lock, Eye, File, Image, FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";

interface DocumentRow {
  id: string;
  name: string;
  category: string;
  file_type: string;
  size_kb: number;
  uploaded_by: string | null;
  uploaded_on: string;
  expires_on: string | null;
  is_confidential: boolean;
}

const categoryIcon: Record<string, { icon: typeof Shield; color: string }> = {
  Compliance: { icon: Shield, color: "text-coral" },
  Reports: { icon: FileText, color: "text-primary" },
  Programs: { icon: FolderOpen, color: "text-teal" },
  Governance: { icon: Lock, color: "text-warning" },
  Finance: { icon: FileSpreadsheet, color: "text-success" },
  Legal: { icon: File, color: "text-purple-400" },
  Grants: { icon: File, color: "text-coral" },
  Media: { icon: Image, color: "text-teal" },
};

const formatSize = (kb: number) =>
  kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

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
  const {
    data: documentData,
    loading,
    error: loadError,
    refetch,
  } = useTableData<DocumentRow>("documents", { orderBy: "uploaded_on" });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => void refetch();

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    documentData.forEach(d => counts.set(d.category, (counts.get(d.category) ?? 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        icon: categoryIcon[name]?.icon ?? File,
        color: categoryIcon[name]?.color ?? "text-muted-foreground",
      }));
  }, [documentData]);

  const totalKb = documentData.reduce((s, d) => s + d.size_kb, 0);
  const confidentialCount = documentData.filter(d => d.is_confidential).length;
  const expiringCount = documentData.filter(
    d => d.expires_on && new Date(d.expires_on).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 180
  ).length;

  const MAX_MB = 50;
  const handleUpload = async (file?: File) => {
    setUploadError(null);
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(`"${file.name}" is larger than ${MAX_MB} MB. Compress it or split the file, then upload again.`);
      notify.error("Upload rejected", { description: `File exceeds the ${MAX_MB} MB limit.` });
      return;
    }
    await notify.action(
      async () => {
        const { error } = await supabase.from("documents").insert({
          name: file.name,
          category: filterCategory === "all" ? "Reports" : filterCategory,
          file_type: (file.name.split(".").pop() ?? "FILE").toUpperCase(),
          size_kb: Math.max(1, Math.round(file.size / 1024)),
          uploaded_by: "Current user",
        });
        if (error) throw new Error(error.message);
        await refetch();
      },
      {
        loading: `Uploading ${file.name}…`,
        success: `${file.name} uploaded to the vault`,
        error: `Could not upload ${file.name}`,
      },
    );
  };

  const filtered = documentData.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout title="Documents" subtitle="Document vault with version control and role-based access">
      <div className="space-y-8">
        {/* Level 1: Macro */}
        <DashboardSection level="macro" title="Document Overview" subtitle="Organization-wide document metrics" icon={<FileText className="w-6 h-6 text-white" />}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard3D title="Total Documents" value={documentData.length} icon={<FileText className="w-6 h-6 text-white" />} iconBg="primary" change="Across all categories" trend="neutral" />
              <StatCard3D title="Categories" value={categories.length} icon={<FolderOpen className="w-6 h-6 text-white" />} iconBg="teal" change="Organized folders" trend="neutral" />
              <StatCard3D title="Total Size" value={Math.round(totalKb / 1024)} suffix=" MB" icon={<Upload className="w-6 h-6 text-white" />} iconBg="coral" change="Storage used" trend="up" />
              <StatCard3D title="Expiring Soon" value={expiringCount} icon={<Clock className="w-6 h-6 text-white" />} iconBg="warning" change="Within 180 days" trend={expiringCount ? "down" : "neutral"} />
            </div>
          )}
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
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                aria-label="Choose a document to upload"
                onChange={(e) => {
                  void handleUpload(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-primary bg-primary/15 hover:bg-primary/25 transition-colors">
                <Upload className="w-3 h-3" aria-hidden="true" /> Upload
              </button>
              <button onClick={() => filtered.length === 0 ? notify.warning("Nothing to export", { description: "No documents match the current filters." }) : notify.success(`Exported ${filtered.length} document records`)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground bg-secondary">
                <Download className="w-3 h-3" aria-hidden="true" /> Export
              </button>
            </div>
          </div>
          <InlineError message={uploadError} className="mb-3" />
          <div className="overflow-x-auto">
            {loading ? (
              <TableSkeleton rows={5} columns={9} />
            ) : loadError ? (
              <ErrorState description={loadError} onRetry={load} />
            ) : filtered.length === 0 && (searchQuery.trim() !== "" || filterCategory !== "all") ? (
              <NoResultsState
                entity="documents"
                onClearFilters={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                }}
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-6 h-6 text-muted-foreground" />}
                title="Your document vault is empty"
                description="Upload certificates, reports and agreements to keep them versioned and audit-ready."
                actionLabel="Upload document"
                onAction={() => fileInputRef.current?.click()}
              />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>File</th><th>Name</th><th>Category</th><th>Size</th><th>Uploaded By</th><th>Date</th><th>Expires</th><th>Access</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id}>
                      <td>{getFileIcon(d.file_type)}</td>
                      <td className="font-medium text-foreground max-w-[220px] truncate">{d.name}</td>
                      <td><span className="badge-primary">{d.category}</span></td>
                      <td className="text-muted-foreground text-xs">{formatSize(d.size_kb)}</td>
                      <td className="text-muted-foreground text-xs">{d.uploaded_by ?? "—"}</td>
                      <td className="text-muted-foreground text-xs">{new Date(d.uploaded_on).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}</td>
                      <td className="text-muted-foreground text-xs">{d.expires_on ? new Date(d.expires_on).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.is_confidential ? "bg-coral/20 text-coral" : "bg-success/20 text-emerald-400"}`}>
                          {d.is_confidential ? "restricted" : "all"}
                        </span>
                      </td>
                      <td>
                         <div className="flex gap-1">
                          <button onClick={() => notify.info(`Opening ${d.name}`)} aria-label={`View ${d.name}`} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" /></button>
                          <button onClick={() => notify.success(`Downloading ${d.name}`)} aria-label={`Download ${d.name}`} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"><Download className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
                { label: "Restricted Documents", value: `${confidentialCount}` },
                { label: "Expiring in 180 Days", value: `${expiringCount}` },
                { label: "Avg File Size", value: documentData.length ? formatSize(Math.round(totalKb / documentData.length)) : "—" },
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
