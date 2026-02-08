import { useRules } from "@/contexts/RuleContext";
import { Globe, MapPin } from "lucide-react";

export const LocationBadge = () => {
  const { location, isSetupComplete } = useRules();

  if (!isSetupComplete || !location.country) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/20 text-warning text-sm">
        <Globe className="w-4 h-4" />
        <span>Setup Required</span>
      </div>
    );
  }

  const getCountryFlag = (code: string): string => {
    const flags: Record<string, string> = {
      IN: '🇮🇳',
      US: '🇺🇸',
      GB: '🇬🇧',
      CA: '🇨🇦',
      AU: '🇦🇺',
    };
    return flags[code] || '🌍';
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm">
      <span className="text-base">{getCountryFlag(location.country.countryCode)}</span>
      <span className="font-medium">{location.state?.stateName}</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{location.country.currency.symbol}</span>
    </div>
  );
};
