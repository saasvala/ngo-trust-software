import { useRules } from "@/contexts/RuleContext";
import { Network, Building2, Globe, MapPin } from "lucide-react";

const federationData = [
  { level: 'Global HQ', name: 'International Foundation', ngos: 156, countries: 12 },
  { level: 'Country', name: 'National Chapter', ngos: 24, states: 8 },
  { level: 'State', name: 'Regional Office', ngos: 6, districts: 15 },
];

export const FederationWidget = () => {
  const { location, permissions } = useRules();

  if (!permissions?.canManageFederation) return null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Federation Overview</h3>
      </div>
      
      <div className="space-y-3">
        {federationData.map((level, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className={`p-2 rounded-lg ${
              index === 0 ? 'bg-primary/20 text-primary' :
              index === 1 ? 'bg-teal/20 text-teal' :
              'bg-coral/20 text-coral'
            }`}>
              {index === 0 ? <Globe className="w-4 h-4" /> :
               index === 1 ? <Building2 className="w-4 h-4" /> :
               <MapPin className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{level.name}</p>
              <p className="text-xs text-muted-foreground">{level.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{level.ngos}</p>
              <p className="text-xs text-muted-foreground">NGOs</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Data aggregation respects NGO ownership • No donor-level data leakage
        </p>
      </div>
    </div>
  );
};
