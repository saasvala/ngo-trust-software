import { MainLayout } from "@/components/layout/MainLayout";

const Reports = () => {
  return (
    <MainLayout title="Reports" subtitle="Generate audit-ready reports">
      <div className="glass-card p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Reports & Analytics</h2>
        <p className="text-muted-foreground">Coming soon - FY-wise donation and expense reports</p>
      </div>
    </MainLayout>
  );
};

export default Reports;
