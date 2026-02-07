import { Shield, CheckCircle, AlertTriangle, Clock, Calendar } from "lucide-react";

interface CertificateCardProps {
  type: "12A" | "80G";
  regNumber: string;
  issuedDate: string;
  validTill: string;
  status: "valid" | "expiring" | "expired";
  daysRemaining: number;
  onUpload: () => void;
  onView: () => void;
}

const statusConfig = {
  valid: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-400/20",
    border: "border-emerald-400/30",
    label: "Valid",
  },
  expiring: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/20",
    border: "border-amber-400/30",
    label: "Expiring Soon",
  },
  expired: {
    icon: Clock,
    color: "text-red-400",
    bg: "bg-red-400/20",
    border: "border-red-400/30",
    label: "Expired",
  },
};

export const CertificateCard = ({
  type,
  regNumber,
  issuedDate,
  validTill,
  status,
  daysRemaining,
  onUpload,
  onView,
}: CertificateCardProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className={`glass-card p-6 border ${config.border}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {type} Certificate
            </h3>
            <p className="text-sm text-muted-foreground">
              Income Tax Exemption
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-muted-foreground">Registration No.</span>
          <span className="font-mono font-medium text-foreground">{regNumber}</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-muted-foreground">Issued Date</span>
          <span className="text-foreground">{issuedDate}</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-muted-foreground">Valid Until</span>
          <span className="text-foreground">{validTill}</span>
        </div>
      </div>

      {/* Expiry Indicator */}
      <div className={`p-4 rounded-xl ${config.bg} mb-6`}>
        <div className="flex items-center gap-3">
          <Calendar className={`w-5 h-5 ${config.color}`} />
          <div>
            <p className={`font-semibold ${config.color}`}>
              {status === "expired"
                ? "Certificate Expired"
                : status === "expiring"
                ? `Expires in ${daysRemaining} days`
                : `${daysRemaining} days remaining`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {status === "expired"
                ? "Please renew immediately to maintain compliance"
                : status === "expiring"
                ? "Start renewal process now"
                : "Certificate is in good standing"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onView}
          className="flex-1 py-2.5 px-4 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors"
        >
          View Certificate
        </button>
        <button
          onClick={onUpload}
          className="flex-1 py-2.5 px-4 rounded-lg btn-gradient"
        >
          {status === "expired" ? "Upload New" : "Update"}
        </button>
      </div>
    </div>
  );
};
