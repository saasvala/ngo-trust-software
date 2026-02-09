import { useState } from "react";
import { useRules } from "@/contexts/RuleContext";
import { countries, getStatesByCountry } from "@/lib/data/countries";
import { CountryRules, StateRules } from "@/lib/types/rules";
import { Globe, MapPin, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const LocationSettings = () => {
  const { location, setCountry, setState, completeSetup, currentRole } = useRules();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryRules | null>(location.country);
  const [selectedState, setSelectedState] = useState<StateRules | null>(location.state);

  const isSuperAdmin = currentRole === 'super_admin';
  const states = selectedCountry ? getStatesByCountry(selectedCountry.countryCode) : [];

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

  const handleCountryChange = (country: CountryRules) => {
    setSelectedCountry(country);
    setSelectedState(null);
  };

  const handleSave = () => {
    if (selectedCountry && selectedState) {
      setCountry(selectedCountry.countryCode);
      setState(selectedState.stateCode);
      completeSetup();
      setIsEditing(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Location Configuration</h3>
            <p className="text-sm text-muted-foreground">Regional settings and compliance rules</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary/50 text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span className="text-sm">Only Super Admin can modify location settings</span>
        </div>

        {location.country && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <span className="text-2xl">{getCountryFlag(location.country.countryCode)}</span>
              <div>
                <p className="font-medium text-foreground">{location.country.countryName}</p>
                <p className="text-xs text-muted-foreground">{location.state?.stateName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Location Configuration</h3>
            <p className="text-sm text-muted-foreground">Regional settings and compliance rules</p>
          </div>
        </div>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              {location.isConfigured ? 'Change' : 'Configure'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Location Configuration</DialogTitle>
              <DialogDescription>
                This determines currency, tax rules, and compliance requirements for the entire system.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Country Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <Globe className="w-4 h-4 text-primary" />
                  Country
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {countries.map((country) => (
                    <button
                      key={country.countryCode}
                      onClick={() => handleCountryChange(country)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedCountry?.countryCode === country.countryCode
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCountryFlag(country.countryCode)}</span>
                        <span className="text-sm font-medium text-foreground">{country.countryName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* State Selection */}
              {selectedCountry && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    State / Region
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {states.map((state) => (
                      <button
                        key={state.stateCode}
                        onClick={() => setSelectedState(state)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedState?.stateCode === state.stateCode
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 bg-secondary/50"
                        }`}
                      >
                        <span className="text-sm font-medium text-foreground">{state.stateName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 text-warning">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">
                  Changing location affects currency, tax rules, and compliance requirements across the entire system.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!selectedCountry || !selectedState}
              >
                Save Configuration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Configuration */}
      {location.country ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
            <span className="text-2xl">{getCountryFlag(location.country.countryCode)}</span>
            <div className="flex-1">
              <p className="font-medium text-foreground">{location.country.countryName}</p>
              <p className="text-sm text-muted-foreground">{location.state?.stateName}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">{location.country.currency.symbol} {location.country.currency.code}</p>
              <p className="text-xs text-muted-foreground">{location.country.fiscalYear.label}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {location.country.complianceTypes.map(ct => (
              <span key={ct.id} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                {ct.name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-warning/10 text-warning text-sm">
          No location configured. Click "Configure" to set up regional settings.
        </div>
      )}
    </div>
  );
};
