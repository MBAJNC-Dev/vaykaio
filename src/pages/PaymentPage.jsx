
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Download, Lock } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [formData, setFormData] = useState({
    amount: '99.99',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (!pb.authStore.isValid) return;
      const records = await pb.collection('payments').getList(1, 10, {
        filter: `user_id="${pb.authStore.model.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setHistory(records.items);
    } catch (error) {
      console.error('Failed to fetch payment history', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessData(null);

    try {
      const response = await apiServerClient.fetch('/payments/converge/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          cardNumber: formData.cardNumber.replace(/\s+/g, ''),
          expiryMonth: parseInt(formData.expiryMonth, 10),
          expiryYear: parseInt(formData.expiryYear, 10),
          cvv: formData.cvv,
          cardholderName: formData.cardholderName,
          description: 'VaykAIo Payment'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Payment processing failed');
      }

      const data = await response.json();
      
      if (pb.authStore.isValid) {
        await pb.collection('payments').create({
          user_id: pb.authStore.model.id,
          amount: parseFloat(formData.amount),
          currency: data.currency || 'USD',
          status: data.status === 'approved' ? 'completed' : 'failed',
          transaction_id: data.transaction_id,
          payment_method: `Card ending in ${formData.cardNumber.slice(-4)}`,
          converge_response: data
        }, { $autoCancel: false });

        if (formData.saveCard) {
          await pb.collection('payment_methods').create({
            user_id: pb.authStore.model.id,
            card_last_four: formData.cardNumber.slice(-4),
            card_brand: 'Visa/Mastercard',
            is_default: true
          }, { $autoCancel: false });
        }
      }

      setSuccessData(data);
      toast.success('Payment processed successfully!');
      fetchHistory();
      
      setFormData(prev => ({ ...prev, cardNumber: '', cvv: '', expiryMonth: '', expiryYear: '' }));
      
    } catch (error) {
      toast.error(error.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Make a Payment - VaykAIo</title></Helmet>
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Secure Payment</h1>
            <p className="text-muted-foreground">Complete your transaction securely via Converge.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0 ring-1 ring-border">
            {successData ? (
              <CardContent className="p-12 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Payment Successful!</h2>
                <p className="text-muted-foreground">Your transaction has been processed.</p>
                <div className="bg-muted/50 p-4 rounded-xl w-full text-left space-y-2 mt-4">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount:</span> <span className="font-medium">${successData.amount} {successData.currency}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Transaction ID:</span> <span className="font-medium font-mono">{successData.transaction_id}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date:</span> <span className="font-medium">{format(new Date(), 'MMM d, yyyy h:mm a')}</span></div>
                </div>
                <Button className="w-full mt-6" onClick={() => setSuccessData(null)}>Make Another Payment</Button>
              </CardContent>
            ) : (
              <>
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2">
                    Payment Details
                    <ShieldCheck className="w-5 h-5 text-green-600 ml-auto" />
                  </CardTitle>
                  <CardDescription>All transactions are secure and encrypted.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Amount (USD)</Label>
                      <Input 
                        type="number" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleInputChange} 
                        min="0.50" 
                        step="0.01" 
                        required 
                        className="text-lg font-medium"
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Card Information</h3>
                      
                      <div className="space-y-2">
                        <Label>Cardholder Name</Label>
                        <Input name="cardholderName" value={formData.cardholderName} onChange={handleInputChange} required placeholder="Name on card" />
                      </div>

                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input 
                            name="cardNumber" 
                            value={formData.cardNumber} 
                            onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})} 
                            required 
                            maxLength="19"
                            placeholder="0000 0000 0000 0000" 
                            className="pl-10 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Month</Label>
                          <Input name="expiryMonth" value={formData.expiryMonth} onChange={handleInputChange} required placeholder="MM" maxLength="2" />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input name="expiryYear" value={formData.expiryYear} onChange={handleInputChange} required placeholder="YYYY" maxLength="4" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input name="cvv" type="password" value={formData.cvv} onChange={handleInputChange} required placeholder="123" maxLength="4" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="saveCard" name="saveCard" checked={formData.saveCard} onCheckedChange={(c) => setFormData({...formData, saveCard: c})} />
                      <label htmlFor="saveCard" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Save this card for future payments
                      </label>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Lock className="w-5 h-5 mr-2" />}
                      Pay ${formData.amount || '0.00'}
                    </Button>
                  </form>
                </CardContent>
              </>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm border-0 ring-1 ring-border">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your payment history and receipts.</CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Receipt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{format(new Date(payment.created), 'MMM d, yyyy')}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                payment.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" title="Download Receipt">
                                <Download className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p>No payment history found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
