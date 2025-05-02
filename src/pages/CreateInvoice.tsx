
import { useState } from "react";
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
  FileText, 
  Printer, 
  Download, 
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

// Mock data for the form
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

const CreateInvoice = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [nextId, setNextId] = useState(1);
  
  // Current date formatted
  const currentDate = format(new Date(), "yyyy-MM-dd");
  
  // Generate invoice number
  const invoiceNumber = `GF-INV-${format(new Date(), "yyyy")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

  // Add a new blank item
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

  // Remove an item
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Update an item
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // If quantity or price changes, recalculate total
        if (field === 'quantity' || field === 'price') {
          updatedItem.total = updatedItem.quantity * updatedItem.price;
        }
        
        // If product changes, update price and recalculate total
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

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  
  // Delivery charge
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  
  // Calculate grand total
  const grandTotal = subtotal + deliveryCharge;

  // Handle form submission
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

    // Here you would normally save the invoice
    toast.success("Invoice created successfully!");
    
    // In a real application, you would redirect to the invoice view page
    // or clear the form for a new invoice
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/invoices" className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Create Invoice</h1>
            <p className="text-gray-500 mt-1">Add a new invoice for a customer</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => toast.info("Invoice saved as draft")}>
            Save as Draft
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90" 
            onClick={handleSubmit}
          >
            <FileText className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Invoice Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input 
                    id="invoice-number" 
                    value={invoiceNumber} 
                    readOnly 
                    className="bg-muted" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <Input 
                    id="invoice-date" 
                    type="date" 
                    defaultValue={currentDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input 
                    id="due-date" 
                    type="date" 
                    defaultValue={currentDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select>
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="due">Due</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
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
                          <div className="flex justify-between text-sm mt-2">
                            <span>{customer.phone}</span>
                            <span>{customer.email}</span>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
                
                <Button type="button" variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add New Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button type="button" onClick={addItem} className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[120px]">Price (৳)</TableHead>
                    <TableHead className="w-[120px]">Total (৳)</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
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
                        <TableCell>
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add any additional notes or terms..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">৳ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Delivery Charge:</span>
                  <div className="flex items-center gap-2">
                    <span>৳</span>
                    <Input
                      className="w-24"
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
                  <span>৳ {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" asChild>
            <Link to="/invoices">Cancel</Link>
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button type="button" variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 gap-2">
              <FileText className="h-4 w-4" /> Create Invoice
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
