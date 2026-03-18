
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, CheckCircle2, Loader2, CreditCard, Lock } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const UpgradeDowngradePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  const proratedAmount = 15.49;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process prorated payment via Converge
      const response = await apiServerClient.fetch('/payments/converge/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: proratedAmount,
          cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
          expiryMonth: parseInt(cardData.expiryMonth, 10),
          expiryYear: parseInt(cardData.expiryYear, 10),
          cvv: cardData.cvv,
          cardholderName: cardData.cardholderName,
          description: 'Plan Upgrade Prorated Charge'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Payment failed');
      }

      // Update subscription in PocketBase
      if (pb.authStore.isValid) {
        // Find existing active subscription
        const subs = await pb.collection('subscriptions').getList(1, 1, {
          filter: `user_id="${pb.authStore.model.id}" && status="active"`,
          $autoCancel: false
        });

        if (subs.items.length > 0) {
          await pb.collection('subscriptions').update(subs.items[0].id, {
            plan: 'premium'
          }, { $autoCancel: false });
        } else {
          await pb.collection('subscriptions').create({
            user_id: pb.authStore.model.id,
            plan: 'premium',
            status: 'active',
            start_date: new Date().toISOString()
          }, { $autoCancel: false });
        }
      }

      toast.success('Subscription upgraded successfully!');
      navigate('/settings/subscription');
      
    } catch (error) {
      toast.error(error.message || 'Failed to upgrade subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Change Plan - VaykAIo</title></Helmet>
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Review Plan Change</h1>
          <p className="text-muted-foreground">You are upgrading from Pro to Premium.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          <Card className="md:col-span-2 opacity-70">
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2">Current Plan</Badge>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>$9.99 / month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Unlimited trips</li>
                <li>• AI Itinerary Builder (50/mo)</li>
                <li>• Advanced budget analytics</li>
              </ul>
            </CardContent>
          </Card>

          <div className="hidden md:flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
          </div>

          <Card className="md:col-span-2 ring-2 ring-amber-500 shadow-lg bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/20">
            <CardHeader>
              <Badge className="w-fit mb-2 bg-amber-500 hover:bg-amber-600 border-0">New Plan</Badge>
              <CardTitle>Premium Plan</CardTitle>
              <CardDescription>$19.99 / month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500"/> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500"/> Unlimited AI generations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500"/> Smart Photo Albums</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500"/> Journal Insights</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleConfirm}>
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Summary of Charges</h3>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Premium Plan (Monthly)</span>
                  <span>$19.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prorated credit for unused Pro Plan</span>
                  <span className="text-green-600">-$4.50</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Due Today</span>
                  <span>${proratedAmount}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-primary/10">
                <h4 className="font-medium text-sm">Payment Details</h4>
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input required value={cardData.cardNumber} onChange={e => setCardData({...cardData, cardNumber: e.target.value})} className="pl-9 font-mono bg-background" placeholder="0000 0000 0000 0000" maxLength="19" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Input required value={cardData.expiryMonth} onChange={e => setCardData({...cardData, expiryMonth: e.target.value})} placeholder="MM" maxLength="2" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input required value={cardData.expiryYear} onChange={e => setCardData({...cardData, expiryYear: e.target.value})} placeholder="YYYY" maxLength="4" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input required type="password" value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} placeholder="123" maxLength="4" className="bg-background" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-background/50 p-6 flex justify-end gap-4 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="premium-gradient border-0">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                Pay ${proratedAmount} & Upgrade
              </Button>
            </CardFooter>
          </Card>
        </form>

      </div>
    </>
  );
};

export default UpgradeDowngradePage;
