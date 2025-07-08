
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
  return `৳${amount.toFixed(2)}`;
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
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.product}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info h2 { margin: 0; font-size: 24px; }
        .invoice-info h1 { margin: 0; color: #3b82f6; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #f3f4f6; padding: 12px; text-align: left; }
        td { padding: 8px; }
        .summary { float: right; width: 300px; margin-top: 20px; }
        .total { font-weight: bold; font-size: 18px; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-paid { background-color: #dcfce7; color: #166534; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-due { background-color: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h2>Geo Fashion</h2>
          <p>123 Fashion Street, Dhaka, Bangladesh</p>
          <p>+880 1234 567890</p>
          <p>info@geofashion.com</p>
        </div>
        <div class="invoice-info">
          <h1>INVOICE</h1>
          <p><strong>${invoice.invoiceNumber}</strong></p>
          <p>Date: ${formatDate(invoice.invoiceDate)}</p>
          <p>Due Date: ${formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h3>Bill To:</h3>
        <p><strong>${invoice.customer.name}</strong></p>
        <p>${invoice.customer.address}</p>
        <p>${invoice.customer.phone}</p>
        <p>${invoice.customer.email}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th style="text-align: right;">Qty</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="summary">
        <table style="width: 100%;">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">${formatCurrency(invoice.subtotal)}</td>
          </tr>
          <tr>
            <td>Delivery Charge:</td>
            <td style="text-align: right;">${formatCurrency(invoice.deliveryCharge)}</td>
          </tr>
          <tr class="total">
            <td>Total:</td>
            <td style="text-align: right;">${formatCurrency(invoice.grandTotal)}</td>
          </tr>
        </table>
        <div style="margin-top: 15px;">
          <p><strong>Payment Status:</strong> 
            <span class="status status-${invoice.status.toLowerCase()}">${invoice.status}</span>
          </p>
          <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>
        </div>
      </div>

      ${invoice.notes ? `
        <div style="margin-top: 40px;">
          <h3>Notes:</h3>
          <p>${invoice.notes}</p>
        </div>
      ` : ''}

      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
        <p>Thank you for your business!</p>
        <p>If you have any questions about this invoice, please contact us.</p>
      </div>
    </body>
    </html>
  `;
};

export const downloadInvoiceAsPDF = (invoice: Invoice): void => {
  const htmlContent = generateInvoiceHTML(invoice);
  
  // Create a new window with the invoice content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.print();
    };
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
