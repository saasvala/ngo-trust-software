import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useRules } from "@/contexts/RuleContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Search, Plus, Receipt, CreditCard, Banknote, Smartphone,
  Building2, Globe, CheckCircle2, XCircle, Heart, Calendar,
  Download, Filter, FileText
} from "lucide-react";
import { generate80GReceipt } from "@/lib/utils/generate80GReceipt";

interface Donor {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  pan_number: string | null;
  donor_type: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
}

interface Donation {
  id: string;
  donation_number: string;
  amount: number;
  currency: string;
  payment_mode: string;
  donation_date: string;
  purpose: string | null;
  tax_benefit_eligible: boolean;
  receipt_issued: boolean;
  receipt_number: string | null;
  donors: { full_name: string } | null;
  projects: { name: string } | null;
}

const paymentModes = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "bank_transfer", label: "Bank Transfer", icon: Building2 },
  { value: "cheque", label: "Cheque", icon: Receipt },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "online", label: "Online", icon: Globe },
];

const Donations = () => {
  const { location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";

  const [donations, setDonations] = useState<Donation[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPOS, setShowPOS] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [donorSearch, setDonorSearch] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // POS form
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [projectId, setProjectId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [taxEligible, setTaxEligible] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [donationsRes, donorsRes, projectsRes] = await Promise.all([
      supabase.from("donations").select("*, donors(full_name), projects(name)").order("donation_date", { ascending: false }),
      supabase.from("donors").select("id, full_name, email, phone, pan_number, donor_type").eq("is_active", true),
      supabase.from("projects").select("id, name, status").eq("status", "active"),
    ]);
    if (donationsRes.data) setDonations(donationsRes.data as any);
    if (donorsRes.data) setDonors(donorsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    setLoading(false);
  };

  const filteredDonors = donors.filter(d =>
    d.full_name.toLowerCase().includes(donorSearch.toLowerCase()) ||
    (d.phone && d.phone.includes(donorSearch)) ||
    (d.email && d.email.toLowerCase().includes(donorSearch.toLowerCase()))
  );

  const filteredDonations = donations.filter(d =>
    d.donation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.donors?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.projects?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitDonation = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const donationNumber = `DON-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from("donations").insert({
      donation_number: donationNumber,
      donor_id: selectedDonor?.id || null,
      amount: parseFloat(amount),
      currency: location.country?.currency.code || "INR",
      payment_mode: paymentMode,
      project_id: projectId || null,
      purpose: purpose || null,
      tax_benefit_eligible: taxEligible,
      donation_date: new Date().toISOString().split("T")[0],
      created_by: "demo",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error saving donation", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Donation recorded!", description: `${donationNumber} - ${currencySymbol}${parseFloat(amount).toLocaleString()}` });
      setShowPOS(false);
      resetForm();
      fetchData();
    }
  };

  const resetForm = () => {
    setAmount("");
    setPaymentMode("cash");
    setProjectId("");
    setPurpose("");
    setTaxEligible(true);
    setSelectedDonor(null);
    setDonorSearch("");
  };

  const handleGenerate80G = async (donation: Donation) => {
    const donor = donors.find(d => d.full_name === donation.donors?.full_name);
    await generate80GReceipt({
      receiptNumber: donation.receipt_number || `80G-${donation.donation_number}`,
      donationNumber: donation.donation_number,
      donorName: donation.donors?.full_name || "Anonymous",
      donorPAN: donor?.pan_number || null,
      donorAddress: null,
      amount: Number(donation.amount),
      currency: donation.currency,
      currencySymbol,
      paymentMode: donation.payment_mode,
      donationDate: donation.donation_date,
      purpose: donation.purpose,
      projectName: donation.projects?.name || null,
    });
    toast({ title: "80G Receipt Generated", description: `PDF downloaded for ${donation.donation_number}` });
  };

  return (
    <MainLayout title="Donations" subtitle="POS-style donation entry & history">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search donations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Button onClick={() => setShowPOS(true)} className="btn-gradient gap-2">
            <Plus className="w-4 h-4" /> New Donation
          </Button>
        </div>

        {/* POS Modal */}
        <Dialog open={showPOS} onOpenChange={setShowPOS}>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> Record New Donation
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Left: Donor & Amount */}
              <div className="space-y-4">
                {/* Donor Search */}
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Donor</Label>
                  {selectedDonor ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div>
                        <p className="font-medium text-foreground">{selectedDonor.full_name}</p>
                        <p className="text-xs text-muted-foreground">{selectedDonor.phone || selectedDonor.email || "No contact"}</p>
                      </div>
                      <button onClick={() => setSelectedDonor(null)} className="text-muted-foreground hover:text-foreground">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search donor by name, phone..."
                          value={donorSearch}
                          onChange={e => setDonorSearch(e.target.value)}
                          className="pl-10 bg-secondary border-border"
                        />
                      </div>
                      {donorSearch && (
                        <div className="max-h-32 overflow-y-auto rounded-lg bg-secondary/50 border border-border">
                          {filteredDonors.length === 0 ? (
                            <p className="p-3 text-sm text-muted-foreground">No donors found</p>
                          ) : (
                            filteredDonors.slice(0, 5).map(d => (
                              <button
                                key={d.id}
                                onClick={() => { setSelectedDonor(d); setDonorSearch(""); }}
                                className="w-full text-left px-3 py-2 hover:bg-secondary transition-colors text-sm"
                              >
                                <span className="font-medium text-foreground">{d.full_name}</span>
                                {d.phone && <span className="text-muted-foreground ml-2">· {d.phone}</span>}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-primary">{currencySymbol}</span>
                    <Input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0"
                      className="pl-10 text-2xl font-bold h-14 bg-secondary border-border"
                    />
                  </div>
                  {amount && parseFloat(amount) > 0 && (
                    <p className="text-xs text-success mt-1">
                      {currencySymbol}{parseFloat(amount).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Purpose */}
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Purpose (optional)</Label>
                  <Input
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                    placeholder="e.g., Education support"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              {/* Right: Payment & Project */}
              <div className="space-y-4">
                {/* Payment Mode */}
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Payment Mode</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {paymentModes.map(pm => {
                      const Icon = pm.icon;
                      return (
                        <button
                          key={pm.value}
                          onClick={() => setPaymentMode(pm.value)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all text-xs font-medium ${
                            paymentMode === pm.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {pm.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Project */}
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Map to Project</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select project (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tax Benefit */}
                <div
                  onClick={() => setTaxEligible(!taxEligible)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    taxEligible
                      ? "border-success/50 bg-success/10"
                      : "border-border bg-secondary/50"
                  }`}
                >
                  {taxEligible ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {location.country?.countryCode === "IN" ? "80G" : "Tax"} Benefit Eligible
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {taxEligible ? "Receipt will include tax benefit details" : "No tax benefit applied"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div>
                {amount && parseFloat(amount) > 0 && (
                  <p className="text-2xl font-bold text-foreground">
                    Total: <span className="text-primary">{currencySymbol}{parseFloat(amount).toLocaleString()}</span>
                  </p>
                )}
              </div>
              <Button
                onClick={handleSubmitDonation}
                disabled={submitting || !amount || parseFloat(amount) <= 0}
                className="btn-gradient gap-2 px-8"
              >
                {submitting ? "Saving..." : "Record Donation"}
                <Receipt className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Donations", value: donations.length, sub: "All time" },
            { label: "Total Amount", value: `${currencySymbol}${donations.reduce((s, d) => s + Number(d.amount), 0).toLocaleString()}`, sub: "All time" },
            { label: "Tax Eligible", value: donations.filter(d => d.tax_benefit_eligible).length, sub: "With 80G" },
          ].map(s => (
            <div key={s.label} className="glass-card p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Donations Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Donations</h3>
            <button className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Project</th>
                  <th>Date</th>
                  <th>Tax</th>
                  <th>80G</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                ) : filteredDonations.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No donations found</td></tr>
                ) : (
                  filteredDonations.map(d => (
                    <tr key={d.id}>
                      <td className="font-mono text-xs text-primary">{d.donation_number}</td>
                      <td className="font-medium text-foreground">{d.donors?.full_name || "Anonymous"}</td>
                      <td className="font-semibold text-foreground">{currencySymbol}{Number(d.amount).toLocaleString()}</td>
                      <td><span className="badge-primary capitalize">{d.payment_mode.replace("_", " ")}</span></td>
                      <td className="text-muted-foreground">{d.projects?.name || "—"}</td>
                      <td className="text-muted-foreground">{new Date(d.donation_date).toLocaleDateString()}</td>
                      <td>
                        {d.tax_benefit_eligible ? (
                          <span className="badge-success">80G</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No</span>
                        )}
                      </td>
                      <td>
                        {d.tax_benefit_eligible && (
                          <button
                            onClick={() => handleGenerate80G(d)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <FileText className="w-3 h-3" /> Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Donations;
