
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
import { Search, Plus, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { toast } from "sonner";

// Mock data for customers
const defaultCustomers = [
  { id: "1", name: "Rahman Clothing", email: "info@rahmanclothing.com", address: "45 Fashion Avenue, Dhaka", phone: "+880 1712 345678", orders: 12, due: 0 },
  { id: "2", name: "Dhaka Fashion Store", email: "contact@dhakafashion.com", address: "78 Style Street, Dhaka", phone: "+880 1812 567890", orders: 8, due: 4500 },
  { id: "3", name: "Style Emporium", email: "hello@styleemporium.com", address: "12 Trend Lane, Chittagong", phone: "+880 1912 123456", orders: 5, due: 0 },
  { id: "4", name: "Modern Apparels", email: "info@modernapparels.com", address: "23 Design Road, Khulna", phone: "+880 1512 987654", orders: 3, due: 1200 },
  { id: "5", name: "Fashion World", email: "contact@fashionworld.com", address: "56 Garments Street, Dhaka", phone: "+880 1612 456789", orders: 7, due: 0 },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers] = useState(defaultCustomers);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const handleDeleteCustomer = (id: string) => {
    toast.info("Customer deletion functionality will be implemented in a future update");
  };

  const handleEditCustomer = (id: string) => {
    toast.info("Customer editing functionality will be implemented in a future update");
  };

  const handleViewCustomer = (id: string) => {
    toast.info("Customer details view will be implemented in a future update");
  };

  const handleAddCustomer = () => {
    toast.info("Add customer functionality will be implemented in a future update");
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
    </div>
  );
};

export default Customers;
