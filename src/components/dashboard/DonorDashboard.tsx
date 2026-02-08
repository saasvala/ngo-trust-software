import { useRules } from "@/contexts/RuleContext";
import { Receipt, Download, Calendar, TrendingUp, FileText } from "lucide-react";

const mockDonations = [
  { id: 'DON-2024-001', amount: 50000, date: '15 Jan 2024', project: 'Education Fund', taxDeductible: true },
  { id: 'DON-2024-002', amount: 25000, date: '10 Feb 2024', project: 'Healthcare', taxDeductible: true },
  { id: 'DON-2024-003', amount: 100000, date: '05 Mar 2024', project: 'General Fund', taxDeductible: false },
];

export const DonorDashboard = () => {
  const { location, formatCurrency } = useRules();

  const taxLabel = location.country?.countryCode === 'IN' ? '80G' : 'Tax';
  const totalDonations = mockDonations.reduce((sum, d) => sum + d.amount, 0);
  const taxDeductible = mockDonations.filter(d => d.taxDeductible).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Donated</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalDonations)}</p>
          <p className="text-xs text-muted-foreground mt-1">This financial year</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-teal/20">
              <Receipt className="w-5 h-5 text-teal" />
            </div>
            <span className="text-sm text-muted-foreground">{taxLabel} Eligible</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(taxDeductible)}</p>
          <p className="text-xs text-muted-foreground mt-1">Tax deduction available</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-coral/20">
              <Calendar className="w-5 h-5 text-coral" />
            </div>
            <span className="text-sm text-muted-foreground">Donations</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{mockDonations.length}</p>
          <p className="text-xs text-muted-foreground mt-1">This year</p>
        </div>
      </div>

      {/* Donation History */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Donation History</h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Download All Receipts
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Receipt #</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Project</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">{taxLabel}</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {mockDonations.map((donation) => (
                <tr key={donation.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{donation.id}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{donation.date}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{donation.project}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground text-right">
                    {formatCurrency(donation.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {donation.taxDeductible ? (
                      <span className="px-2 py-1 rounded-full bg-teal/20 text-teal text-xs font-medium">
                        Eligible
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-primary">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Tax Summary for CA Filing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Financial Year</p>
            <p className="font-semibold text-foreground">{location.country?.fiscalYear.label || '2024-25'}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Total {taxLabel} Deduction</p>
            <p className="font-semibold text-foreground">{formatCurrency(taxDeductible)}</p>
          </div>
        </div>
        <button className="mt-4 w-full py-3 rounded-lg border-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
          Download Year-wise Tax Summary (PDF)
        </button>
      </div>
    </div>
  );
};
