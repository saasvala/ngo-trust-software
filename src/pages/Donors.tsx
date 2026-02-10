import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, Users, Phone, Mail, CreditCard, Building2, User, UserCheck } from "lucide-react";

interface Donor {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  pan_number: string | null;
  donor_type: string;
  city: string | null;
  state: string | null;
  is_active: boolean;
  created_at: string;
}

const Donors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  // Add form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [donorType, setDonorType] = useState("individual");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchDonors(); }, []);

  const fetchDonors = async () => {
    setLoading(true);
    const { data } = await supabase.from("donors").select("*").order("created_at", { ascending: false });
    if (data) setDonors(data);
    setLoading(false);
  };

  const filtered = donors.filter(d =>
    d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.phone && d.phone.includes(searchQuery)) ||
    (d.email && d.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = async () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSubmitting(true);
    const { error } = await supabase.from("donors").insert({
      full_name: name,
      email: email || null,
      phone: phone || null,
      pan_number: pan || null,
      donor_type: donorType,
      city: city || null,
      state: state || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Donor added!" });
      setShowAdd(false);
      setName(""); setEmail(""); setPhone(""); setPan(""); setCity(""); setState("");
      fetchDonors();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "corporate": return <Building2 className="w-4 h-4" />;
      case "anonymous": return <User className="w-4 h-4" />;
      default: return <UserCheck className="w-4 h-4" />;
    }
  };

  return (
    <MainLayout title="Donors" subtitle="Manage your donor database">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search donors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-border" />
          </div>
          <Button onClick={() => setShowAdd(true)} className="btn-gradient gap-2">
            <Plus className="w-4 h-4" /> Add Donor
          </Button>
        </div>

        {/* Add Modal */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Add New Donor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-muted-foreground mb-1.5 block">Full Name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Donor full name" className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Email</Label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="bg-secondary border-border" />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Phone</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">PAN Number</Label>
                  <Input value={pan} onChange={e => setPan(e.target.value)} placeholder="ABCPS1234D" className="bg-secondary border-border" />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Type</Label>
                  <Select value={donorType} onValueChange={setDonorType}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="csr">CSR</SelectItem>
                      <SelectItem value="anonymous">Anonymous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">City</Label>
                  <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" className="bg-secondary border-border" />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">State</Label>
                  <Input value={state} onChange={e => setState(e.target.value)} placeholder="Maharashtra" className="bg-secondary border-border" />
                </div>
              </div>
              <Button onClick={handleAdd} disabled={submitting} className="w-full btn-gradient">
                {submitting ? "Adding..." : "Add Donor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground">Total Donors</p>
            <p className="text-2xl font-bold text-foreground mt-1">{donors.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground">Individual</p>
            <p className="text-2xl font-bold text-foreground mt-1">{donors.filter(d => d.donor_type === "individual").length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground">Corporate / CSR</p>
            <p className="text-2xl font-bold text-foreground mt-1">{donors.filter(d => ["corporate", "csr"].includes(d.donor_type)).length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>PAN</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No donors found</td></tr>
                ) : (
                  filtered.map(d => (
                    <tr key={d.id}>
                      <td className="font-medium text-foreground flex items-center gap-2">
                        {getTypeIcon(d.donor_type)}
                        {d.full_name}
                      </td>
                      <td><span className="badge-primary capitalize">{d.donor_type}</span></td>
                      <td className="text-muted-foreground text-xs">
                        {d.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{d.phone}</span>}
                        {d.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{d.email}</span>}
                      </td>
                      <td className="font-mono text-xs text-muted-foreground">{d.pan_number || "—"}</td>
                      <td className="text-muted-foreground text-xs">{[d.city, d.state].filter(Boolean).join(", ") || "—"}</td>
                      <td>{d.is_active ? <span className="badge-success">Active</span> : <span className="badge-warning">Inactive</span>}</td>
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

export default Donors;
