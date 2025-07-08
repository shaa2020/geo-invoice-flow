
import jsPDF from 'jspdf';
import { Invoice, formatCurrency, formatDate } from './invoiceUtils';

export const generateProfessionalInvoicePDF = (invoice: Invoice): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Set default font to ensure proper character rendering
  doc.setFont('helvetica');
  
  // Colors and styling
  const primaryColor = '#2563eb';
  const grayColor = '#6b7280';
  const darkGrayColor = '#374151';
  
  // Header section
  doc.setFillColor(37, 99, 235); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company logo/name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Geo Fashion', 20, 25);
  
  // Invoice title
  doc.setFontSize(18);
  doc.text('INVOICE', pageWidth - 20, 25, { align: 'right' });
  
  // Company details
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Fashion Street, Dhaka, Bangladesh', 20, 50);
  doc.text('+880 1234 567890', 20, 57);
  doc.text('info@geofashion.com', 20, 64);
  
  // Invoice details (right side)
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', pageWidth - 80, 50);
  doc.text('Invoice Date:', pageWidth - 80, 57);
  doc.text('Due Date:', pageWidth - 80, 64);
  
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoiceNumber, pageWidth - 20, 50, { align: 'right' });
  doc.text(formatDate(invoice.invoiceDate), pageWidth - 20, 57, { align: 'right' });
  doc.text(formatDate(invoice.dueDate), pageWidth - 20, 64, { align: 'right' });
  
  // Customer section
  doc.setFillColor(248, 250, 252);
  doc.rect(20, 80, pageWidth - 40, 40, 'F');
  
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 25, 95);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.customer.name, 25, 105);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoice.customer.address, 25, 112);
  doc.text(invoice.customer.phone + ' | ' + invoice.customer.email, 25, 119);
  
  // Items table header
  let yPosition = 140;
  doc.setFillColor(37, 99, 235);
  doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 25, yPosition + 8);
  doc.text('Description', 70, yPosition + 8);
  doc.text('Qty', 120, yPosition + 8, { align: 'center' });
  doc.text('Price', 140, yPosition + 8, { align: 'right' });
  doc.text('Total', pageWidth - 25, yPosition + 8, { align: 'right' });
  
  // Items table body
  yPosition += 12;
  doc.setTextColor(55, 65, 81);
  doc.setFont('helvetica', 'normal');
  
  invoice.items.forEach((item, index) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }
    
    const rowHeight = 15;
    
    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPosition, pageWidth - 40, rowHeight, 'F');
    }
    
    doc.text(item.product, 25, yPosition + 10);
    doc.text(item.description, 70, yPosition + 10);
    doc.text(item.quantity.toString(), 120, yPosition + 10, { align: 'center' });
    doc.text(formatCurrency(item.price), 140, yPosition + 10, { align: 'right' });
    doc.text(formatCurrency(item.total), pageWidth - 25, yPosition + 10, { align: 'right' });
    
    yPosition += rowHeight;
  });
  
  // Summary section
  yPosition += 10;
  const summaryStartY = yPosition;
  
  // Summary background
  doc.setFillColor(248, 250, 252);
  doc.rect(pageWidth - 80, summaryStartY, 60, 50, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Subtotal
  doc.text('Subtotal:', pageWidth - 75, summaryStartY + 12);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - 25, summaryStartY + 12, { align: 'right' });
  
  // Delivery charge
  doc.text('Delivery Charge:', pageWidth - 75, summaryStartY + 22);
  doc.text(formatCurrency(invoice.deliveryCharge), pageWidth - 25, summaryStartY + 22, { align: 'right' });
  
  // Total line
  doc.setLineWidth(0.5);
  doc.setDrawColor(107, 114, 128);
  doc.line(pageWidth - 75, summaryStartY + 28, pageWidth - 25, summaryStartY + 28);
  
  // Grand total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', pageWidth - 75, summaryStartY + 38);
  doc.text(formatCurrency(invoice.grandTotal), pageWidth - 25, summaryStartY + 38, { align: 'right' });
  
  // Payment information
  yPosition = summaryStartY + 55;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', 25, yPosition);
  doc.text('Payment Method:', 25, yPosition + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.status, 70, yPosition);
  doc.text(invoice.paymentMethod, 70, yPosition + 8);
  
  // Notes section
  if (invoice.notes) {
    yPosition += 25;
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 25, yPosition);
    
    doc.setFont('helvetica', 'normal');
    const maxWidth = pageWidth - 50;
    const splitNotes = doc.splitTextToSize(invoice.notes, maxWidth);
    doc.text(splitNotes, 25, yPosition + 8);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text('If you have any questions about this invoice, please contact us.', pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  // Save the PDF with proper filename
  const filename = `Invoice-${invoice.invoiceNumber}.pdf`;
  doc.save(filename);
};
