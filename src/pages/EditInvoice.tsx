import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  Trash,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { getPaymentMethods, validatePaymentMethod } from "@/utils/invoiceUtils";

const customers = [
  { id: "1", name: "Rahman Clothing", email: "info@rahmanclothing.com", address: "45 Fashion Avenue, Dhaka", phone: "+880 1712 345678" },
  { id: "2", name: "Dhaka Fashion Store", email: "contact@dhakafashion.com", address: "78 Style Street, Dhaka", phone: "+880 1812 567890" },
  { id: "3", name: "Style Emporium", email: "hello@styleemporium.com", address: "12 Trend Lane, Chittagong", phone: "+880 1912 123456" },
];

const products = [
  { id: "1", name: "Premium Cotton T-shirt", price: 450, sku: "GF-TS-001" },
  { id: "2", name: "Slim Fit Jeans", price: 1200, sku: "GF-JN-001" },
  { id: "3", name: "Oxford Shirt", price: 850, sku: "GF-SH-001" },
  { id: "4", name: "Casual Polo", price: 650, sku: "GF-PL-001" },
  { id: "5", name: "Fashionable Hoodie", price: 1500, sku: "GF-HD-001" },
];

interface InvoiceItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface Invoice {
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

const EditInvoice = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [nextId, setNextId] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [originalInvoice, setOriginalInvoice] = useState<Invoice | null>(null);
  
