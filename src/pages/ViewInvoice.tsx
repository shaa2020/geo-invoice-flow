
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Pencil, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Invoice, 
  formatDate, 
  formatCurrency, 
  downloadInvoiceAsPDF,
  getPaymentMethodDisplay 
} from "@/utils/invoiceUtils";

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get stored invoices from localStorage
    const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    
    // Find the specific invoice
    const foundInvoice = storedInvoices.find(
      (inv: Invoice) => inv.invoiceNumber === id
    );

    if (foundInvoice) {
      setInvoice(foundInvoice);
    } else {
      toast.error("Invoice not found");
      navigate("/invoices");
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handlePrint = () => {
    if (!invoice) return;
    
    toast.info("Preparing to print invoice...");
    
    // Use the browser's print functionality
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownload = () => {
    if (!invoice) return;
    
    toast.info("Preparing PDF for download...");
    
    try {
      downloadInvoiceAsPDF(invoice);
      toast.success("Invoice opened in new window for printing/saving as PDF");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="flex justify-center items-center h-96">Invoice not found</div>;
  }

  return (
    <div className="animate-fade-in print:m-0 print:p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div className="flex items-center">
          <Link to="/invoices" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">View Invoice</h1>
            <p className="text-gray-500 mt-1">{invoice.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button 
            className="gap-2"
            onClick={() => navigate(`/invoices/edit/${id}`)}
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      <div className="space-y-6 print:space-y-4">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Geo Fashion</h2>
            <p className="text-sm text-gray-500">123 Fashion Street, Dhaka, Bangladesh</p>
            <p className="text-sm text-gray-500">+880 1234 567890</p>
            <p className="text-sm text-gray-500">info@geofashion.com</p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-primary">INVOICE</h1>
            <p className="font-medium">{invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-500">Date: {formatDate(invoice.invoiceDate)}</p>
            <p className="text-sm text-gray-500">Due Date: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
          <p className="font-medium">{invoice.customer.name}</p>
          <p className="text-sm">{invoice.customer.address}</p>
          <div className="mt-2">
            <p className="text-sm">{invoice.customer.phone}</p>
            <p className="text-sm">{invoice.customer.email}</p>
          </div>
        </div>

        {/* Invoice Items */}
        <Card className="mt-6">
          <CardContent className="p-0">
            <table className="w-full border-collapse">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium">Item</th>
                  <th className="p-4 text-left font-medium">Description</th>
                  <th className="p-4 text-right font-medium">Qty</th>
                  <th className="p-4 text-right font-medium">Price</th>
                  <th className="p-4 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4">{item.product}</td>
                    <td className="p-4">{item.description}</td>
                    <td className="p-4 text-right">{item.quantity}</td>
                    <td className="p-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="p-4 text-right">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Delivery Charge:</span>
              <span>{formatCurrency(invoice.deliveryCharge)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(invoice.grandTotal)}</span>
            </div>
            <div className="mt-2 p-2 rounded bg-muted/50">
              <span className="text-sm font-medium">Payment Status: </span>
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : invoice.status === "Pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium">Payment Method: </span>
              <span className="text-sm">{getPaymentMethodDisplay(invoice.paymentMethod)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8">
            <h3 className="text-md font-semibold mb-2">Notes:</h3>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">If you have any questions about this invoice, please contact us.</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
