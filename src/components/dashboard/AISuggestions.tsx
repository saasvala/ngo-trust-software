import { useRules } from "@/contexts/RuleContext";
import { Sparkles, TrendingUp, AlertCircle, Calendar, Lightbulb } from "lucide-react";

export const AISuggestions = () => {
  const { location, permissions } = useRules();

  const suggestions = [
    {
      type: 'compliance',
      icon: AlertCircle,
      title: 'Renewal Alert',
      description: location.country?.countryCode === 'IN' 
        ? '80G certificate expires in 45 days. Start renewal now.'
        : 'Annual filing deadline in 60 days. Prepare documents.',
      priority: 'high',
    },
    {
      type: 'funding',
      icon: TrendingUp,
      title: 'Funding Opportunity',
      description: 'Q4 typically sees 35% more donations. Plan campaigns accordingly.',
      priority: 'medium',
    },
    {
      type: 'deadline',
      icon: Calendar,
      title: 'Upcoming Deadline',
      description: `${location.country?.fiscalYear.label || 'FY'} end approaching. Complete reconciliation.`,
      priority: 'medium',
    },
    {
      type: 'insight',
      icon: Lightbulb,
      title: 'Utilization Insight',
      description: 'Current utilization at 67.8%. Target 75% for optimal rating.',
      priority: 'low',
    },
  ];

  const priorityColors = {
    high: 'bg-coral/20 text-coral',
    medium: 'bg-primary/20 text-primary',
    low: 'bg-teal/20 text-teal',
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-coral">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-foreground">AI Suggestions</h3>
        <span className="ml-auto text-xs text-muted-foreground">Powered by AI</span>
      </div>

      <div className="space-y-3">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <div key={index} className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${priorityColors[suggestion.priority as keyof typeof priorityColors]}`}>
                <suggestion.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{suggestion.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          AI analyzes country rules, patterns & deadlines • Suggestions only, no auto-actions
        </p>
      </div>
    </div>
  );
};
