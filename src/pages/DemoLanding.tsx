import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRules } from "@/contexts/RuleContext";
import { AppRole } from "@/lib/types/rules";
import { getRoleLabel } from "@/lib/data/roles";
import { 
  Shield, 
  Building2, 
  Calculator, 
  UserCog, 
  FileCheck, 
  Heart,
  Sparkles,
  ArrowRight
} from "lucide-react";

const roleCards: { role: AppRole; icon: typeof Shield; description: string; gradient: string }[] = [
  {
    role: 'super_admin',
    icon: Shield,
    description: 'Full system access, global configuration, federation control',
    gradient: 'from-primary to-purple-glow'
  },
  {
    role: 'ngo_admin',
    icon: Building2,
    description: 'NGO management, donor relations, project oversight',
    gradient: 'from-coral to-orange-500'
  },
  {
    role: 'accountant',
    icon: Calculator,
    description: 'Financial management, expense approval, audit preparation',
    gradient: 'from-teal to-emerald-500'
  },
  {
    role: 'operator',
    icon: UserCog,
    description: 'Daily operations, donation entry, receipt generation',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    role: 'auditor',
    icon: FileCheck,
    description: 'Read-only audit access, compliance verification, reports',
    gradient: 'from-amber-500 to-yellow-500'
  },
  {
    role: 'donor',
    icon: Heart,
    description: 'Donation history, tax receipts, impact tracking',
    gradient: 'from-pink-500 to-rose-500'
  },
];

const DemoLanding = () => {
  const navigate = useNavigate();
  const { setRole, setCountry, setState, completeSetup, isSetupComplete } = useRules();
  const [loading, setLoading] = useState<AppRole | null>(null);

  const handleRoleSelect = async (role: AppRole) => {
    setLoading(role);
    
    // Auto-configure default location if not set (India - Maharashtra for demo)
    if (!isSetupComplete) {
      setCountry('IN');
      setState('MH');
      completeSetup();
    }
    
    // Set the selected role
    setRole(role);
    
    // Smooth transition delay for animation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Navigate to dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="blob w-[600px] h-[600px] bg-primary/20 -top-40 -left-40" />
      <div className="blob w-[500px] h-[500px] bg-coral/20 -bottom-32 -right-32 animation-delay-2000" />
      <div className="blob w-[400px] h-[400px] bg-teal/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animation-delay-4000" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-coral mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            NGO Manager
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Global NGO Management Software with AI-Powered Compliance
          </p>
        </div>

        {/* Demo Role Selection */}
        <div className="w-full max-w-4xl">
          <p className="text-center text-sm text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Select a role to explore the demo
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleCards.map((card, index) => {
              const Icon = card.icon;
              const isLoading = loading === card.role;
              
              return (
                <button
                  key={card.role}
                  onClick={() => handleRoleSelect(card.role)}
                  disabled={loading !== null}
                  className="group glass-card p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {getRoleLabel(card.role)}
                        </h3>
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '700ms' }}>
          <p className="text-xs text-muted-foreground">
            Demo Mode • Pre-loaded with sample data • All features functional
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoLanding;
