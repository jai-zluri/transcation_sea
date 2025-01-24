

// // utils/pdfGenerator.ts
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { Transaction } from '../types/index';
// import { formatters } from './formatters';

// export const generateTransactionsPDF = (transactions: Transaction[]): void => {
//   const doc = new jsPDF();

//   // Add title
//   doc.setFontSize(16);
//   doc.text('Transactions Report', 14, 15);
//   doc.setFontSize(10);
//   doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

//   // Define the columns
//   const columns = [
//     { header: 'Date', dataKey: 'date' },
//     { header: 'Description', dataKey: 'description' },
//     { header: 'Original Amount', dataKey: 'originalAmount' },
//     { header: 'Amount (INR)', dataKey: 'amountInINR' }
//   ];

//   // Prepare the data
//   const data = transactions.map(transaction => ({
//     date: formatters.formatDate(transaction.date),
//     description: transaction.description,
//     originalAmount: formatters.formatCurrency(transaction.amount, transaction.currency),
//     amountInINR: formatters.formatCurrency(transaction.amountInINR || 0, 'INR')
//   }));

//   // Generate the table
//   (doc as any).autoTable({
//     startY: 35,
//     columns,
//     body: data,
//     headStyles: { fillColor: [66, 139, 202] },
//     alternateRowStyles: { fillColor: [245, 245, 245] },
//     margin: { top: 35 }
//   });

//   // Add summary
//   const totalINR = transactions.reduce((sum, t) => sum + (t.amountInINR || 0), 0);
//   const pageHeight = doc.internal.pageSize.height;
//   doc.text(`Total Amount (INR): ${formatters.formatCurrency(totalINR, 'INR')}`, 14, pageHeight - 20);
//   doc.text(`Total Transactions: ${transactions.length}`, 14, pageHeight - 15);

//   // Save the PDF
//   doc.save('transactions-report.pdf');
// };


// // utils/pdfGenerator.ts
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { Transaction } from '../types';
// import { formatters } from './formatters';
// import { currencyUtils } from './currency';

// export const generateTransactionsPDF = (transactions: Transaction[]): void => {
//   const doc = new jsPDF();

//   // Add title
//   doc.setFontSize(16);
//   doc.text('Transactions Report', 14, 15);

//   // Add timestamp
//   doc.setFontSize(10);
//   doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

//   // Define columns
//   const columns = [
//     { header: 'Date', dataKey: 'date' },
//     { header: 'Description', dataKey: 'description' },
//     { header: 'Original Amount', dataKey: 'originalAmount' },
//     { header: 'Amount in INR', dataKey: 'amountInINR' },
//   ];

//   // Prepare the table data
//   const data = transactions.map((transaction) => ({
//     date: formatters.formatDate(transaction.date),
//     description: transaction.description,
//     originalAmount: formatters.formatAmountWithCurrency(
//       transaction.amount,
//       transaction.currency
//     ),
//     amountInINR: formatters.formatAmountWithCurrency(
//       currencyUtils.convertToINR(transaction.amount, transaction.currency),
//       'INR'
//     ),
//   }));

//   // Generate the table
//   (doc as any).autoTable({
//     startY: 35,
//     columns,
//     body: data,
//     headStyles: { fillColor: [66, 139, 202] },
//     alternateRowStyles: { fillColor: [245, 245, 245] },
//     margin: { top: 35 },
//     styles: { fontSize: 9, cellPadding: 3 },
//     columnStyles: {
//       date: { cellWidth: 30 },
//       description: { cellWidth: 70 },
//       originalAmount: { cellWidth: 45, halign: 'right' },
//       amountInINR: { cellWidth: 45, halign: 'right' },
//     },
//   });

//   // Add totals summary
//   const totalINR = transactions.reduce(
//     (sum, t) => sum + currencyUtils.convertToINR(t.amount, t.currency),
//     0
//   );

//   const pageHeight = doc.internal.pageSize.height;
//   const marginY = 15; // Distance from the bottom of the page

//   doc.setFontSize(10);
//   doc.text(`Total Transactions: ${transactions.length}`, 14, pageHeight - marginY);
//   doc.text(
//     `Total Amount (INR): ${formatters.formatAmountWithCurrency(totalINR, 'INR')}`,
//     14,
//     pageHeight - marginY + 5
//   );

//   // Save the PDF
//   doc.save('transactions-report.pdf');
// };



// // utils/pdfGenerator.ts
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { Transaction } from '../types';
// import { formatters } from './formatters';
// import { currencyUtils } from './currency';

// export const generateTransactionsPDF = (transactions: Transaction[]): void => {
//   const doc = new jsPDF();

//   // Add title
//   doc.setFontSize(16);
//   doc.text('Transactions Report', 14, 15);

//   // Add timestamp
//   doc.setFontSize(10);
//   doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

//   // Define columns
//   const columns = [
//     { header: 'Date', dataKey: 'date' },
//     { header: 'Description', dataKey: 'description' },
//     { header: 'Original Amount', dataKey: 'originalAmount' },
//     { header: 'Amount in INR', dataKey: 'amountInINR' },
//   ];

//   // Prepare the table data
//   const data = transactions.map((transaction) => ({
//     date: formatters.formatDate(transaction.date), // formatted date
//     description: transaction.description, // description
//     originalAmount: transaction.amount, // original amount as number
//     amountInINR: currencyUtils.convertToINR(transaction.amount, transaction.currency), // INR amount as number
//   }));

