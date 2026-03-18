
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bitcoin, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import Web3WalletConnection from '@/components/Web3WalletConnection.jsx';
import { toast } from 'sonner';

const CryptoPaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDC');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment transaction submitted to network!');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>Pay with Crypto</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crypto Checkout</h1>
        <p className="text-muted-foreground mt-1">Securely pay for your bookings using cryptocurrency.</p>
      </div>

      <Web3WalletConnection />

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Select your preferred token to complete the transaction.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input type="number" value="450.00" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Pay With</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC (Polygon)</SelectItem>
                    <SelectItem value="USDT">USDT (Ethereum)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="MATIC">Polygon (MATIC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span>1 USDC = $1.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Gas Fee</span>
                <span>~0.001 MATIC ($0.02)</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total to Pay</span>
                <span>450.00 {currency}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
              {isProcessing ? 'Confirming in Wallet...' : `Pay 450.00 ${currency}`}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t bg-muted/20 py-4">
          <p className="text-xs text-muted-foreground flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-green-600" /> Payments are secured by smart contracts.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CryptoPaymentPage;
