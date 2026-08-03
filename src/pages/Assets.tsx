import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { StatCardSkeleton, EmptyState } from "@/components/ui/loading";
import { ErrorState } from "@/components/common/StateBlocks";
import { useTableData } from "@/hooks/useTableData";
import { useRules } from "@/contexts/RuleContext";
import { Package, Laptop, Building, AlertTriangle, Activity, FileText } from "lucide-react";
import { toast } from "sonner";

interface AssetRow {
  id: string;
  ref_code: string;
  name: string;
  category: string;
  purchase_value: number;
  current_value: number;
  purchase_date: string;
  location: string | null;
  assigned_to: string | null;
  condition: string;
  status: string;
}

const Assets = () => {
  const { location: ruleLocation } = useRules();
  const symbol = ruleLocation.country?.currency.symbol || "₹";
  const { data: assets, loading, error, refetch } = useTableData<AssetRow>("assets", {
    orderBy: "purchase_date",
  });

  const lakh = (n: number) => `${symbol}${(n / 100000).toFixed(1)}L`;

  const bookValue = assets.reduce((s, a) => s + Number(a.current_value), 0);
  const purchaseValue = assets.reduce((s, a) => s + Number(a.purchase_value), 0);
  const itCount = assets.filter(a => a.category === "IT Equipment").length;
  const locations = new Set(assets.map(a => a.location).filter(Boolean)).size;
  const maintenance = assets.filter(a => a.status === "maintenance").length;

  const categories = useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    assets.forEach(a => {
      const prev = map.get(a.category) ?? { count: 0, value: 0 };
      map.set(a.category, { count: prev.count + 1, value: prev.value + Number(a.current_value) });
    });
    return [...map.entries()]
      .sort((a, b) => b[1].value - a[1].value)
      .map(([category, v]) => ({ category, ...v }));
  }, [assets]);

  const depreciation = purchaseValue - bookValue;
  const replacementDue = assets.filter(a => a.condition === "poor" || a.status === "maintenance").length;

  return (
    <MainLayout title="Asset & Inventory" subtitle="Track organizational assets, assignments and maintenance">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Asset Overview" subtitle="Organization-wide asset metrics" icon={<Package className="w-6 h-6 text-white" />}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard3D title="Total Assets" value={assets.length} icon={<Package className="w-6 h-6 text-white" />} iconBg="primary" change={`${lakh(bookValue)} book value`} trend="neutral" />
              <StatCard3D title="IT Equipment" value={itCount} icon={<Laptop className="w-6 h-6 text-white" />} iconBg="teal" change="Tracked items" trend="neutral" />
              <StatCard3D title="Locations" value={locations} icon={<Building className="w-6 h-6 text-white" />} iconBg="coral" change="Sites with assets" trend="neutral" />
              <StatCard3D title="Under Maintenance" value={maintenance} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="warning" change={maintenance ? "Needs attention" : "All operational"} trend={maintenance ? "down" : "up"} />
            </div>
          )}
        </DashboardSection>

        <DashboardSection level="micro" title="Asset Register" subtitle="All tracked assets with status" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState description={error} onRetry={() => void refetch()} />
          ) : assets.length === 0 ? (
            <EmptyState icon={<Package className="w-6 h-6 text-muted-foreground" />} title="No assets registered" description="Add your first asset to start tracking value and assignments." />
          ) : (
            <div className="space-y-3">
              {assets.map(a => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-secondary/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.ref_code} · {a.category} · {a.location ?? "Unassigned location"}
                      {a.assigned_to ? ` · ${a.assigned_to}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">{symbol}{Number(a.current_value).toLocaleString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === "in_use" ? "bg-success/20 text-emerald-400" : a.status === "available" ? "bg-primary/20 text-primary" : "bg-warning/20 text-warning"}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection level="nano" title="Category Breakdown" subtitle="Assets grouped by type" icon={<Package className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          {categories.length === 0 ? (
            <EmptyState icon={<Package className="w-6 h-6 text-muted-foreground" />} title="Nothing to group yet" description="Categories appear once assets are registered." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(c => (
                <div key={c.category} className="p-4 rounded-xl bg-secondary/30 text-center">
                  <p className="text-2xl font-bold text-foreground">{c.count}</p>
                  <p className="text-xs text-muted-foreground">{c.category}</p>
                  <p className="text-xs text-primary mt-1">{lakh(c.value)}</p>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection level="deep" title="Asset Intelligence" subtitle="Depreciation, lifecycle and maintenance analytics" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Asset Lifecycle Analysis" subtitle="Depreciation and replacement planning" onExport={() => toast.success("Asset lifecycle report exported")}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Book Value", value: lakh(bookValue) },
                { label: "Accumulated Depreciation", value: lakh(depreciation) },
                { label: "Replacement Due", value: `${replacementDue} items` },
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

export default Assets;
