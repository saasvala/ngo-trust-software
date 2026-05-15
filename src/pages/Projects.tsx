import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useRules } from "@/contexts/RuleContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton, EmptyState, StatCardSkeleton } from "@/components/ui/loading";
import {
  Search, Plus, FolderKanban, Calendar, TrendingUp,
  Pause, CheckCircle2, Clock, PlayCircle, IndianRupee
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  budget: number;
  spent: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; badge: string }> = {
  active: { label: "Active", icon: PlayCircle, badge: "badge-success" },
  completed: { label: "Completed", icon: CheckCircle2, badge: "badge-primary" },
  paused: { label: "Paused", icon: Pause, badge: "badge-warning" },
  planned: { label: "Planned", icon: Clock, badge: "badge-primary" },
};

const Projects = () => {
  const { location } = useRules();
  const currencySymbol = location.country?.currency.symbol || "₹";

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [donationCounts, setDonationCounts] = useState<Record<string, number>>({});

  // Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [projRes, donRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("donations").select("project_id"),
    ]);
    if (projRes.data) setProjects(projRes.data);
    if (donRes.data) {
      const counts: Record<string, number> = {};
      donRes.data.forEach(d => {
        if (d.project_id) counts[d.project_id] = (counts[d.project_id] || 0) + 1;
      });
      setDonationCounts(counts);
    }
    setLoading(false);
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = async () => {
    if (!name.trim()) { toast({ title: "Project name is required", variant: "destructive" }); return; }
    setSubmitting(true);
    const { error } = await supabase.from("projects").insert({
      name,
      description: description || null,
      budget: budget ? parseFloat(budget) : 0,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project created!" });
      setShowAdd(false);
      setName(""); setDescription(""); setBudget(""); setStartDate(""); setEndDate("");
      fetchData();
    }
  };

  const totalBudget = projects.reduce((s, p) => s + Number(p.budget), 0);
  const totalSpent = projects.reduce((s, p) => s + Number(p.spent), 0);
  const utilizationPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <MainLayout title="Projects" subtitle="Manage programs and initiatives">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-border" />
          </div>
          <Button onClick={() => setShowAdd(true)} className="btn-gradient gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>

        {/* Add Modal */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><FolderKanban className="w-5 h-5 text-primary" /> Create Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-muted-foreground mb-1.5 block">Project Name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Education Initiative" className="bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-muted-foreground mb-1.5 block">Description</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Budget ({currencySymbol})</Label>
                  <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="0" className="bg-secondary border-border" />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">Start Date</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-secondary border-border" />
                </div>
                <div>
                  <Label className="text-muted-foreground mb-1.5 block">End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-secondary border-border" />
                </div>
              </div>
              <Button onClick={handleAdd} disabled={submitting} className="w-full btn-gradient">
                {submitting ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground">Total Projects</p>
            <p className="text-2xl font-bold text-foreground mt-1">{projects.length}</p>
            <p className="text-xs text-muted-foreground">{projects.filter(p => p.status === "active").length} active</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold text-foreground mt-1">{currencySymbol}{totalBudget.toLocaleString()}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-foreground mt-1">{currencySymbol}{totalSpent.toLocaleString()}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground">Utilization</p>
            <p className="text-2xl font-bold text-foreground mt-1">{utilizationPct}%</p>
            <Progress value={utilizationPct} className="mt-2 h-1.5" />
          </div>
        </div>

        {/* Project Cards */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">No projects found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(project => {
              const pct = Number(project.budget) > 0 ? Math.round((Number(project.spent) / Number(project.budget)) * 100) : 0;
              const cfg = statusConfig[project.status] || statusConfig.active;
              const StatusIcon = cfg.icon;
              const donations = donationCounts[project.id] || 0;

              return (
                <div key={project.id} className="glass-card-hover p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <FolderKanban className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{project.name}</h3>
                        {project.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                        )}
                      </div>
                    </div>
                    <span className={cfg.badge + " flex items-center gap-1"}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Budget Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Budget Utilization</span>
                      <span className="font-medium text-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex items-center justify-between text-xs mt-1.5">
                      <span className="text-muted-foreground">
                        Spent: {currencySymbol}{Number(project.spent).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        Budget: {currencySymbol}{Number(project.budget).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {donations} donations
                      </span>
                      {project.start_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Projects;
