
import jsPDF from 'jspdf';
import { Invoice, formatDate } from './invoiceUtils';

// Custom currency formatter for Bengali Taka
const formatCurrency = (amount: number): string => {
  const formattedAmount = amount.toFixed(2);
  return `৳ ${formattedAmount}`;
};

export const generateProfessionalInvoicePDF = (invoice: Invoice): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Set font to support Unicode characters
  doc.setFont('helvetica');
  
  // Colors
  const primaryColor = [37, 99, 235]; // Blue
  const grayColor = [107, 114, 128];
  const darkGrayColor = [55, 65, 81];
  const lightGrayColor = [248, 250, 252];
  
  // Header with company branding
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Geo Fashion', 15, 20);
  
  // Invoice title
  doc.setFontSize(16);
  doc.text('INVOICE', pageWidth - 15, 20, { align: 'right' });
  
  // Reset text color for body content
  doc.setTextColor(...darkGrayColor);
  
  // Company contact information
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Fashion Street, Dhaka, Bangladesh', 15, 45);
  doc.text('Phone: +880 1234 567890', 15, 51);
  doc.text('Email: info@geofashion.com', 15, 57);
  
  // Invoice details (right aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Invoice Number:', pageWidth - 75, 45);
  doc.text('Invoice Date:', pageWidth - 75, 51);
  doc.text('Due Date:', pageWidth - 75, 57);
  
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoiceNumber, pageWidth - 15, 45, { align: 'right' });
  doc.text(formatDate(invoice.invoiceDate), pageWidth - 15, 51, { align: 'right' });
  doc.text(formatDate(invoice.dueDate), pageWidth - 15, 57, { align: 'right' });
  
  // Customer information section
  doc.setFillColor(...lightGrayColor);
  doc.rect(15, 70, pageWidth - 30, 35, 'F');
  
  doc.setTextColor(...darkGrayColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 82);
  
  doc.setFontSize(11);
  doc.text(invoice.customer.name, 20, 90);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(invoice.customer.address, 20, 96);
  doc.text(`${invoice.customer.phone} | ${invoice.customer.email}`, 20, 102);
  
  // Items table
  let currentY = 120;
  
  // Table header
  doc.setFillColor(...primaryColor);
  doc.rect(15, currentY, pageWidth - 30, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, currentY + 7);
  doc.text('Description', 65, currentY + 7);
  doc.text('Qty', 115, currentY + 7, { align: 'center' });
  doc.text('Price', 135, currentY + 7, { align: 'right' });
  doc.text('Total', pageWidth - 20, currentY + 7, { align: 'right' });
  
  currentY += 10;
  
  // Table rows
  doc.setTextColor(...darkGrayColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  invoice.items.forEach((item, index) => {
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 20;
    }
    
    const rowHeight = 12;
    
    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, currentY, pageWidth - 30, rowHeight, 'F');
    }
    
    // Item details
    doc.text(item.product, 20, currentY + 8);
    doc.text(item.description, 65, currentY + 8);
    doc.text(item.quantity.toString(), 115, currentY + 8, { align: 'center' });
    doc.text(formatCurrency(item.price), 135, currentY + 8, { align: 'right' });
    doc.text(formatCurrency(item.total), pageWidth - 20, currentY + 8, { align: 'right' });
    
    currentY += rowHeight;
  });
  
  // Summary section
  currentY += 15;
  const summaryWidth = 70;
  const summaryX = pageWidth - summaryWidth - 15;
  
  // Summary background
  doc.setFillColor(...lightGrayColor);
  doc.rect(summaryX, currentY, summaryWidth, 40, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  // Subtotal
  doc.text('Subtotal:', summaryX + 5, currentY + 10);
  doc.text(formatCurrency(invoice.subtotal), summaryX + summaryWidth - 5, currentY + 10, { align: 'right' });
  
  // Delivery charge
  doc.text('Delivery Charge:', summaryX + 5, currentY + 18);
  doc.text(formatCurrency(invoice.deliveryCharge), summaryX + summaryWidth - 5, currentY + 18, { align: 'right' });
  
  // Separator line
  doc.setLineWidth(0.3);
  doc.setDrawColor(...grayColor);
  doc.line(summaryX + 5, currentY + 24, summaryX + summaryWidth - 5, currentY + 24);
  
  // Grand total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total:', summaryX + 5, currentY + 32);
  doc.text(formatCurrency(invoice.grandTotal), summaryX + summaryWidth - 5, currentY + 32, { align: 'right' });
  
  // Payment information
  currentY += 50;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', 20, currentY);
  doc.text('Payment Method:', 20, currentY + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.status, 65, currentY);
  doc.text(invoice.paymentMethod, 65, currentY + 6);
  
  // Notes section
  if (invoice.notes && invoice.notes.trim()) {
    currentY += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, currentY);
    
    doc.setFont('helvetica', 'normal');
    const maxWidth = pageWidth - 40;
    const splitNotes = doc.splitTextToSize(invoice.notes, maxWidth);
    doc.text(splitNotes, 20, currentY + 6);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text('For any questions about this invoice, please contact us.', pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  // Generate filename and save
  const filename = `Invoice-${invoice.invoiceNumber}.pdf`;
  doc.save(filename);
};
