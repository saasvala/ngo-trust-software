import { MoreHorizontal, ArrowUpRight } from "lucide-react";

const donations = [
  {
    id: "DN-2024-001",
    donor: "Rajesh Kumar",
    amount: "₹50,000",
    project: "Education Fund",
    date: "Today, 10:30 AM",
    mode: "UPI",
    is80g: true,
  },
  {
    id: "DN-2024-002",
    donor: "Priya Sharma",
    amount: "₹25,000",
    project: "Healthcare Initiative",
    date: "Today, 09:15 AM",
    mode: "Bank Transfer",
    is80g: true,
  },
  {
    id: "DN-2024-003",
    donor: "Anonymous",
    amount: "₹10,000",
    project: "General Fund",
    date: "Yesterday",
    mode: "Cash",
    is80g: false,
  },
  {
    id: "DN-2024-004",
    donor: "Amit Patel",
    amount: "₹1,00,000",
    project: "Rural Development",
    date: "Yesterday",
    mode: "Cheque",
    is80g: true,
  },
  {
    id: "DN-2024-005",
    donor: "Sunita Devi",
    amount: "₹15,000",
    project: "Women Empowerment",
    date: "2 days ago",
    mode: "Online",
    is80g: true,
  },
];

export const RecentDonations = () => {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Recent Donations</h3>
          <p className="text-sm text-muted-foreground">Latest contributions received</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Donor</th>
              <th>Amount</th>
              <th>Project</th>
              <th>Mode</th>
              <th>80G</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td className="font-mono text-primary">{donation.id}</td>
                <td className="font-medium">{donation.donor}</td>
                <td className="font-semibold text-emerald-400">{donation.amount}</td>
                <td>{donation.project}</td>
                <td>
                  <span className="badge-primary">{donation.mode}</span>
                </td>
                <td>
                  {donation.is80g ? (
                    <span className="badge-success">Eligible</span>
                  ) : (
                    <span className="badge-warning">N/A</span>
                  )}
                </td>
                <td className="text-muted-foreground">{donation.date}</td>
                <td>
                  <button className="p-1 rounded hover:bg-secondary">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
