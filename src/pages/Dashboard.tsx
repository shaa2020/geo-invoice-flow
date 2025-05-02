
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Invoices",
      value: "12",
      description: "This month",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Customers",
      value: "24",
      description: "Total customers",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Products",
      value: "53",
      description: "Total products",
      icon: ShoppingBag,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Revenue",
      value: "৳45,231",
      description: "This month",
      icon: CreditCard,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // Mock data for recent invoices
  const recentInvoices = [
    {
      id: "GF-INV-2025-001",
      customer: "Rahman Clothing",
      amount: "৳12,500",
      status: "Paid",
      date: "May 1, 2025",
    },
    {
      id: "GF-INV-2025-002",
      customer: "Dhaka Fashion Store",
      amount: "৳8,750",
      status: "Pending",
      date: "May 1, 2025",
    },
    {
      id: "GF-INV-2025-003",
      customer: "Style Emporium",
      amount: "৳3,200",
      status: "Paid",
      date: "Apr 30, 2025",
    },
    {
      id: "GF-INV-2025-004",
      customer: "Modern Apparels",
      amount: "৳9,400",
      status: "Due",
      date: "Apr 28, 2025",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to Geo Fashion Invoice Generator</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/invoices/new">Create New Invoice</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Showing the last 4 invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium text-sm">{invoice.customer}</p>
                    <p className="text-xs text-muted-foreground">{invoice.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
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
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link to="/invoices">View All Invoices</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>Your business information for invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-lg font-bold">
                GF
              </div>
              <div>
                <h3 className="font-bold">Geo Fashion</h3>
                <p className="text-sm text-muted-foreground">Fashion & Clothing Brand</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Address:</span>
                <span>123 Fashion Street, Dhaka, Bangladesh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Phone:</span>
                <span>+880 1234 567890</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email:</span>
                <span>info@geofashion.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Invoice Prefix:</span>
                <span>GF-INV-2025-</span>
              </div>
            </div>
            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link to="/settings">Update Business Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
