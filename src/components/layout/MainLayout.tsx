import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AccessibilityAudit } from "@/components/a11y/AccessibilityAudit";
import { SidebarStateProvider, useSidebarState } from "./SidebarState";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const LayoutShell = ({ children, title, subtitle }: MainLayoutProps) => {
  const { collapsed } = useSidebarState();
  return (
    <div className="min-h-dvh bg-background flex w-full">
      <Sidebar />
      
      {/* Main Content */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
          {/* Background Blobs */}
          <div className="blob blob-coral w-96 h-96 -top-48 -right-48 animate-float opacity-30" />
          <div className="blob blob-teal w-80 h-80 top-1/2 -left-40 animate-float-delayed opacity-20" />
          <div className="blob blob-purple w-64 h-64 bottom-20 right-1/4 animate-pulse-slow opacity-20" />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
      <AccessibilityAudit />
    </div>
  );
};

export const MainLayout = (props: MainLayoutProps) => (
  <SidebarStateProvider>
    <LayoutShell {...props} />
  </SidebarStateProvider>
);
