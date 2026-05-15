import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardSection } from "@/components/dashboard/layers/DashboardSection";
import { StatCard3D } from "@/components/dashboard/layers/StatCard3D";
import { DeepResearchView } from "@/components/dashboard/layers/DeepResearchView";
import { StatCardSkeleton, EmptyState } from "@/components/ui/loading";
import { Package, Laptop, Building, AlertTriangle, Activity, FileText } from "lucide-react";

const assets = [
  { name: "Dell Laptop - #IT-042", category: "IT Equipment", location: "Head Office", status: "assigned", assignedTo: "Raj Kumar" },
  { name: "Toyota Innova - MH-12-AB-1234", category: "Vehicle", location: "Field Office", status: "in_use", assignedTo: "Field Team A" },
  { name: "Projector - #AV-007", category: "AV Equipment", location: "Training Hall", status: "available", assignedTo: null },
  { name: "Generator - 5KVA", category: "Infrastructure", location: "Warehouse", status: "maintenance", assignedTo: null },
];

const Assets = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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
              <StatCard3D title="Total Assets" value={156} icon={<Package className="w-6 h-6 text-white" />} iconBg="primary" change="₹48L book value" trend="neutral" />
              <StatCard3D title="IT Equipment" value={67} icon={<Laptop className="w-6 h-6 text-white" />} iconBg="teal" change="12 unassigned" trend="neutral" />
              <StatCard3D title="Locations" value={5} icon={<Building className="w-6 h-6 text-white" />} iconBg="coral" change="Across 3 states" trend="neutral" />
              <StatCard3D title="Under Maintenance" value={4} icon={<AlertTriangle className="w-6 h-6 text-white" />} iconBg="warning" change="2 overdue" trend="down" />
            </div>
          )}
        </DashboardSection>

        <DashboardSection level="micro" title="Asset Register" subtitle="All tracked assets with status" icon={<FileText className="w-5 h-5 text-primary" />} defaultExpanded={true}>
          <div className="space-y-3">
            {assets.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.category} · {a.location}{a.assignedTo ? ` · ${a.assignedTo}` : ''}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === 'assigned' || a.status === 'in_use' ? 'bg-success/20 text-emerald-400' : a.status === 'available' ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'}`}>
                  {a.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="nano" title="Category Breakdown" subtitle="Assets grouped by type" icon={<Package className="w-5 h-5 text-teal" />} defaultExpanded={false}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: "IT Equipment", count: 67, value: "₹18.5L" },
              { category: "Vehicles", count: 8, value: "₹12.4L" },
              { category: "Furniture", count: 45, value: "₹6.8L" },
              { category: "Infrastructure", count: 36, value: "₹10.3L" },
            ].map((c) => (
              <div key={c.category} className="p-4 rounded-xl bg-secondary/30 text-center">
                <p className="text-2xl font-bold text-foreground">{c.count}</p>
                <p className="text-xs text-muted-foreground">{c.category}</p>
                <p className="text-xs text-primary mt-1">{c.value}</p>
              </div>
            ))}
          </div>
        </DashboardSection>

        <DashboardSection level="deep" title="Asset Intelligence" subtitle="Depreciation, lifecycle and maintenance analytics" icon={<Activity className="w-5 h-5 text-coral" />} defaultExpanded={false}>
          <DeepResearchView title="Asset Lifecycle Analysis" subtitle="Depreciation and replacement planning" onExport={() => {}}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Book Value", value: "₹48.0L" },
                { label: "Annual Depreciation", value: "₹7.2L" },
                { label: "Replacement Due", value: "12 items" },
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

export default Assets;
