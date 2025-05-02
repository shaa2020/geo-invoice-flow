
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Pencil, 
  Trash 
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// TypeScript interface for invoice data
interface Invoice {
  invoiceNumber: string;
  customer: {
    name: string;
    id: string;
  };
  date: string;
  amount: string | number;
  status: string;
}

const Invoices = () => {
  // Mock data for invoices
  const defaultInvoices = [
    {
      id: "GF-INV-2025-001",
      customer: { name: "Rahman Clothing", id: "1" },
      amount: "৳12,500",
      status: "Paid",
      date: "May 1, 2025",
    },
    {
      id: "GF-INV-2025-002",
      customer: { name: "Dhaka Fashion Store", id: "2" },
      amount: "৳8,750",
      status: "Pending",
      date: "May 1, 2025",
    },
    {
      id: "GF-INV-2025-003",
      customer: { name: "Style Emporium", id: "3" },
      amount: "৳3,200",
      status: "Paid",
      date: "Apr 30, 2025",
    },
    {
      id: "GF-INV-2025-004",
      customer: { name: "Modern Apparels", id: "4" },
      amount: "৳9,400",
      status: "Due",
      date: "Apr 28, 2025",
    },
  ];

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);

  // Load invoices on component mount
  useEffect(() => {
    // Get stored invoices from localStorage
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    // Format stored invoices to match the expected format
    const formattedStoredInvoices = storedInvoices.map((invoice: any) => ({
      id: invoice.invoiceNumber,
      customer: invoice.customer,
      amount: `৳${invoice.grandTotal.toFixed(2)}`,
      status: invoice.status,
      date: format(new Date(invoice.invoiceDate), 'MMM d, yyyy'),
    }));
    
    // Combine default invoices with stored ones
    setInvoices([...formattedStoredInvoices, ...defaultInvoices]);
  }, []);

  // Function to format date (simple version since we don't have the full date-fns)
  const format = (date: Date, formatString: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view invoice
  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/view/${invoiceId}`);
  };

  // Handle edit invoice
  const handleEditInvoice = (invoiceId: string) => {
    navigate(`/invoices/edit/${invoiceId}`);
  };

  // Handle download invoice
  const handleDownloadInvoice = (invoiceId: string) => {
    toast.info("Preparing PDF for download...");
    // In a real app, we would generate a PDF here
    setTimeout(() => {
      toast.success("Invoice PDF downloaded successfully");
    }, 1000);
  };

  // Handle delete invoice
  const handleDeleteInvoice = (invoiceId: string) => {
    // Remove from UI
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    
    // Remove from localStorage
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const updatedInvoices = storedInvoices.filter((invoice: any) => invoice.invoiceNumber !== invoiceId);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast.success("Invoice deleted successfully");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage all your invoice records</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/invoices/new">
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => toast.info("Filtering will be available soon")}
        >
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No invoices found. Create your first invoice!
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer.name}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewInvoice(invoice.id)}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.id)}>
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditInvoice(invoice.id)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Invoices;