//   // Generate the table with all data
//   (doc as any).autoTable({
//     startY: 35,
//     columns,
//     body: data,
//     headStyles: { fillColor: [66, 139, 202] },
//     alternateRowStyles: { fillColor: [245, 245, 245] },
//     margin: { top: 35 },
//     styles: { fontSize: 9, cellPadding: 3 },
//     columnStyles: {
//       date: { cellWidth: 30 },
//       description: { cellWidth: 70 },
//       originalAmount: { cellWidth: 45, halign: 'right' },
//       amountInINR: { cellWidth: 45, halign: 'right' },
//     },
//   });

//   // Add totals summary
//   const totalINR = transactions.reduce(
//     (sum, t) => sum + currencyUtils.convertToINR(t.amount, t.currency),
//     0
//   );

//   // Get page height for proper placement of total text at the bottom
//   const pageHeight = doc.internal.pageSize.height;
//   const marginY = 15; // Distance from the bottom of the page

//   doc.setFontSize(10);
//   doc.text(`Total Transactions: ${transactions.length}`, 14, pageHeight - marginY);
//   doc.text(
//     `Total Amount (INR): ${totalINR.toFixed(2)}`, // Display the total amount as number
//     14,
//     pageHeight - marginY + 5
//   );

//   // Save the PDF
//   doc.save('transactions-report.pdf');
// };


// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable'; // Ensure this import is included

// import { Transaction } from '../types/index';
// import { formatters } from './formatters';
// import { currencyUtils } from './currency';

// export const generateTransactionsPDF = (transactions: Transaction[]): void => {
//   const doc = new jsPDF();

//   // Add title
//   doc.setFontSize(16);
//   doc.text('Transactions Report', 14, 15);

//   // Add timestamp
//   doc.setFontSize(10);
//   doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

//   // Define columns
//   const columns = [
//     { header: 'Date', dataKey: 'date' },
//     { header: 'Description', dataKey: 'description' },
//     { header: 'Original Amount', dataKey: 'originalAmount' },
//     { header: 'Amount in INR', dataKey: 'amountInINR' },
//   ];

//   // Prepare the table data
//   const data = transactions.map((transaction) => ({
//     date: formatters.formatDate(transaction.date),
//     description: transaction.description,
//     originalAmount: transaction.amount,
//     amountInINR: currencyUtils.convertToINR(transaction.amount, transaction.currency),
//   }));

//   // Generate the table with all data, split across multiple pages if necessary
//   const pageHeight = doc.internal.pageSize.height;
//   const marginY = 15; // Distance from the bottom of the page
//   const startY = 35; // Start position of the table on the first page

//   // Add table data to PDF
//   (doc as any).autoTable({
//     startY,
//     columns,
//     body: data,
//     headStyles: { fillColor: [66, 139, 202] },
//     alternateRowStyles: { fillColor: [245, 245, 245] },
//     margin: { top: 35 },
//     styles: { fontSize: 9, cellPadding: 3 },
//     columnStyles: {
//       date: { cellWidth: 30 },
//       description: { cellWidth: 70 },
//       originalAmount: { cellWidth: 45, halign: 'right' },
//       amountInINR: { cellWidth: 45, halign: 'right' },
//     },
//     didDrawPage: (data: any) => { // Explicitly typing `data` as `any`
//       // Check if the table overflows and if it does, add a new page
//       if (data.cursor.y > pageHeight - marginY) {
//         doc.addPage(); // Add a new page
//         doc.setFontSize(16);
//         doc.text('Transactions Report', 14, 15);
//         doc.setFontSize(10);
//         doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
//       }
//     },
//   });

//   // Add totals summary at the bottom of the last page
//   const totalINR = transactions.reduce(
//     (sum, t) => sum + currencyUtils.convertToINR(t.amount, t.currency),
//     0
//   );

//   doc.setFontSize(10);
//   doc.text(`Total Transactions: ${transactions.length}`, 14, pageHeight - marginY);
//   doc.text(
//     `Total Amount (INR): ${totalINR.toFixed(2)}`,
//     14,
//     pageHeight - marginY + 5
//   );

//   // Save the PDF
//   doc.save('transactions-report.pdf');
// };


import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Ensure this import is included

import { Transaction } from '../types/index';
import { formatters } from './formatters';
import { currencyUtils } from './currency';

export const generateTransactionsPDF = (transactions: Transaction[]): void => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Transactions Report', 14, 15);

  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  // Define columns
  const columns = [
    { header: 'Date', dataKey: 'date' },
    { header: 'Description', dataKey: 'description' },
    { header: 'Original Amount', dataKey: 'originalAmount' },
    { header: 'Amount in INR', dataKey: 'amountInINR' },
  ];

  // Prepare the table data
  const data = transactions.map((transaction) => ({
    date: formatters.formatDate(transaction.date),
    description: transaction.description,
    originalAmount: transaction.amount,
    amountInINR: currencyUtils.convertToINR(transaction.amount, transaction.currency),
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
      date: { cellWidth: 30 },
      description: { cellWidth: 70 },
      originalAmount: { cellWidth: 45, halign: 'right' },
      amountInINR: { cellWidth: 45, halign: 'right' },
    },
    didDrawPage: (data: any) => { // Explicitly typing `data` as `any`
      // Check if the table overflows and if it does, add a new page
      if (data.cursor.y > pageHeight - marginY) {
        doc.addPage(); // Add a new page
        doc.setFontSize(16);
        doc.text('Transactions Report', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
      }
    },
  });

  // Add totals summary at the bottom of the last page
  const totalINR = transactions.reduce(
    (sum, t) => sum + currencyUtils.convertToINR(t.amount, t.currency),
    0
  );

  doc.setFontSize(10);
  doc.text(`Total Transactions: ${transactions.length}`, 14, pageHeight - marginY);
  doc.text(
    `Total Amount (INR): ${totalINR.toFixed(2)}`,
    14,
    pageHeight - marginY + 5
  );

  // Save the PDF
  doc.save('transactions-report.pdf');
};
