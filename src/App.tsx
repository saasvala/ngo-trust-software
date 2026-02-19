import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RuleProvider } from "@/contexts/RuleContext";
import DemoLanding from "./pages/DemoLanding";
import Index from "./pages/Index";
import Donors from "./pages/Donors";
import Beneficiaries from "./pages/Beneficiaries";
import Donations from "./pages/Donations";
import Projects from "./pages/Projects";
import Expenses from "./pages/Expenses";
import Volunteers from "./pages/Volunteers";
import Compliance from "./pages/Compliance";
import Audit from "./pages/Audit";
import Risk from "./pages/Risk";
import Grants from "./pages/Grants";
import Approvals from "./pages/Approvals";
import BudgetPlanning from "./pages/BudgetPlanning";
import AutomationRules from "./pages/AutomationRules";
import GovernmentFiling from "./pages/GovernmentFiling";
import DataGovernance from "./pages/DataGovernance";
import Assets from "./pages/Assets";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Backups from "./pages/Backups";
import SystemHealth from "./pages/SystemHealth";
import ApiWebhooks from "./pages/ApiWebhooks";
import BulkImport from "./pages/BulkImport";
import Billing from "./pages/Billing";
import SecurityAdmin from "./pages/SecurityAdmin";
import UsageAnalytics from "./pages/UsageAnalytics";
import FinancialIntelligence from "./pages/FinancialIntelligence";
import FraudDetection from "./pages/FraudDetection";
import ImpactMeasurement from "./pages/ImpactMeasurement";
import BoardDashboard from "./pages/BoardDashboard";
import CSRReporting from "./pages/CSRReporting";
import AddProduct from "./pages/AddProduct";
import ProductCatalog from "./pages/ProductCatalog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RuleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<DemoLanding />} />
            <Route path="/" element={<Index />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/beneficiaries" element={<Beneficiaries />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/risk" element={<Risk />} />
            <Route path="/grants" element={<Grants />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/budget" element={<BudgetPlanning />} />
            <Route path="/automation" element={<AutomationRules />} />
            <Route path="/government-filing" element={<GovernmentFiling />} />
            <Route path="/data-governance" element={<DataGovernance />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/backups" element={<Backups />} />
            <Route path="/system-health" element={<SystemHealth />} />
            <Route path="/api-webhooks" element={<ApiWebhooks />} />
            <Route path="/bulk-import" element={<BulkImport />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/security" element={<SecurityAdmin />} />
            <Route path="/usage-analytics" element={<UsageAnalytics />} />
            <Route path="/financial-intelligence" element={<FinancialIntelligence />} />
            <Route path="/fraud-detection" element={<FraudDetection />} />
            <Route path="/impact-measurement" element={<ImpactMeasurement />} />
            <Route path="/board-dashboard" element={<BoardDashboard />} />
            <Route path="/csr-reporting" element={<CSRReporting />} />
            <Route path="/admin/products" element={<ProductCatalog />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RuleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
