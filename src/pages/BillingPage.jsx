
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building, Mail, MapPin, Loader2, Lock, Trash2 } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

const BillingPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (!pb.authStore.isValid) return;
      
      const [methodsRes, historyRes] = await Promise.all([
        pb.collection('payment_methods').getList(1, 10, {
          filter: `user_id="${pb.authStore.model.id}"`,
          $autoCancel: false
        }),
        pb.collection('payments').getList(1, 10, {
          filter: `user_id="${pb.authStore.model.id}"`,
          sort: '-created',
          $autoCancel: false
        })
      ]);
      
      setPaymentMethods(methodsRes.items);
      setHistory(historyRes.items);
    } catch (error) {
      console.error('Failed to fetch billing data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setAddingCard(true);

    try {
      // $0 auth to validate card via Converge
      const response = await apiServerClient.fetch('/payments/converge/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 0,
          cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
          expiryMonth: parseInt(cardData.expiryMonth, 10),
          expiryYear: parseInt(cardData.expiryYear, 10),
          cvv: cardData.cvv,
          cardholderName: cardData.cardholderName,
          description: 'Card Validation'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Card validation failed');
      }

      // Save to PocketBase
      await pb.collection('payment_methods').create({
        user_id: pb.authStore.model.id,
        card_last_four: cardData.cardNumber.slice(-4),
        card_brand: 'Visa/Mastercard',
        is_default: paymentMethods.length === 0
      }, { $autoCancel: false });

      toast.success('Payment method added successfully');
      setIsModalOpen(false);
      setCardData({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', cardholderName: '' });
      fetchData();
      
    } catch (error) {
      toast.error(error.message || 'Failed to add payment method');
    } finally {
      setAddingCard(false);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await pb.collection('payment_methods').delete(id, { $autoCancel: false });
      toast.success('Payment method removed');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove payment method');
    }
  };

  return (
    <>
      <Helmet><title>Billing Settings - VaykAIo</title></Helmet>
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your billing information and company details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-2">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <p className="text-sm text-muted-foreground">Where should we send your receipts and billing notifications?</p>
          </div>
          <Card className="md:col-span-2 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Billing Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input defaultValue={pb.authStore.model?.email || ''} className="pl-9" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
          <div className="md:col-span-1 space-y-2">
            <h3 className="font-semibold text-lg">Payment Methods</h3>
            <p className="text-sm text-muted-foreground">Manage cards used for your subscription.</p>
          </div>
          <Card className="md:col-span-2 shadow-sm">
            <CardContent className="p-6 space-y-4">
              {loading ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : paymentMethods.length > 0 ? (
                paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
                    <div className="flex items-center gap-4">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium">{method.card_brand} ending in {method.card_last_four}</p>
                        <p className="text-xs text-muted-foreground">
                          {method.is_default ? <Badge variant="secondary" className="text-[10px] h-4 px-1 mr-2">Default</Badge> : null}
                          Added {format(new Date(method.created), 'MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteCard(method.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No payment methods saved.</p>
              )}
              <Button variant="outline" className="w-full border-dashed" onClick={() => setIsModalOpen(true)}>
                Add New Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t">
          <div className="md:col-span-1 space-y-2">
            <h3 className="font-semibold text-lg">Billing History</h3>
            <p className="text-sm text-muted-foreground">View past invoices and payments.</p>
          </div>
          <Card className="md:col-span-2 shadow-sm">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : history.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell className="pl-6">{format(new Date(payment.created), 'MMM d, yyyy')}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={payment.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">No billing history found.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Card Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Securely save your card for future billing.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCard} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Cardholder Name</Label>
                <Input required value={cardData.cardholderName} onChange={e => setCardData({...cardData, cardholderName: e.target.value})} placeholder="Name on card" />
              </div>
              <div className="space-y-2">
                <Label>Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input required value={cardData.cardNumber} onChange={e => setCardData({...cardData, cardNumber: e.target.value})} className="pl-9 font-mono" placeholder="0000 0000 0000 0000" maxLength="19" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Input required value={cardData.expiryMonth} onChange={e => setCardData({...cardData, expiryMonth: e.target.value})} placeholder="MM" maxLength="2" />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input required value={cardData.expiryYear} onChange={e => setCardData({...cardData, expiryYear: e.target.value})} placeholder="YYYY" maxLength="4" />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input required type="password" value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} placeholder="123" maxLength="4" />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={addingCard}>
                  {addingCard ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                  Save Card
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
};

export default BillingPage;
