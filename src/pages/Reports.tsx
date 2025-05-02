
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data for reports
const salesData = [
  { name: "Apr 25", amount: 12500 },
  { name: "Apr 26", amount: 8900 },
  { name: "Apr 27", amount: 15400 },
  { name: "Apr 28", amount: 9400 },
  { name: "Apr 29", amount: 11200 },
  { name: "Apr 30", amount: 7600 },
  { name: "May 1", amount: 21200 },
];

const topProducts = [
  { name: "Premium Cotton T-shirt", category: "T-Shirts", sold: 48, revenue: 21600 },
  { name: "Slim Fit Jeans", category: "Pants", sold: 32, revenue: 38400 },
  { name: "Oxford Shirt", category: "Shirts", sold: 25, revenue: 21250 },
  { name: "Casual Polo", category: "T-Shirts", sold: 22, revenue: 14300 },
  { name: "Fashionable Hoodie", category: "Outerwear", sold: 18, revenue: 27000 },
];

const paymentMethodsData = [
  { name: "Cash", value: 45 },
  { name: "bKash", value: 25 },
  { name: "Nagad", value: 15 },
  { name: "Bank Transfer", value: 10 },
  { name: "Due", value: 5 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const Reports = () => {
  const [dateRange, setDateRange] = useState("week");

  const handleExport = () => {
    toast.info("Report export functionality will be implemented in a future update");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500 mt-1">Sales analytics and business insights</p>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sales Overview</CardTitle>
                <div className="flex gap-2">
                  <select 
                    className="border rounded px-2 py-1 text-sm"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">This year</option>
                  </select>
                  <button 
                    className="text-sm px-2 py-1 bg-muted rounded"
                    onClick={handleExport}
                  >
                    Export
                  </button>
                </div>
              </div>
              <CardDescription>Daily revenue for the selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`৳${value}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Revenue (৳)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
              <CardDescription>Key metrics for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">৳86,200</p>
                  <p className="text-xs text-green-600">+12% from last period</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs text-green-600">+8% from last period</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Order Value</p>
                  <p className="text-2xl font-bold">৳2,052</p>
                  <p className="text-xs text-green-600">+5% from last period</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold">৳5,700</p>
                  <p className="text-xs text-red-600">+2% from last period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products by sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.sold}</TableCell>
                      <TableCell>৳{product.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
              <CardDescription>Analysis of customer payment preferences</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex justify-center">
              <div className="max-w-[500px] w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Customer activity and loyalty analysis</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex justify-center items-center">
              <p className="text-muted-foreground text-center">
                Detailed customer analytics will be implemented in a future update.<br/>
                This will include metrics like customer retention, lifetime value, and purchase frequency.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
