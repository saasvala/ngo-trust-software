import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CertificateCard } from "@/components/compliance/CertificateCard";
import { UploadModal } from "@/components/compliance/UploadModal";
import { ReminderSettings } from "@/components/compliance/ReminderSettings";
import { ComplianceHistory } from "@/components/compliance/ComplianceHistory";
import { ComplianceStats } from "@/components/compliance/ComplianceStats";
import { Info, ExternalLink } from "lucide-react";

const Compliance = () => {
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    type: "12A" | "80G";
  }>({ isOpen: false, type: "12A" });

  const certificates = {
    "12A": {
      regNumber: "12A/2023/78901",
      issuedDate: "01 April 2023",
      validTill: "31 March 2028",
      status: "valid" as const,
      daysRemaining: 1825,
    },
    "80G": {
      regNumber: "80G/2023/45678",
      issuedDate: "15 May 2023",
      validTill: "14 May 2026",
      status: "expiring" as const,
      daysRemaining: 98,
    },
  };

  return (
    <MainLayout
      title="Compliance"
      subtitle="12A & 80G Certificate Management"
    >
      {/* Info Banner */}
      <div className="glass-card p-4 mb-6 flex items-start gap-4 border border-primary/20">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">
            Tax Exemption Compliance
          </h4>
          <p className="text-sm text-muted-foreground">
            Maintain valid 12A and 80G certificates to ensure your NGO's tax-exempt
            status and provide donation receipts to donors. Keep certificates updated
            and start renewal process at least 90 days before expiry.
          </p>
        </div>
        <a
          href="https://incometaxindia.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1 flex-shrink-0"
        >
          IT Portal <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <ComplianceStats />
      </div>

      {/* Certificate Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CertificateCard
          type="12A"
          {...certificates["12A"]}
          onUpload={() => setUploadModal({ isOpen: true, type: "12A" })}
          onView={() => console.log("View 12A")}
        />
        <CertificateCard
          type="80G"
          {...certificates["80G"]}
          onUpload={() => setUploadModal({ isOpen: true, type: "80G" })}
          onView={() => console.log("View 80G")}
        />
      </div>

      {/* Reminder Settings & 80G Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ReminderSettings />

        {/* 80G Receipt Info */}
        <div className="glass-card p-6">
          <h3 className="font-semibold text-foreground mb-4">
            80G Receipt Requirements
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            All 80G receipts must include the following information as per Income Tax rules:
          </p>
          <div className="space-y-2">
            {[
              "NGO Name, Address & PAN",
              "80G Registration Number",
              "Donor Name & PAN (Mandatory)",
              "Donation Amount & Date",
              "Mode of Payment",
              "Unique Receipt Number",
              "Authorized Signatory",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                  {index + 1}
                </div>
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <ComplianceHistory />

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ ...uploadModal, isOpen: false })}
        certificateType={uploadModal.type}
      />
    </MainLayout>
  );
};

export default Compliance;
