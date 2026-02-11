import { DashboardSection } from "../layers/DashboardSection";
import { StatCard3D } from "../layers/StatCard3D";
import { DeepResearchView } from "../layers/DeepResearchView";
import {
  ClipboardCheck, MapPin, Clock, CheckCircle, FileText, Camera
} from "lucide-react";

export const FieldExecutorDashboard = () => {
  const tasks = [
    { task: "Distribute relief kits – Sector 4", status: "pending", priority: "high", location: "Anand Nagar" },
    { task: "Collect beneficiary feedback forms", status: "pending", priority: "medium", location: "Rampur Village" },
    { task: "Document site visit photos", status: "completed", priority: "low", location: "Laxmi Colony" },
    { task: "Verify beneficiary attendance", status: "pending", priority: "high", location: "Sector 7" },
  ];

  return (
    <div className="space-y-8">
      {/* MACRO */}
      <DashboardSection level="macro" title="My Tasks Today" subtitle="Assigned field activities" icon={<ClipboardCheck className="w-6 h-6 text-white" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard3D title="Assigned Tasks" value={7} icon={<ClipboardCheck className="w-6 h-6 text-white" />} iconBg="primary" change="3 urgent" trend="neutral" />
          <StatCard3D title="Completed" value={4} icon={<CheckCircle className="w-6 h-6 text-white" />} iconBg="success" change="57% done" trend="up" />
          <StatCard3D title="Sites to Visit" value={3} icon={<MapPin className="w-6 h-6 text-white" />} iconBg="teal" change="2 remaining" trend="neutral" />
          <StatCard3D title="Reports Filed" value={2} icon={<FileText className="w-6 h-6 text-white" />} iconBg="coral" change="1 pending" trend="neutral" />
        </div>
      </DashboardSection>

      {/* MICRO - Task List */}
      <DashboardSection level="micro" title="Task Queue" subtitle="Today's field assignments" icon={<Clock className="w-5 h-5 text-primary" />} defaultExpanded={true}>
        <div className="space-y-3">
          {tasks.map((t, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl transition-colors ${t.status === 'completed' ? 'bg-success/10 border border-success/20' : 'bg-secondary/30 hover:bg-secondary/50'}`}>
              <div className="flex items-center gap-3">
                <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${t.status === 'completed' ? 'bg-success border-success' : 'border-muted-foreground hover:border-primary'}`}>
                  {t.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                <div>
                  <span className={`text-sm ${t.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{t.task}</span>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{t.location}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.priority === 'high' ? 'bg-coral/20 text-coral' : t.priority === 'medium' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}`}>{t.priority}</span>
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* NANO */}
      <DashboardSection level="nano" title="Field Evidence" subtitle="Photos and documents captured today" icon={<Camera className="w-5 h-5 text-teal" />} defaultExpanded={false}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-square rounded-lg bg-secondary/50 flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground/40" />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">4 photos captured · 2 synced · 2 pending upload</p>
      </DashboardSection>

      {/* DEEP RESEARCH */}
      <DashboardSection level="deep" title="Activity Log" subtitle="Your recent field activity history" icon={<FileText className="w-5 h-5 text-coral" />} defaultExpanded={false}>
        <DeepResearchView title="Field Activity History" subtitle="Past 30 days of field work" onExport={() => {}}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Tasks Completed", value: "127" },
              { label: "Sites Visited", value: "43" },
              { label: "Reports Filed", value: "38" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </DeepResearchView>
      </DashboardSection>
    </div>
  );
};
