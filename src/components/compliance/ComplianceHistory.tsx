import { FileText, Download, Eye, Calendar, CheckCircle } from "lucide-react";

interface HistoryItem {
  id: string;
  type: "12A" | "80G";
  regNumber: string;
  issuedDate: string;
  validTill: string;
  uploadedOn: string;
  uploadedBy: string;
  status: "current" | "archived";
}

const history: HistoryItem[] = [
  {
    id: "1",
    type: "12A",
    regNumber: "12A/2023/78901",
    issuedDate: "01 Apr 2023",
    validTill: "31 Mar 2028",
    uploadedOn: "15 Apr 2023",
    uploadedBy: "Admin User",
    status: "current",
  },
  {
    id: "2",
    type: "80G",
    regNumber: "80G/2023/45678",
    issuedDate: "15 May 2023",
    validTill: "14 May 2026",
    uploadedOn: "20 May 2023",
    uploadedBy: "Admin User",
    status: "current",
  },
  {
    id: "3",
    type: "12A",
    regNumber: "12A/2018/34567",
    issuedDate: "01 Apr 2018",
    validTill: "31 Mar 2023",
    uploadedOn: "10 Apr 2018",
    uploadedBy: "Previous Admin",
    status: "archived",
  },
  {
    id: "4",
    type: "80G",
    regNumber: "80G/2020/23456",
    issuedDate: "01 Jun 2020",
    validTill: "31 May 2023",
    uploadedOn: "05 Jun 2020",
    uploadedBy: "Previous Admin",
    status: "archived",
  },
];

export const ComplianceHistory = () => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Certificate History</h3>
        <p className="text-sm text-muted-foreground">
          All uploaded certificates and their validity periods
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Certificate</th>
              <th>Registration No.</th>
              <th>Validity Period</th>
              <th>Uploaded</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{item.type}</span>
                  </div>
                </td>
                <td className="font-mono text-sm">{item.regNumber}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {item.issuedDate} - {item.validTill}
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <p className="text-sm">{item.uploadedOn}</p>
                    <p className="text-xs text-muted-foreground">
                      by {item.uploadedBy}
                    </p>
                  </div>
                </td>
                <td>
                  {item.status === "current" ? (
                    <span className="inline-flex items-center gap-1 badge-success">
                      <CheckCircle className="w-3 h-3" />
                      Current
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      Archived
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
