import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Ensure this import is included

import { Transaction } from "../types/index";
import { formatters } from "./formatters";
import { currencyUtils } from "./currency";

export const generateTransactionsPDF = (transactions: Transaction[]): void => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text("Transactions Report", 14, 15);

  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  // Define columns
  const columns = [
    { header: "Date", dataKey: "date" },
    { header: "Description", dataKey: "description" },
    { header: "Original Amount", dataKey: "originalAmount" },
    { header: "Amount in INR", dataKey: "amountInINR" },
  ];

  // Prepare the table data
  const data = transactions.map((transaction) => ({
    date: formatters.formatDate(transaction.date),
    description: transaction.description,
    originalAmount: transaction.amount,
    amountInINR: Number(
      currencyUtils.convertToINR(transaction.amount, transaction.currency)
    ),
  }));

  // Generate the table with all data, split across multiple pages if necessary
  const pageHeight = doc.internal.pageSize.height;
  const marginY = 15; // Distance from the bottom of the page
  const startY = 35; // Start position of the table on the first page

  // Add table data to PDF
  (doc as any).autoTable({
    startY,
    columns,
    body: data,
    headStyles: { fillColor: [66, 139, 202] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 35 },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      date: { cellWidth: "auto" },
      description: { cellWidth: "auto" },
      originalAmount: { cellWidth: "auto", halign: "right" },
      amountInINR: { cellWidth: "auto", halign: "right" },
    },
    didDrawPage: (data: any) => {
      // Explicitly typing `data` as `any`
      // Check if the table overflows and if it does, add a new page
      if (data.cursor.y > pageHeight - marginY) {
        doc.addPage(); // Add a new page
        doc.setFontSize(16);
        doc.text("Transactions Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
      }
    },
  });

  // Add totals summary at the bottom of the last page
  const totalINR = transactions.reduce(
    (sum, t) => sum + Number(currencyUtils.convertToINR(t.amount, t.currency)),
    0
  );

  doc.setFontSize(10);
  doc.text(
    `Total Transactions: ${transactions.length}`,
    14,
    pageHeight - marginY
  );
  doc.text(
    `Total Amount (INR): ${totalINR?.toFixed(2)}`,
    14,
    pageHeight - marginY + 5
  );

  // Save the PDF
  doc.save("transactions-report.pdf");
};
