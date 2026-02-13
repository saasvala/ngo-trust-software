import jsPDF from "jspdf";
import QRCode from "qrcode";

interface ReceiptData {
  receiptNumber: string;
  donationNumber: string;
  donorName: string;
  donorPAN: string | null;
  donorAddress: string | null;
  amount: number;
  currency: string;
  currencySymbol: string;
  paymentMode: string;
  donationDate: string;
  purpose: string | null;
  projectName: string | null;
}

interface NGODetails {
  name: string;
  pan: string;
  registrationNumber80G: string;
  registrationDate80G: string;
  registrationValidity: string;
  registration12A: string;
  address: string;
  authorizedSignatory: string;
  signatoryDesignation: string;
}

const DEFAULT_NGO: NGODetails = {
  name: "Sarva Seva Foundation",
  pan: "AACTS1234F",
  registrationNumber80G: "AACTS1234F/80G/2023-24/10234",
  registrationDate80G: "01-Apr-2023",
  registrationValidity: "AY 2024-25 onwards (Perpetuity)",
  registration12A: "AACTS1234F/12A/2023-24/10234",
  address: "45, Mahatma Gandhi Road, Bengaluru, Karnataka – 560001",
  authorizedSignatory: "Dr. Anand Sharma",
  signatoryDesignation: "Managing Trustee",
};

function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + numberToWords(-num);

  let words = "";
  if (Math.floor(num / 10000000) > 0) {
    words += numberToWords(Math.floor(num / 10000000)) + " Crore ";
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    words += numberToWords(Math.floor(num / 100000)) + " Lakh ";
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += numberToWords(Math.floor(num / 1000)) + " Thousand ";
    num %= 1000;
  }
  if (Math.floor(num / 100) > 0) {
    words += ones[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num > 0) {
    if (words !== "") words += "and ";
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) words += "-" + ones[num % 10];
    }
  }
  return words.trim();
}

export async function generate80GReceipt(data: ReceiptData, ngo: NGODetails = DEFAULT_NGO) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // QR Code data
  const qrPayload = JSON.stringify({
    receipt: data.receiptNumber,
    donation: data.donationNumber,
    amount: data.amount,
    donor: data.donorName,
    pan: data.donorPAN || "N/A",
    date: data.donationDate,
    ngo_pan: ngo.pan,
    reg_80g: ngo.registrationNumber80G,
  });
  const qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 200, margin: 1 });

  // --- Header ---
  doc.setFillColor(17, 24, 39); // dark header
  doc.rect(0, 0, pageWidth, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(ngo.name, margin, 16);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(ngo.address, margin, 23);
  doc.text(`PAN: ${ngo.pan}  |  12A Reg: ${ngo.registration12A}`, margin, 29);
  doc.text(`80G Reg: ${ngo.registrationNumber80G}`, margin, 35);

  // QR code in header area
  doc.addImage(qrDataUrl, "PNG", pageWidth - margin - 28, 6, 28, 28);

  y = 50;

  // --- Title ---
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DONATION RECEIPT UNDER SECTION 80G", pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Income Tax Act, 1961 — For claiming deduction under Section 80G", pageWidth / 2, y, { align: "center" });
  y += 10;

  // --- Receipt Info Row ---
  doc.setDrawColor(229, 231, 235);
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "FD");
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(`Receipt No: ${data.receiptNumber}`, margin + 5, y + 6);
  doc.text(`Donation No: ${data.donationNumber}`, margin + 70, y + 6);
  doc.text(`Date: ${new Date(data.donationDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, margin + 140, y + 6);
  y += 20;

  // --- Donor Details ---
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("DONOR DETAILS", margin, y);
  y += 2;
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + 38, y);
  y += 6;

  const drawField = (label: string, value: string, xPos: number, yPos: number, width: number) => {
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(label, xPos, yPos);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.text(value || "—", xPos, yPos + 5);
  };

  drawField("Full Name", data.donorName, margin, y, contentWidth / 2);
  drawField("PAN Number", data.donorPAN || "Not Provided", margin + contentWidth / 2, y, contentWidth / 2);
  y += 14;
  drawField("Address", data.donorAddress || "On Record", margin, y, contentWidth);
  y += 16;

  // --- Donation Details ---
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("DONATION DETAILS", margin, y);
  y += 2;
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + 44, y);
  y += 6;

  // Amount box
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "FD");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Amount Received", margin + 5, y + 6);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(5, 150, 105);
  doc.text(`${data.currencySymbol} ${data.amount.toLocaleString("en-IN")}`, margin + 5, y + 15);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(`(${numberToWords(Math.floor(data.amount))} Rupees Only)`, margin + 70, y + 15);
  y += 26;

  drawField("Payment Mode", data.paymentMode.replace("_", " ").toUpperCase(), margin, y, contentWidth / 3);
  drawField("Currency", data.currency, margin + contentWidth / 3, y, contentWidth / 3);
  drawField("Purpose", data.purpose || "General Donation", margin + (contentWidth * 2) / 3, y, contentWidth / 3);
  y += 14;
  drawField("Project", data.projectName || "Unrestricted Fund", margin, y, contentWidth / 2);
  drawField("Tax Benefit", "Eligible under Section 80G", margin + contentWidth / 2, y, contentWidth / 2);
  y += 18;

  // --- Certification ---
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("CERTIFICATION", margin, y);
  y += 2;
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.6);
  doc.line(margin, y, margin + 32, y);
  y += 6;

  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 65, 81);
  const certText = `This is to certify that the donation of ${data.currencySymbol} ${data.amount.toLocaleString("en-IN")} (${numberToWords(Math.floor(data.amount))} Rupees Only) has been received from ${data.donorName} (PAN: ${data.donorPAN || "Not Provided"}) by ${ngo.name} on ${new Date(data.donationDate).toLocaleDateString("en-IN")}. This donation is eligible for deduction under Section 80G of the Income Tax Act, 1961. The organization is registered under Section 80G vide Registration No. ${ngo.registrationNumber80G} valid from ${ngo.registrationValidity}.`;
  const lines = doc.splitTextToSize(certText, contentWidth - 10);
  doc.text(lines, margin + 5, y + 6);
  y += 34;

  // --- Signatory ---
  y += 4;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  // Left: verification note
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(156, 163, 175);
  doc.text("This receipt is computer-generated and verified via QR code.", margin, y);
  doc.text("Scan the QR code above to validate this receipt.", margin, y + 4);

  // Right: signatory
  const sigX = pageWidth - margin - 50;
  doc.setDrawColor(17, 24, 39);
  doc.setLineWidth(0.4);
  doc.line(sigX, y - 2, sigX + 50, y - 2);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(ngo.authorizedSignatory, sigX, y + 3);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(ngo.signatoryDesignation, sigX, y + 8);
  doc.text("Authorized Signatory", sigX, y + 12);

  // --- Footer ---
  const footerY = 282;
  doc.setFillColor(249, 250, 251);
  doc.rect(0, footerY, pageWidth, 15, "F");
  doc.setFontSize(6);
  doc.setTextColor(156, 163, 175);
  doc.text(
    `Generated on ${new Date().toLocaleString("en-IN")}  |  ${ngo.name}  |  80G: ${ngo.registrationNumber80G}`,
    pageWidth / 2, footerY + 6, { align: "center" }
  );
  doc.text("This is a computer-generated document and does not require a physical signature.", pageWidth / 2, footerY + 10, { align: "center" });

  // Save
  doc.save(`80G_Receipt_${data.receiptNumber}.pdf`);
}