  useEffect(() => {
    if (!id) {
      toast.error("Invalid invoice ID");
      navigate("/invoices");
      return;
    }

    const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    
    const foundInvoice = storedInvoices.find(
      (inv: Invoice) => inv.invoiceNumber === id
    );

    if (foundInvoice) {
      setOriginalInvoice(foundInvoice);
      
      setSelectedCustomer(foundInvoice.customer.id);
      setItems(foundInvoice.items);
      setPaymentMethod(foundInvoice.paymentMethod);
      setNotes(foundInvoice.notes || "");
      setDueDate(foundInvoice.dueDate);
      setInvoiceDate(foundInvoice.invoiceDate);
      setDeliveryCharge(foundInvoice.deliveryCharge);
      
      const maxId = Math.max(...foundInvoice.items.map(item => {
        const idNum = parseInt(item.id.replace('item-', ''), 10);
        return isNaN(idNum) ? 0 : idNum;
      }), 0);
      setNextId(maxId + 1);
    } else {
      toast.error("Invoice not found");
      navigate("/invoices");
    }
    
    setLoading(false);
  }, [id, navigate]);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  
  const grandTotal = subtotal + deliveryCharge;

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${nextId}`,
      product: "",
      description: "",
      quantity: 1,
      price: 0,
      total: 0,
    };
    setItems([...items, newItem]);
    setNextId(nextId + 1);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        
        if (field === 'product') {
          const selectedProduct = products.find(p => p.id === value);
          if (selectedProduct) {
            updatedItem.price = selectedProduct.price;
            updatedItem.description = selectedProduct.name;
            updatedItem.total = updatedItem.quantity * updatedItem.price;
          }
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.warning("Please add at least one item to the invoice");
      return;
    }

    if (!selectedCustomer) {
      toast.warning("Please select a customer");
      return;
    }

    if (!paymentMethod) {
      toast.warning("Please select a payment method");
      return;
    }

    if (!validatePaymentMethod(paymentMethod)) {
      toast.error("Invalid payment method selected");
      return;
    }

    const updatedInvoice = {
      invoiceNumber: id,
      invoiceDate,
      dueDate,
      paymentMethod,
      customer: customers.find(c => c.id === selectedCustomer),
      items,
      subtotal,
      deliveryCharge,
      grandTotal,
      notes,
      status: paymentMethod === "due" ? "Due" : "Paid"
    };
    
    const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const updatedInvoices = existingInvoices.map((invoice: any) => 
      invoice.invoiceNumber === id ? updatedInvoice : invoice
    );
    
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast.success("Invoice updated successfully!");
    
    setTimeout(() => {
      navigate(`/invoices/view/${id}`);
    }, 1500);
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

  const paymentMethods = getPaymentMethods();

  return (
    <div className="animate-fade-in print:m-0 print:p-0 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 print:hidden">
        <div className="flex items-center">
          <Link to={`/invoices/view/${id}`} className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit Invoice</h1>
            <p className="text-gray-500 mt-1">{id}</p>
          </div>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button 
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto" 
            onClick={handleSubmit}
          >
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 print:space-y-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 print:gap-4 mb-8 print:mb-2">
          <Card className="print:shadow-none print:border-0">
            <CardContent className="p-4 sm:p-6 print:p-2">
              <h3 className="text-lg font-semibold mb-4 print:mb-2">Invoice Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
                <div className="space-y-2 print:space-y-1">
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input 
                    id="invoice-number" 
                    value={id} 
                    readOnly 
                    className="bg-muted" 
                  />
                </div>
                <div className="space-y-2 print:space-y-1">
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <Input 
                    id="invoice-date" 
                    type="date" 
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2 print:space-y-1">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input 
                    id="due-date" 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2 print:space-y-1">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="print:shadow-none print:border-0">
            <CardContent className="p-4 sm:p-6 print:p-2">
              <h3 className="text-lg font-semibold mb-4 print:mb-2">Customer Information</h3>
              <div className="space-y-4 print:space-y-2">
                <div className="space-y-2 print:space-y-1">
                  <Label htmlFor="customer">Select Customer</Label>
                  <Select 
                    value={selectedCustomer} 
                    onValueChange={setSelectedCustomer}
                  >
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCustomer && (
                  <div className="border rounded-md p-3 bg-muted/50">
                    {(() => {
                      const customer = customers.find(c => c.id === selectedCustomer);
                      return customer ? (
                        <>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm">{customer.address}</p>
                          <div className="flex flex-col sm:flex-row justify-between text-sm mt-2 gap-1">
                            <span>{customer.phone}</span>
                            <span>{customer.email}</span>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 print:shadow-none print:border-0">
          <CardContent className="p-4 sm:p-6 print:p-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 print:mb-2 gap-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button 
                type="button" 
                onClick={addItem} 
                className="bg-primary hover:bg-primary/90 print:hidden w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden print:border-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px] sm:w-[180px]">Product</TableHead>
                      <TableHead className="min-w-[150px]">Description</TableHead>
                      <TableHead className="min-w-[80px] sm:w-[100px]">Quantity</TableHead>
                      <TableHead className="min-w-[100px] sm:w-[120px]">Price (৳)</TableHead>
                      <TableHead className="min-w-[100px] sm:w-[120px]">Total (৳)</TableHead>
                      <TableHead className="w-[60px] print:hidden"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No items added. Click "Add Item" above to start.
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select 
                              value={item.product}
                              onValueChange={(value) => updateItem(item.id, 'product', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={item.description} 
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="Description"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              min="1"
                              value={item.quantity} 
                              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              min="0"
                              value={item.price} 
                              onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.total.toFixed(2)}
                          </TableCell>
                          <TableCell className="print:hidden">
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 print:gap-4 print:mb-2">
          <Card className="print:shadow-none print:border-0">
            <CardContent className="p-4 sm:p-6 print:p-2">
              <h3 className="text-lg font-semibold mb-4 print:mb-2">Additional Information</h3>
              <div className="space-y-4 print:space-y-2">
                <div className="space-y-2 print:space-y-1">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add any additional notes or terms..."
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="print:shadow-none print:border-0">
            <CardContent className="p-4 sm:p-6 print:p-2">
              <h3 className="text-lg font-semibold mb-4 print:mb-2">Summary</h3>
              <div className="space-y-2 print:space-y-1">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">৳ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Delivery Charge:</span>
                  <div className="flex items-center gap-2">
                    <span>৳</span>
                    <Input
                      className="w-20 sm:w-24"
                      type="number"
                      min="0"
                      value={deliveryCharge}
                      onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">৳ {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link to={`/invoices/view/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditInvoice;
