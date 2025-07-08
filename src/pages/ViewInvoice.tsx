
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
    
    toast.info("Opening print dialog...");
    
    // Use the browser's print functionality
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownload = async () => {
    if (!invoice) return;
    
    toast.info("Preparing invoice for download...");
    
    try {
      await downloadInvoiceAsPDF(invoice);
      toast.success("Invoice download started! Check your downloads folder.");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Error downloading invoice. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Invoice not found</p>
          <Button asChild>
            <Link to="/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in print:m-0 print:p-0 min-h-screen px-2 sm:px-4 lg:px-6">
      {/* Header - Hidden on print */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6 print:hidden">
        <div className="flex items-center">
          <Link to="/invoices" className="mr-2 sm:mr-4">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">View Invoice</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">{invoice.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto text-sm"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto text-sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button 
            className="gap-2 w-full sm:w-auto text-sm"
            onClick={() => navigate(`/invoices/edit/${id}`)}
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="space-y-4 sm:space-y-6 print:space-y-4 bg-white print:bg-white rounded-lg border print:border-0 p-4 sm:p-6 print:p-4">
        {/* Invoice Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-6">
          <div className="w-full lg:w-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Geo Fashion</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">123 Fashion Street, Dhaka, Bangladesh</p>
            <p className="text-xs sm:text-sm text-gray-500">+880 1234 567890</p>
            <p className="text-xs sm:text-sm text-gray-500">info@geofashion.com</p>
          </div>
          <div className="text-left lg:text-right w-full lg:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">INVOICE</h1>
            <p className="font-medium text-base sm:text-lg">{invoice.invoiceNumber}</p>
            <p className="text-xs sm:text-sm text-gray-500">Date: {formatDate(invoice.invoiceDate)}</p>
            <p className="text-xs sm:text-sm text-gray-500">Due Date: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Customer Information */}
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Bill To:</h3>
          <p className="font-medium text-sm sm:text-base">{invoice.customer.name}</p>
          <p className="text-xs sm:text-sm text-gray-600">{invoice.customer.address}</p>
          <div className="mt-2 flex flex-col sm:flex-row gap-1 sm:gap-4">
            <p className="text-xs sm:text-sm">{invoice.customer.phone}</p>
            <p className="text-xs sm:text-sm">{invoice.customer.email}</p>
          </div>
        </div>

        {/* Invoice Items */}
        <Card className="mt-4 sm:mt-6">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 sm:p-3 lg:p-4 text-left font-medium text-xs sm:text-sm">Item</th>
                    <th className="p-2 sm:p-3 lg:p-4 text-left font-medium text-xs sm:text-sm">Description</th>
                    <th className="p-2 sm:p-3 lg:p-4 text-right font-medium text-xs sm:text-sm">Qty</th>
                    <th className="p-2 sm:p-3 lg:p-4 text-right font-medium text-xs sm:text-sm">Price</th>
                    <th className="p-2 sm:p-3 lg:p-4 text-right font-medium text-xs sm:text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 sm:p-3 lg:p-4 text-xs sm:text-sm">{item.product}</td>
                      <td className="p-2 sm:p-3 lg:p-4 text-xs sm:text-sm">{item.description}</td>
                      <td className="p-2 sm:p-3 lg:p-4 text-right text-xs sm:text-sm">{item.quantity}</td>
                      <td className="p-2 sm:p-3 lg:p-4 text-right text-xs sm:text-sm">{formatCurrency(item.price)}</td>
                      <td className="p-2 sm:p-3 lg:p-4 text-right text-xs sm:text-sm font-semibold">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-full max-w-md space-y-2 bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="flex justify-between py-1 sm:py-2 text-sm sm:text-base">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 sm:py-2 text-sm sm:text-base">
              <span className="text-gray-600">Delivery Charge:</span>
              <span className="font-medium">{formatCurrency(invoice.deliveryCharge)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-1 sm:py-2 text-base sm:text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(invoice.grandTotal)}</span>
            </div>
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 rounded bg-white border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-xs sm:text-sm font-medium">Payment Status:</span>
                <span 
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
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
              <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-xs sm:text-sm font-medium">Payment Method:</span>
                <span className="text-xs sm:text-sm">{getPaymentMethodDisplay(invoice.paymentMethod)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-6 sm:mt-8 bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-sm sm:text-md font-semibold mb-2">Notes:</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t text-center text-xs sm:text-sm text-gray-500">
          <p className="font-medium text-gray-700">Thank you for your business!</p>
          <p className="mt-1">If you have any questions about this invoice, please contact us.</p>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoice;
