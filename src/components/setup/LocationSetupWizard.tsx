import { useState } from "react";
import { Check, ChevronRight, Globe, MapPin, Building2, Sparkles } from "lucide-react";
import { countries, getStatesByCountry } from "@/lib/data/countries";
import { useRules } from "@/contexts/RuleContext";
import { CountryRules, StateRules } from "@/lib/types/rules";

interface LocationSetupWizardProps {
  onComplete: () => void;
}

export const LocationSetupWizard = ({ onComplete }: LocationSetupWizardProps) => {
  const { setCountry, setState, completeSetup, location } = useRules();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCountry, setSelectedCountry] = useState<CountryRules | null>(null);
  const [selectedState, setSelectedState] = useState<StateRules | null>(null);

  const states = selectedCountry ? getStatesByCountry(selectedCountry.countryCode) : [];

  const handleCountrySelect = (country: CountryRules) => {
    setSelectedCountry(country);
    setCountry(country.countryCode);
    setSelectedState(null);
  };

  const handleStateSelect = (state: StateRules) => {
    setSelectedState(state);
    setState(state.stateCode);
  };

  const handleComplete = () => {
    completeSetup();
    onComplete();
  };

  const canProceed = () => {
    if (step === 1) return !!selectedCountry;
    if (step === 2) return !!selectedState;
    return true;
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-coral mx-auto flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to NGO Manager</h1>
          <p className="text-muted-foreground">Configure your location to unlock country-specific features</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step > s
                    ? "bg-primary text-white"
                    : step === s
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <ChevronRight className={`w-5 h-5 ${step > s ? "text-primary" : "text-muted-foreground"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-card p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Select Your Country</h2>
                  <p className="text-sm text-muted-foreground">This determines currency, tax rules, and compliance requirements</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
                {countries.map((country) => (
                  <button
                    key={country.countryCode}
                    onClick={() => handleCountrySelect(country)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedCountry?.countryCode === country.countryCode
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCountryFlag(country.countryCode)}</span>
                      <div>
                        <p className="font-medium text-foreground">{country.countryName}</p>
                        <p className="text-xs text-muted-foreground">{country.currency.symbol} {country.currency.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Select Your State / Region</h2>
                  <p className="text-sm text-muted-foreground">This enables local registrations and regional grants</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2">
                {states.map((state) => (
                  <button
                    key={state.stateCode}
                    onClick={() => handleStateSelect(state)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedState?.stateCode === state.stateCode
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-secondary/50"
                    }`}
                  >
                    <p className="font-medium text-foreground">{state.stateName}</p>
                    {state.localRegistrations.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {state.localRegistrations.length} local registration{state.localRegistrations.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Configuration Summary</h2>
                  <p className="text-sm text-muted-foreground">Review your settings before completing setup</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-1">Country</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCountryFlag(selectedCountry?.countryCode || '')}</span>
                    <span className="font-medium text-foreground">{selectedCountry?.countryName}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-1">State / Region</p>
                  <p className="font-medium text-foreground">{selectedState?.stateName}</p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-2">Auto-Configured Features</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      {selectedCountry?.currency.symbol} {selectedCountry?.currency.code}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-teal/20 text-teal text-xs font-medium">
                      {selectedCountry?.fiscalYear.label}
                    </span>
                    {selectedCountry?.complianceTypes.map(ct => (
                      <span key={ct.id} className="px-3 py-1 rounded-full bg-coral/20 text-coral text-xs font-medium">
                        {ct.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={() => setStep((prev) => (prev > 1 ? (prev - 1) as 1 | 2 : prev))}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                step === 1
                  ? "opacity-0 pointer-events-none"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (step < 3) {
                  setStep((prev) => (prev + 1) as 2 | 3);
                } else {
                  handleComplete();
                }
              }}
              disabled={!canProceed()}
              className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? "Complete Setup" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
