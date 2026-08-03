import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { StatCardSkeleton, EmptyState } from "@/components/ui/loading";
import { ErrorState } from "@/components/common/StateBlocks";
import { useTableData } from "@/hooks/useTableData";
import { useRules } from "@/contexts/RuleContext";
import { Landmark, FileText, TrendingUp, Activity, Target } from "lucide-react";
import { toast } from "sonner";

interface GrantRow {
  id: string;
  ref_code: string;
  title: string;
  funder: string;
  amount: number;
  released: number;
  stage: string;
  start_date: string | null;
  end_date: string | null;
  utilization_pct: number;
  status: string;
}

const stages = ["application", "approval", "agreement", "implementation", "reporting", "closure"];
const stageLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Grants = () => {
  const { location } = useRules();
  const symbol = location.country?.currency.symbol || "₹";
  const { data: grants, loading, error, refetch } = useTableData<GrantRow>("grants", {
    orderBy: "start_date",
  });

  const lakh = (n: number) => `${symbol}${(n / 100000).toFixed(1)}L`;
  const active = grants.filter(g => g.status === "active");
  const totalValue = grants.reduce((s, g) => s + Number(g.amount), 0);
  const totalReleased = grants.reduce((s, g) => s + Number(g.released), 0);
  const ucPending = grants.filter(g => g.stage === "reporting" || g.stage === "closure").length;
  const pipeline = grants.filter(g => g.stage === "application" || g.stage === "approval").length;
  const avgUtil = grants.length
    ? Math.round(grants.reduce((s, g) => s + g.utilization_pct, 0) / grants.length)
    : 0;
  const closed = grants.filter(g => g.status === "closed").length;

  const period = (g: GrantRow) =>
    [g.start_date, g.end_date].filter(Boolean).map(d => new Date(d as string).getFullYear()).join("–") || "Dates TBC";

  return (
    <MainLayout title="Grant Lifecycle" subtitle="Grant tracking from proposal to utilization certificate with milestone-based releases">
      <div className="space-y-8">
        <DashboardSection level="macro" title="Grant Portfolio" subtitle="Active grants and fund allocation" icon={<Landmark className="w-6 h-6 text-white" />}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard3D title="Active Grants" value={active.length} icon={<Landmark className="w-6 h-6 text-white" />} iconBg="primary" change={`${closed} closed`} trend="neutral" />
              <StatCard3D title="Total Grant Value" value={totalValue} prefix={symbol} icon={<TrendingUp className="w-6 h-6 text-white" />} iconBg="teal" change={`${lakh(totalReleased)} released`} trend="up" />
              <StatCard3D title="UC Pending" value={ucPending} icon={<FileText className="w-6 h-6 text-white" />} iconBg="warning" change="Reporting or closure stage" trend="neutral" />
              <StatCard3D title="In Pipeline" value={pipeline} icon={<Target className="w-6 h-6 text-white" />} iconBg="coral" change="Application / approval" trend="neutral" />
            </div>
          )}
        </DashboardSection>

        <DashboardSection level="micro" title="Grant Tracker" subtitle="Lifecycle stage and utilization per grant" icon={<Activity className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <ErrorState description={error} onRetry={() => void refetch()} />
          ) : grants.length === 0 ? (
            <EmptyState icon={<Landmark className="w-6 h-6 text-muted-foreground" />} title="No grants recorded" description="Add a grant to track it from application through to closure." />
          ) : (
            <div className="space-y-4">
              {grants.map(g => {
                const stageIndex = stages.indexOf(g.stage);
                return (
                  <div key={g.id} className="p-4 rounded-xl bg-secondary/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.funder} · {period(g)} · {lakh(Number(g.amount))}</p>
                      </div>
                      <span className={`self-start px-2 py-1 rounded-full text-xs font-medium ${g.status === "active" ? "bg-success/20 text-emerald-400" : g.status === "pending" ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"}`}>
                        {stageLabel(g.stage)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 mb-2 flex-wrap">
                      {stages.map((s, i) => (
                        <div key={s} className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${i <= stageIndex ? "bg-primary" : "bg-muted"}`} />
                          {i < stages.length - 1 && <div className={`w-4 h-0.5 ${i < stageIndex ? "bg-primary" : "bg-muted"}`} />}
                        </div>
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">{stageIndex + 1}/{stages.length}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Utilization · {lakh(Number(g.released))} released</span><span>{g.utilization_pct}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-teal rounded-full" style={{ width: `${g.utilization_pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardSection>

        <DashboardSection level="nano" title="Fund Release Tracker" subtitle="Released versus committed funds per grant" icon={<Target className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          {grants.length === 0 ? (
            <EmptyState icon={<Target className="w-6 h-6 text-muted-foreground" />} title="No releases yet" description="Release data appears once grants are recorded." />
          ) : (
            <div className="space-y-3">
              {grants.map(g => (
                <div key={g.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{g.title}</p>
                    <p className="text-xs text-muted-foreground">{g.ref_code} · {lakh(Number(g.released))} of {lakh(Number(g.amount))}</p>
                  </div>
                  <span className="text-xs font-medium text-primary shrink-0">
                    {Math.round((Number(g.released) / Math.max(Number(g.amount), 1)) * 100)}% released
                  </span>
                </div>
              ))}
            </div>
          )}
        </DashboardSection>

        <DashboardSection level="deep" title="Grant Intelligence" subtitle="Portfolio performance across the grant lifecycle" icon={<Landmark className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Grant Analytics" subtitle="Lifecycle performance and success metrics" onExport={() => toast.success("Grant analytics exported")}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Portfolio Value", value: lakh(totalValue) },
                { label: "Funds Released", value: lakh(totalReleased) },
                { label: "Avg Utilization", value: `${avgUtil}%` },
                { label: "Grants Closed", value: `${closed}` },
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

export default Grants;
