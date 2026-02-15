import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const importHistory = [
  { id: "IMP-034", type: "Donors", file: "donors_batch_feb2026.csv", totalRows: 450, successRows: 447, errorRows: 3, status: "completed", importedBy: "ngo_admin", time: "2026-02-14 09:30" },
  { id: "IMP-033", type: "Projects", file: "projects_migration.csv", totalRows: 28, successRows: 28, errorRows: 0, status: "completed", importedBy: "super_admin", time: "2026-02-12 14:15" },
  { id: "IMP-032", type: "Expenses", file: "expenses_q3_2025.csv", totalRows: 1240, successRows: 1238, errorRows: 2, status: "completed", importedBy: "accountant", time: "2026-02-10 11:00" },
  { id: "IMP-031", type: "Donors", file: "international_donors.csv", totalRows: 89, successRows: 0, errorRows: 89, status: "failed", importedBy: "operator", time: "2026-02-08 16:45" },
];

const validationPreview = [
  { row: 1, name: "John Smith", email: "john@example.com", pan: "ABCDE1234F", status: "valid" },
  { row: 2, name: "Jane Doe", email: "jane@example.com", pan: "", status: "warning", issue: "Missing PAN" },
  { row: 3, name: "", email: "invalid", pan: "XYZ", status: "error", issue: "Missing name, invalid email, invalid PAN" },
  { row: 4, name: "Bob Wilson", email: "bob@ngo.org", pan: "FGHIJ5678K", status: "valid" },
  { row: 5, name: "Alice Brown", email: "alice@ngo.org", pan: "KLMNO9012P", status: "valid" },
];

const BulkImport = () => {
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <MainLayout title="Bulk Data Import" subtitle="CSV import with validation preview and conflict resolution">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Bulk Data Import & Migration" subtitle="CSV import with validation preview and conflict resolution" icon={<Upload className="w-6 h-6 text-white" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard3D title="Total Imports" value={34} icon={<FileSpreadsheet className="w-6 h-6 text-white" />} iconBg="primary" change="4 this month" trend="up" />
            <StatCard3D title="Records Imported" value={18450} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change="99.4% success rate" trend="up" />
            <StatCard3D title="Error Rows" value={94} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="coral" change="0.5% error rate" trend="down" />
            <StatCard3D title="Supported Types" value={3} icon={<FileText className="w-6 h-6 text-white" />} iconBg="teal" change="Donors · Projects · Expenses" trend="neutral" />
          </div>
        </DashboardSection>

        <DashboardSection level="micro" title="Import Wizard" subtitle="Upload CSV files with automatic field mapping" icon={<Upload className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setPreviewMode(true)}>
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">Drop CSV file here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-2">Supports: Donors, Projects, Expenses</p>
              <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB · UTF-8 encoding required</p>
            </div>

            {previewMode && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />Validation Preview
                  </h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPreviewMode(false)}>Cancel</Button>
                    <Button size="sm" onClick={() => { toast.success("Import committed: 3 valid, 1 warning, 1 error skipped"); setPreviewMode(false); }}>
                      Commit Valid Rows
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Row</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">PAN</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationPreview.map((r) => (
                        <tr key={r.row} className={`border-b border-border/50 ${r.status === 'error' ? 'bg-red-500/5' : r.status === 'warning' ? 'bg-amber-500/5' : ''}`}>
                          <td className="py-3 px-4">{r.row}</td>
                          <td className="py-3 px-4">{r.name || <span className="text-red-400 italic">empty</span>}</td>
                          <td className="py-3 px-4">{r.email}</td>
                          <td className="py-3 px-4 font-mono text-xs">{r.pan || "—"}</td>
                          <td className="py-3 px-4">
                            <Badge variant={r.status === 'valid' ? 'default' : 'secondary'} className={r.status === 'valid' ? 'bg-emerald-500/20 text-emerald-400 border-0' : r.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                              {r.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{r.issue || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Import History" subtitle="All import operations with audit trail" icon={<FileSpreadsheet className="w-5 h-5 text-teal" />} defaultExpanded={true}>
          <div className="space-y-3">
            {importHistory.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{h.type} Import</p>
                    <Badge variant="outline" className="text-xs">{h.id}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{h.file} · by {h.importedBy} · {h.time}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <span className="text-emerald-400">{h.successRows}</span>
                    <span className="text-muted-foreground"> / {h.totalRows}</span>
                    {h.errorRows > 0 && <span className="text-red-400 ml-2">({h.errorRows} errors)</span>}
                  </div>
                  <Badge variant={h.status === 'completed' ? 'default' : 'secondary'} className={h.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                    {h.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Migration Mapping Tool" subtitle="Field mapping and data transformation rules" icon={<Download className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Data Migration Analytics" subtitle="Import patterns and error analysis" onExport={() => toast.success("Import report exported")}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Records Processed", value: "18.5K" },
                { label: "Avg Import Time", value: "4.2s" },
                { label: "Conflict Resolutions", value: "23" },
              ].map((item) => (
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

export default BulkImport;
