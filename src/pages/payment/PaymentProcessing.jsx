
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const PaymentProcessing = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Payment processed successfully!");
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Secure Checkout | Vacation Planner</title></Helmet>
      
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Secure Checkout</h1>
        <p className="text-muted-foreground mt-2">Complete your booking securely.</p>
      </div>

      <Card className="shadow-xl border-0">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="flex justify-between items-center">
            <span>Total Amount</span>
            <span className="text-2xl font-bold">$1,249.00</span>
          </CardTitle>
          <CardDescription>Tokyo Adventure - 14 Days</CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label>Cardholder Name</Label>
              <Input placeholder="Name on card" required />
            </div>
            <div className="space-y-2">
              <Label>Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input placeholder="0000 0000 0000 0000" className="pl-10" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input placeholder="MM/YY" required />
              </div>
              <div className="space-y-2">
                <Label>CVC</Label>
                <Input placeholder="123" type="password" maxLength={4} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 bg-muted/10 pt-6">
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? 'Processing...' : 'Pay $1,249.00'}
            </Button>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Payments are secure and encrypted.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PaymentProcessing;
