import { format } from "date-fns";

export interface InvoiceItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customer: Customer;
  items: InvoiceItem[];
  paymentMethod: string;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  notes: string;
  status: string;
}

export const formatCurrency = (amount: number): string => {
  // Ensure proper number formatting for Bengali currency
  const formattedAmount = amount.toFixed(2);
  return `৳${formattedAmount}`;
};

export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

export const generateInvoiceHTML = (invoice: Invoice): string => {
  const itemsHTML = invoice.items.map(item => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${item.product}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${item.description}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px;">${item.quantity}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px;">${formatCurrency(item.price)}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: 600;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 20px; 
          line-height: 1.6;
          color: #333;
          background: #ffffff;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .invoice-content {
          padding: 30px;
        }
        
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          margin-bottom: 40px; 
          flex-wrap: wrap;
        }
        
        .company-info h2 { 
          margin: 0; 
          font-size: 28px; 
          color: #2563eb;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .company-info p {
          margin: 4px 0;
          color: #666;
          font-size: 14px;
        }
        
        .invoice-info { 
          text-align: right;
          min-width: 200px;
        }
        
        .invoice-info h1 { 
          margin: 0; 
          color: #2563eb; 
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
        }
        
        .invoice-info p {
          margin: 4px 0;
          font-size: 14px;
        }
        
        .invoice-info p:first-of-type {
          font-weight: 600;
          font-size: 16px;
        }
        
        .bill-to {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 6px;
        }
        
        .bill-to h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #374151;
        }
        
        .bill-to p {
          margin: 4px 0;
          font-size: 14px;
        }
        
        .bill-to p:first-of-type {
          font-weight: 600;
          font-size: 16px;
          color: #111827;
        }
        
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }
        
        th { 
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          padding: 16px 12px; 
          text-align: left; 
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        th:last-child,
        .text-right { text-align: right; }
        
        tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        
        tbody tr:hover {
          background: #f3f4f6;
        }
        
        td { 
          padding: 12px; 
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        
        .summary { 
          float: right; 
          width: 100%; 
          max-width: 350px; 
          margin-top: 30px;
          background: #f8fafc;
          padding: 20px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        
        .summary table {
          margin: 0;
          border: none;
        }
        
        .summary th {
          background: none;
          color: #374151;
          padding: 8px 0;
          font-weight: 500;
          text-transform: none;
          letter-spacing: normal;
        }
        
        .summary td {
          padding: 8px 0;
          border: none;
          font-size: 15px;
        }
        
        .total-row { 
          font-weight: 700; 
          font-size: 18px;
          border-top: 2px solid #2563eb;
          color: #1f2937;
        }
        
        .total-row td {
          padding-top: 12px;
        }
        
        .payment-info {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #d1d5db;
        }
        
        .payment-info p {
          margin: 6px 0;
          font-size: 14px;
        }
        
        .status { 
          display: inline-block; 
          padding: 6px 12px; 
          border-radius: 20px; 
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-paid { 
          background: #dcfce7; 
          color: #166534; 
          border: 1px solid #bbf7d0;
        }
        
        .status-pending { 
          background: #fef3c7; 
          color: #92400e; 
          border: 1px solid #fde68a;
        }
        
        .status-due { 
          background: #fee2e2; 
          color: #991b1b; 
          border: 1px solid #fecaca;
        }
        
        .notes-section {
          margin-top: 40px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 6px;
        }
        
        .notes-section h3 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #374151;
        }
        
        .notes-section p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }
        
        .footer {
          margin-top: 50px; 
          padding-top: 20px; 
          border-top: 2px solid #e5e7eb; 
          text-align: center; 
          color: #6b7280;
        }
        
        .footer p {
          margin: 8px 0;
          font-size: 14px;
        }
        
        .footer p:first-child {
          font-weight: 600;
          color: #374151;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          body { padding: 10px; }
          .invoice-content { padding: 20px; }
          
          .header { 
            flex-direction: column;
            gap: 20px;
          }
          
          .invoice-info { 
            text-align: left;
          }
          
          .invoice-info h1 { 
            font-size: 24px;
          }
          
          .company-info h2 { 
            font-size: 22px;
          }
          
          .summary { 
            float: none; 
            width: 100%; 
            max-width: none;
          }
          
          table, th, td {
            font-size: 12px;
          }
          
          th, td {
            padding: 8px 6px;
          }
        }
        
        @media (max-width: 480px) {
          .invoice-content { padding: 15px; }
          
          .company-info h2 { 
            font-size: 20px;
          }
          
          .invoice-info h1 { 
            font-size: 20px;
          }
          
          table, th, td {
            font-size: 11px;
          }
          
          th, td {
            padding: 6px 4px;
          }
        }
        
        /* Print Styles */
        @media print {
          body { margin: 0; padding: 0; }
          .invoice-container { border: none; }
          .invoice-content { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-content">
          <div class="header">
            <div class="company-info">
              <h2>Geo Fashion</h2>
              <p>123 Fashion Street, Dhaka, Bangladesh</p>
              <p>+880 1234 567890</p>
              <p>info@geofashion.com</p>
            </div>
            <div class="invoice-info">
              <h1>INVOICE</h1>
              <p>${invoice.invoiceNumber}</p>
              <p>Date: ${formatDate(invoice.invoiceDate)}</p>
              <p>Due Date: ${formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          <div class="bill-to">
            <h3>Bill To:</h3>
            <p>${invoice.customer.name}</p>
            <p>${invoice.customer.address}</p>
            <p>${invoice.customer.phone}</p>
            <p>${invoice.customer.email}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="summary">
            <table>
              <tr>
                <td>Subtotal:</td>
                <td class="text-right">${formatCurrency(invoice.subtotal)}</td>
              </tr>
              <tr>
                <td>Delivery Charge:</td>
                <td class="text-right">${formatCurrency(invoice.deliveryCharge)}</td>
              </tr>
              <tr class="total-row">
                <td>Total:</td>
                <td class="text-right">${formatCurrency(invoice.grandTotal)}</td>
              </tr>
            </table>
            <div class="payment-info">
              <p><strong>Payment Status:</strong> 
                <span class="status status-${invoice.status.toLowerCase()}">${invoice.status}</span>
              </p>
              <p><strong>Payment Method:</strong> ${getPaymentMethodDisplay(invoice.paymentMethod)}</p>
            </div>
          </div>

          ${invoice.notes ? `
            <div class="notes-section">
              <h3>Notes:</h3>
              <p>${invoice.notes}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>If you have any questions about this invoice, please contact us.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const downloadInvoiceAsPDF = async (invoice: Invoice): Promise<void> => {
  try {
    // Import and use the professional PDF generator
    const { generateProfessionalInvoicePDF } = await import('./pdfGenerator');
    generateProfessionalInvoicePDF(invoice);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const validatePaymentMethod = (method: string): boolean => {
  const validMethods = ['cash', 'bkash', 'nagad', 'bank', 'due'];
  return validMethods.includes(method.toLowerCase());
};

export const getPaymentMethodDisplay = (method: string): string => {
  const displayMap: { [key: string]: string } = {
    'cash': 'Cash Payment',
    'bkash': 'bKash Mobile Banking',
    'nagad': 'Nagad Mobile Banking', 
    'bank': 'Bank Transfer',
    'due': 'Due Payment'
  };
  return displayMap[method.toLowerCase()] || method;
};

export const getPaymentMethods = () => [
  { value: 'cash', label: 'Cash Payment' },
  { value: 'bkash', label: 'bKash Mobile Banking' },
  { value: 'nagad', label: 'Nagad Mobile Banking' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'due', label: 'Due Payment' }
];
