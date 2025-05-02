
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Search, Plus, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the customer schema
const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  orders: z.coerce.number().int().min(0, "Orders must be a positive integer"),
  due: z.coerce.number().min(0, "Due amount must be a positive number"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

// Get customers from localStorage or use default
const getStoredCustomers = () => {
  const storedCustomers = localStorage.getItem("customers");
  if (storedCustomers) {
    return JSON.parse(storedCustomers);
  }
  
  // Default customers
  const defaultCustomers = [
    { id: "1", name: "Rahman Clothing", email: "info@rahmanclothing.com", address: "45 Fashion Avenue, Dhaka", phone: "+880 1712 345678", orders: 12, due: 0 },
    { id: "2", name: "Dhaka Fashion Store", email: "contact@dhakafashion.com", address: "78 Style Street, Dhaka", phone: "+880 1812 567890", orders: 8, due: 4500 },
    { id: "3", name: "Style Emporium", email: "hello@styleemporium.com", address: "12 Trend Lane, Chittagong", phone: "+880 1912 123456", orders: 5, due: 0 },
    { id: "4", name: "Modern Apparels", email: "info@modernapparels.com", address: "23 Design Road, Khulna", phone: "+880 1512 987654", orders: 3, due: 1200 },
    { id: "5", name: "Fashion World", email: "contact@fashionworld.com", address: "56 Garments Street, Dhaka", phone: "+880 1612 456789", orders: 7, due: 0 },
  ];
  
  // Store default customers in localStorage
  localStorage.setItem("customers", JSON.stringify(defaultCustomers));
  return defaultCustomers;
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState(getStoredCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerFormValues | null>(null);
  const [viewCustomer, setViewCustomer] = useState<CustomerFormValues | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Initialize form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      orders: 0,
      due: 0,
    }
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const handleDeleteCustomer = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteCustomer = () => {
    if (confirmDelete) {
      const updatedCustomers = customers.filter(customer => customer.id !== confirmDelete);
      setCustomers(updatedCustomers);
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      toast.success("Customer deleted successfully");
      setConfirmDelete(null);
    }
  };

  const handleEditCustomer = (id: string) => {
    const customerToEdit = customers.find(customer => customer.id === id);
    if (customerToEdit) {
      setEditingCustomer(customerToEdit);
      form.reset(customerToEdit);
      setIsDialogOpen(true);
    }
  };

  const handleViewCustomer = (id: string) => {
    const customerToView = customers.find(customer => customer.id === id);
    if (customerToView) {
      setViewCustomer(customerToView);
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    form.reset({
      name: "",
      email: "",
      address: "",
      phone: "",
      orders: 0,
      due: 0,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: CustomerFormValues) => {
    if (editingCustomer) {
      // Update existing customer
      const updatedCustomers = customers.map(customer => 
        customer.id === editingCustomer.id ? { ...data, id: editingCustomer.id } : customer
      );
      setCustomers(updatedCustomers);
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      toast.success("Customer updated successfully");
    } else {
      // Add new customer
      const newCustomer = {
        ...data,
        id: Date.now().toString(),
      };
      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
      localStorage.setItem("customers", JSON.stringify(updatedCustomers));
      toast.success("Customer added successfully");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={handleAddCustomer}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Outstanding Due</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div>{customer.phone}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>
                      {customer.due > 0 ? (
                        <span className="text-red-600">৳{customer.due.toFixed(2)}</span>
                      ) : (
                        <span className="text-green-600">No due</span>
                      )}
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
                          <DropdownMenuItem onClick={() => handleViewCustomer(customer.id)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer.id)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteCustomer(customer.id)}
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
        </CardContent>
      </Card>

      {/* Customer Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            <DialogDescription>
              Fill in the customer details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+880..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orders"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orders</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCustomer ? "Update Customer" : "Add Customer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Name:</div>
                <div>{viewCustomer.name}</div>
                <div className="font-medium">Email:</div>
                <div>{viewCustomer.email}</div>
                <div className="font-medium">Phone:</div>
                <div>{viewCustomer.phone}</div>
                <div className="font-medium">Address:</div>
                <div>{viewCustomer.address}</div>
                <div className="font-medium">Total Orders:</div>
                <div>{viewCustomer.orders}</div>
                <div className="font-medium">Outstanding Due:</div>
                <div>
                  {viewCustomer.due > 0 ? (
                    <span className="text-red-600">৳{viewCustomer.due.toFixed(2)}</span>
                  ) : (
                    <span className="text-green-600">No due</span>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setViewCustomer(null)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
