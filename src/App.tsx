import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RuleProvider, useRules } from "@/contexts/RuleContext";
import { LocationSetupWizard } from "@/components/setup/LocationSetupWizard";
import Index from "./pages/Index";
import Donors from "./pages/Donors";
import Beneficiaries from "./pages/Beneficiaries";
import Donations from "./pages/Donations";
import Projects from "./pages/Projects";
import Expenses from "./pages/Expenses";
import Volunteers from "./pages/Volunteers";
import Compliance from "./pages/Compliance";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isSetupComplete } = useRules();
  const [showSetup, setShowSetup] = useState(!isSetupComplete);

  if (showSetup && !isSetupComplete) {
    return <LocationSetupWizard onComplete={() => setShowSetup(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/donors" element={<Donors />} />
      <Route path="/beneficiaries" element={<Beneficiaries />} />
      <Route path="/donations" element={<Donations />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/volunteers" element={<Volunteers />} />
      <Route path="/compliance" element={<Compliance />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RuleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </RuleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
