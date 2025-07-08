
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreditCard, Smartphone, Building2, Banknote, Clock } from "lucide-react";

interface Payment {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  notes?: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [newPayment, setNewPayment] = useState({
    invoiceNumber: '',
    customerName: '',
    amount: 0,
    method: '',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    // Load payments from localStorage
    const storedPayments = localStorage.getItem("payments");
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    }
  }, []);

  const savePayments = (updatedPayments: Payment[]) => {
    localStorage.setItem("payments", JSON.stringify(updatedPayments));
    setPayments(updatedPayments);
  };

  const handleAddPayment = () => {
    if (!newPayment.invoiceNumber || !newPayment.customerName || newPayment.amount <= 0 || !newPayment.method) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payment: Payment = {
      id: Date.now().toString(),
      ...newPayment,
      date: new Date().toISOString(),
    };

    const updatedPayments = [payment, ...payments];
    savePayments(updatedPayments);

    // Reset form
    setNewPayment({
      invoiceNumber: '',
      customerName: '',
      amount: 0,
      method: '',
      status: 'pending',
      notes: ''
    });

    toast.success("Payment record added successfully!");
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bkash':
      case 'nagad':
        return <Smartphone className="h-4 w-4" />;
      case 'bank':
        return <Building2 className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'due':
        return <Clock className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Payments</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage payment records and transactions</p>
        </div>
      </div>

      {/* Add New Payment Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add New Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={newPayment.invoiceNumber}
                onChange={(e) => setNewPayment({ ...newPayment, invoiceNumber: e.target.value })}
                placeholder="Enter invoice number"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={newPayment.customerName}
                onChange={(e) => setNewPayment({ ...newPayment, customerName: e.target.value })}
                placeholder="Enter customer name"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (৳)</Label>
              <Input
                id="amount"
                type="number"
                value={newPayment.amount || ''}
                onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash Payment</SelectItem>
                  <SelectItem value="bkash">bKash Mobile Banking</SelectItem>
                  <SelectItem value="nagad">Nagad Mobile Banking</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="due">Due Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setNewPayment({ ...newPayment, status: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={newPayment.notes}
              onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
              placeholder="Add any additional notes..."
              className="w-full resize-none"
              rows={3}
            />
          </div>

          <Button onClick={handleAddPayment} className="w-full sm:w-auto">
            Add Payment Record
          </Button>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payment records found</p>
              <p className="text-sm text-gray-400 mt-1">Add your first payment record above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-0"
                >
                  <div className="flex-1 space-y-1 w-full sm:w-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base">{payment.invoiceNumber}</h3>
                      <span className="text-xs sm:text-sm text-gray-500">{payment.customerName}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {getMethodIcon(payment.method)}
                        <span className="capitalize">{payment.method}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <span className="text-lg sm:text-xl font-bold text-primary">৳{payment.amount.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
