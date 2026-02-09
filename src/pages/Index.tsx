import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRules } from "@/contexts/RuleContext";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  const { isSetupComplete } = useRules();

  useEffect(() => {
    // If no role/setup selected, redirect to demo landing
    if (!isSetupComplete) {
      navigate('/login');
    }
  }, [isSetupComplete, navigate]);

  if (!isSetupComplete) {
    return null;
  }

  return <Dashboard />;
};

export default Index;
