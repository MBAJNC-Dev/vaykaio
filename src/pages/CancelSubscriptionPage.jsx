
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, PauseCircle, Loader2 } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const CancelSubscriptionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');

  const handleCancel = async () => {
    setLoading(true);
    try {
      // Attempt to process a prorated refund via Converge if applicable
      // In a real app, we'd fetch the actual transaction ID from the active subscription
      try {
        await apiServerClient.fetch('/payments/converge/refund', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: 'mock_txn_id_for_refund',
            amount: 4.50 // Prorated refund amount
          })
        });
      } catch (refundError) {
        console.log('Refund skipped or failed, proceeding with cancellation', refundError);
      }

      // Update subscription status in PocketBase
      if (pb.authStore.isValid) {
        const subs = await pb.collection('subscriptions').getList(1, 1, {
          filter: `user_id="${pb.authStore.model.id}" && status="active"`,
          $autoCancel: false
        });

        if (subs.items.length > 0) {
          await pb.collection('subscriptions').update(subs.items[0].id, {
            status: 'cancelled'
          }, { $autoCancel: false });
        }
      }

      toast.success('Subscription cancelled. You will have access until the end of your billing cycle.');
      navigate('/settings/subscription');
      
    } catch (error) {
      toast.error('Failed to cancel subscription. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Cancel Subscription - VaykAIo</title></Helmet>
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
        
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Cancel Subscription</h1>
          <p className="text-muted-foreground">We're sorry to see you go.</p>
        </div>

        <Card className="border-destructive/20 shadow-sm">
          <CardHeader className="bg-destructive/5 border-b border-destructive/10">
            <CardTitle className="text-lg">What happens when you cancel?</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>You will lose access to Pro features at the end of your current billing cycle.</li>
              <li>Your account will be downgraded to the Free plan.</li>
              <li>You will only be able to maintain 2 active trips. Older trips will become read-only.</li>
              <li>Your data will not be deleted, but premium features like AI generation will be locked.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <PauseCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Need a break instead?</h3>
              <p className="text-sm text-muted-foreground mt-1">You can pause your subscription for up to 3 months. We'll keep all your data safe and you won't be billed.</p>
            </div>
            <Button className="shrink-0 sm:ml-auto">Pause Subscription</Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Help us improve</CardTitle>
            <CardDescription>Please let us know why you are cancelling.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Reason for cancellation</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expensive">Too expensive</SelectItem>
                  <SelectItem value="not_using">Not using it enough</SelectItem>
                  <SelectItem value="missing_features">Missing features I need</SelectItem>
                  <SelectItem value="bugs">Too many bugs/issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {reason === 'other' && (
              <div className="space-y-2">
                <Label>Please specify</Label>
                <Textarea placeholder="Tell us more..." className="resize-none" />
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/30 border-t p-6 flex justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>Keep Subscription</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={loading || !reason}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirm Cancellation
            </Button>
          </CardFooter>
        </Card>

      </div>
    </>
  );
};

export default CancelSubscriptionPage;
