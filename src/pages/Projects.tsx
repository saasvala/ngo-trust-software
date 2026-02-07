import { MainLayout } from "@/components/layout/MainLayout";

const Projects = () => {
  return (
    <MainLayout title="Projects" subtitle="Manage programs and initiatives">
      <div className="glass-card p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Project Management</h2>
        <p className="text-muted-foreground">Coming soon - Track project budgets and utilization</p>
      </div>
    </MainLayout>
  );
};

export default Projects;
