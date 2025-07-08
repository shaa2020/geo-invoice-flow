
import jsPDF from 'jspdf';
import { Invoice, formatDate } from './invoiceUtils';

// Enhanced currency formatter for Bengali Taka with proper encoding
const formatCurrency = (amount: number): string => {
  const formattedAmount = amount.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `BDT ${formattedAmount}`;
};

export const generateProfessionalInvoicePDF = (invoice: Invoice): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Set font for better compatibility
  doc.setFont('helvetica');
  
  // Professional color scheme
  const primaryColor = [30, 64, 175]; // Deep blue
  const accentColor = [59, 130, 246]; // Light blue
  const grayColor = [75, 85, 99];
  const darkGrayColor = [31, 41, 55];
  const lightGrayColor = [243, 244, 246];
  
  // Header section with gradient effect
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company branding
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GEO FASHION', 20, 22);
  
  // Invoice title with professional styling
  doc.setFontSize(18);
  doc.text('INVOICE', pageWidth - 20, 22, { align: 'right' });
  
  // Subtitle line
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Fashion Solutions', 20, 30);
  
  // Company details section
  doc.setTextColor(...darkGrayColor);
  doc.setFontSize(9);
  doc.text('123 Fashion Street, Gulshan, Dhaka-1212, Bangladesh', 20, 50);
  doc.text('Phone: +880 1712-345678 | Email: info@geofashion.bd', 20, 56);
  doc.text('Website: www.geofashion.bd | Trade License: DH-123456', 20, 62);
  
  // Invoice information box
  const infoBoxX = pageWidth - 80;
  doc.setFillColor(...lightGrayColor);
  doc.rect(infoBoxX, 45, 75, 35, 'F');
  doc.setDrawColor(...grayColor);
  doc.rect(infoBoxX, 45, 75, 35, 'S');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details', infoBoxX + 5, 53);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Number: ${invoice.invoiceNumber}`, infoBoxX + 5, 60);
  doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, infoBoxX + 5, 66);
  doc.text(`Due: ${formatDate(invoice.dueDate)}`, infoBoxX + 5, 72);
  
  // Customer information with enhanced styling
  const customerY = 90;
  doc.setFillColor(...accentColor);
  doc.rect(20, customerY, pageWidth - 40, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', 25, customerY + 6);
  
  doc.setTextColor(...darkGrayColor);
  doc.setFillColor(...lightGrayColor);
  doc.rect(20, customerY + 8, pageWidth - 40, 25, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.customer.name, 25, customerY + 16);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.customer.address, 25, customerY + 22);
  doc.text(`Phone: ${invoice.customer.phone}`, 25, customerY + 28);
  doc.text(`Email: ${invoice.customer.email}`, 25, customerY + 34);
  
  // Items table with professional design
  let tableY = customerY + 45;
  
  // Table header with gradient
  doc.setFillColor(...primaryColor);
  doc.rect(20, tableY, pageWidth - 40, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', 25, tableY + 8);
  doc.text('DESCRIPTION', 70, tableY + 8);
  doc.text('QTY', 120, tableY + 8, { align: 'center' });
  doc.text('UNIT PRICE', 140, tableY + 8, { align: 'right' });
  doc.text('AMOUNT', pageWidth - 25, tableY + 8, { align: 'right' });
  
  tableY += 12;
  
  // Table rows with alternating colors
  doc.setTextColor(...darkGrayColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  invoice.items.forEach((item, index) => {
    const rowHeight = 14;
    
    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, tableY, pageWidth - 40, rowHeight, 'F');
    }
    
    // Add subtle border
    doc.setDrawColor(220, 220, 220);
    doc.line(20, tableY + rowHeight, pageWidth - 20, tableY + rowHeight);
    
    // Item data
    doc.text(item.product, 25, tableY + 9);
    
    // Wrap description if too long
    const maxDescWidth = 40;
    const wrappedDesc = doc.splitTextToSize(item.description, maxDescWidth);
    doc.text(wrappedDesc[0], 70, tableY + 9);
    
    doc.text(item.quantity.toString(), 120, tableY + 9, { align: 'center' });
    doc.text(formatCurrency(item.price), 140, tableY + 9, { align: 'right' });
    doc.text(formatCurrency(item.total), pageWidth - 25, tableY + 9, { align: 'right' });
    
    tableY += rowHeight;
  });
  
  // Summary section with professional styling
  const summaryY = tableY + 20;
  const summaryWidth = 80;
  const summaryX = pageWidth - summaryWidth - 20;
  
  // Summary box with border
  doc.setFillColor(...lightGrayColor);
  doc.rect(summaryX, summaryY, summaryWidth, 45, 'F');
  doc.setDrawColor(...grayColor);
  doc.rect(summaryX, summaryY, summaryWidth, 45, 'S');
  
  doc.setTextColor(...darkGrayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Subtotal
  doc.text('Subtotal:', summaryX + 5, summaryY + 10);
  doc.text(formatCurrency(invoice.subtotal), summaryX + summaryWidth - 5, summaryY + 10, { align: 'right' });
  
  // Delivery charge
  doc.text('Delivery Charge:', summaryX + 5, summaryY + 18);
  doc.text(formatCurrency(invoice.deliveryCharge), summaryX + summaryWidth - 5, summaryY + 18, { align: 'right' });
  
  // Separator line
  doc.setLineWidth(0.5);
  doc.setDrawColor(...primaryColor);
  doc.line(summaryX + 5, summaryY + 25, summaryX + summaryWidth - 5, summaryY + 25);
  
  // Total with emphasis
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('TOTAL:', summaryX + 5, summaryY + 35);
  doc.text(formatCurrency(invoice.grandTotal), summaryX + summaryWidth - 5, summaryY + 35, { align: 'right' });
  
  // Payment information section
  const paymentY = summaryY + 55;
  doc.setTextColor(...darkGrayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Information:', 20, paymentY);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Status: ${invoice.status}`, 20, paymentY + 8);
  doc.text(`Method: ${invoice.paymentMethod}`, 20, paymentY + 16);
  
  // Notes section if available
  if (invoice.notes && invoice.notes.trim()) {
    const notesY = paymentY + 25;
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Notes:', 20, notesY);
    
    doc.setFont('helvetica', 'normal');
    const maxNotesWidth = pageWidth - 40;
    const splitNotes = doc.splitTextToSize(invoice.notes, maxNotesWidth);
    doc.text(splitNotes, 20, notesY + 8);
  }
  
  // Professional footer
  const footerY = pageHeight - 30;
  doc.setDrawColor(...grayColor);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
  
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for choosing Geo Fashion!', pageWidth / 2, footerY, { align: 'center' });
  doc.text('For inquiries, please contact us at the above details.', pageWidth / 2, footerY + 6, { align: 'center' });
  
  // Generate and download
  const filename = `GeoFashion-Invoice-${invoice.invoiceNumber}.pdf`;
  doc.save(filename);
};
