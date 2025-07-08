
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
import { CreditCard, Smartphone, Building2, Banknote, Clock } from "lucide-react";
import { toast } from "sonner";

const Payments = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const paymentMethods = [
    { value: 'cash', label: 'Cash Payment', icon: Banknote },
    { value: 'bkash', label: 'bKash Mobile Banking', icon: Smartphone },
    { value: 'nagad', label: 'Nagad Mobile Banking', icon: Smartphone },
    { value: 'bank', label: 'Bank Transfer', icon: Building2 },
    { value: 'due', label: 'Due Payment', icon: Clock }
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payment = {
      id: `PAY-${Date.now()}`,
      method: paymentMethod,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      status: paymentMethod === 'due' ? 'Pending' : 'Completed'
    };

    // Store payment in localStorage
    const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    existingPayments.push(payment);
    localStorage.setItem('payments', JSON.stringify(existingPayments));

    toast.success("Payment processed successfully!");
    
    // Reset form
    setPaymentMethod("");
    setAmount("");
    setDescription("");
  };

  return (
    <div className="animate-fade-in p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Payments</h1>
        <p className="text-gray-500 mt-1">Process payments for your business</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Process Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {method.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (৳)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Payment description"
                />
              </div>

              <Button type="submit" className="w-full">
                Process Payment
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.value} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <span className="font-medium">{method.label}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
