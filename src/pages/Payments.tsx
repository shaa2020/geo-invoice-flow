
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building2, Banknote, Clock, History } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  method: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

const Payments = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { value: 'cash', label: 'Cash Payment', icon: Banknote },
    { value: 'bkash', label: 'bKash Mobile Banking', icon: Smartphone },
    { value: 'nagad', label: 'Nagad Mobile Banking', icon: Smartphone },
    { value: 'bank', label: 'Bank Transfer', icon: Building2 },
    { value: 'due', label: 'Due Payment', icon: Clock }
  ];

  // Load payments on component mount
  useEffect(() => {
    const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    setPayments(storedPayments);
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const payment: Payment = {
        id: `PAY-${Date.now()}`,
        method: paymentMethod,
        amount: parseFloat(amount),
        description: description || 'No description',
        date: new Date().toISOString(),
        status: paymentMethod === 'due' ? 'Pending' : 'Completed'
      };

      // Store payment in localStorage
      const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
      const updatedPayments = [payment, ...existingPayments];
      localStorage.setItem('payments', JSON.stringify(updatedPayments));
      
      // Update state
      setPayments(updatedPayments);

      toast.success("Payment processed successfully!");
      
      // Reset form
      setPaymentMethod("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodObj = paymentMethods.find(m => m.value === method);
    return methodObj ? methodObj.label : method;
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-fade-in p-2 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Process payments for your business</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Payment Form */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CreditCard className="h-5 w-5" />
              Process Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method" className="text-sm font-medium">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method" className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm">{method.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">Amount (৳)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Payment description"
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={loading}
              >
                {loading ? "Processing..." : "Process Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Payment Methods Info */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Available Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.value} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm sm:text-base">{method.label}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      {payments.length > 0 && (
        <Card className="mt-4 sm:mt-6 w-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <History className="h-5 w-5" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{payment.description}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{getPaymentMethodLabel(payment.method)}</p>
                    <p className="text-xs text-gray-400">{formatDate(payment.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-semibold text-sm sm:text-base">{formatCurrency(payment.amount)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Payments;
