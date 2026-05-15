import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { useRules } from "@/contexts/RuleContext";
import { StatCardSkeleton, EmptyState } from "@/components/ui/loading";
import {
  FileBarChart, Download, FileText, TrendingUp, Users, FolderKanban,
  Receipt, Shield, Landmark, Activity, Calendar, Printer
} from "lucide-react";
import { toast } from "sonner";

const reportTypes = [
  { id: "fy_summary", name: "FY Summary Report", description: "Complete financial year overview with income, expenses, and fund utilization", icon: Calendar, category: "Financial", lastGenerated: "2025-02-10" },
  { id: "donor_wise", name: "Donor-wise Report", description: "Individual donor contribution history with tax benefit details", icon: Users, category: "Donor", lastGenerated: "2025-02-08" },
  { id: "project_util", name: "Project Utilization Report", description: "Budget vs actual spending per project with variance analysis", icon: FolderKanban, category: "Project", lastGenerated: "2025-02-05" },
  { id: "expense_cat", name: "Expense Category Report", description: "Expense breakdown by category with monthly trends", icon: Receipt, category: "Financial", lastGenerated: "2025-02-09" },
  { id: "tax_benefit", name: "Tax Benefit Eligible Report", description: "All 80G eligible donations with PAN verification status", icon: Shield, category: "Compliance", lastGenerated: "2025-02-07" },
  { id: "grant_report", name: "Grant Utilization Report", description: "Grant-wise fund usage, UC status, and milestone tracking", icon: Landmark, category: "Grant", lastGenerated: "2025-01-30" },
  { id: "federation", name: "Federation Aggregate Report", description: "Multi-NGO consolidated metrics for parent organizations", icon: TrendingUp, category: "Federation", lastGenerated: "2025-01-25" },
  { id: "audit_trail", name: "Audit Trail Report", description: "Complete immutable action log with user, timestamp, and entity details", icon: FileText, category: "Audit", lastGenerated: "2025-02-10" },
];

const recentReports = [
  { name: "FY 2024-25 Q3 Summary", type: "FY Summary", generatedBy: "NGO Admin", date: "2025-02-10", format: "PDF", size: "2.4 MB" },
  { name: "Donor Report - Jan 2025", type: "Donor-wise", generatedBy: "Accountant Verma", date: "2025-02-08", format: "Excel", size: "1.8 MB" },
  { name: "Rural Education Utilization", type: "Project Utilization", generatedBy: "PM Sharma", date: "2025-02-05", format: "PDF", size: "3.1 MB" },
  { name: "80G Tax Report FY25", type: "Tax Benefit", generatedBy: "CA Mehta", date: "2025-02-07", format: "PDF", size: "5.6 MB" },
  { name: "UNICEF Grant UC - Q1", type: "Grant Report", generatedBy: "NGO Admin", date: "2025-01-30", format: "PDF", size: "4.2 MB" },
];

const Reports = () => {
  const { location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const categories = [...new Set(reportTypes.map(r => r.category))];
  const filteredReports = selectedCategory === "all" ? reportTypes : reportTypes.filter(r => r.category === selectedCategory);

  return (
    <MainLayout title="Reports" subtitle="Generate audit-ready reports with multi-format export">
      <div className="space-y-8">
        {/* Level 1: Macro */}
        <DashboardSection level="macro" title="Report Center" subtitle="Report generation and analytics overview" icon={<FileBarChart className="w-6 h-6 text-white" />}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard3D title="Report Types" value={8} icon={<FileBarChart className="w-6 h-6 text-white" />} iconBg="primary" change="All categories" trend="neutral" />
              <StatCard3D title="Generated This Month" value={23} icon={<FileText className="w-6 h-6 text-white" />} iconBg="teal" change="+8 vs last month" trend="up" />
              <StatCard3D title="Scheduled Reports" value={5} icon={<Calendar className="w-6 h-6 text-white" />} iconBg="coral" change="Auto-generated" trend="neutral" />
              <StatCard3D title="Export Formats" value={3} icon={<Download className="w-6 h-6 text-white" />} iconBg="warning" change="PDF · Excel · JSON" trend="neutral" />
            </div>
          )}
        </DashboardSection>

        {/* Level 2: Report Types */}
        <DashboardSection level="micro" title="Available Reports" subtitle="Select a report type to generate" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button onClick={() => setSelectedCategory("all")} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedCategory === "all" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedCategory === c ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.id} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground">{r.name}</h4>
                        <span className="badge-primary">{r.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{r.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">Last: {new Date(r.lastGenerated).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); toast.success(`${r.name} (PDF) generated`); }} className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30">PDF</button>
                          <button onClick={(e) => { e.stopPropagation(); toast.success(`${r.name} (Excel) generated`); }} className="px-2 py-1 rounded bg-teal/20 text-teal text-xs font-medium hover:bg-teal/30">Excel</button>
                          <button onClick={(e) => { e.stopPropagation(); toast.success(`${r.name} (JSON) generated`); }} className="px-2 py-1 rounded bg-coral/20 text-coral text-xs font-medium hover:bg-coral/30">JSON</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSection>

        {/* Level 3: Recent Reports */}
        <DashboardSection level="nano" title="Recent Reports" subtitle="Previously generated reports for download" icon={<Download className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="space-y-3">
            {recentReports.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.type} · {r.generatedBy} · {new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{r.size}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.format === "PDF" ? "bg-coral/20 text-coral" : r.format === "Excel" ? "bg-teal/20 text-teal" : "bg-primary/20 text-primary"}`}>{r.format}</span>
                  <button onClick={() => toast.success(`Downloading ${r.name}`)} className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* Level 4: Deep Research */}
        <DashboardSection level="deep" title="Report Intelligence" subtitle="Usage patterns and compliance coverage" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Report Analytics" subtitle="Report generation trends and coverage analysis" onExport={() => toast.success("Report analytics exported")}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Reports Generated (FY)", value: "187" },
                { label: "Most Used", value: "FY Summary" },
                { label: "Compliance Coverage", value: "100%" },
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

export default Reports;
