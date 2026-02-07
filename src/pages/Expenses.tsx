import { MainLayout } from "@/components/layout/MainLayout";

const Expenses = () => {
  return (
    <MainLayout title="Expenses" subtitle="Track and approve expenses">
      <div className="glass-card p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Expense Management</h2>
        <p className="text-muted-foreground">Coming soon - Log and approve expenses</p>
      </div>
    </MainLayout>
  );
};

export default Expenses;
