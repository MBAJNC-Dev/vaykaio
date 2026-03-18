import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Check,
  X,
  CreditCard,
  LogOut,
  AlertTriangle,
  ChevronRight,
  Download
} from 'lucide-react';
import SubscriptionService from '@/services/SubscriptionService';
import { toast } from 'sonner';

const SubscriptionManagementPage = () => {
  const userId = localStorage.getItem('userId') || 'user_1';
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellationFeedback, setCancellationFeedback] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const subscription = await SubscriptionService.getCurrentSubscription(userId);
      const plans = SubscriptionService.getPlans();
      const history = await SubscriptionService.getBillingHistory(userId);

      setCurrentSubscription(subscription);
      setAllPlans(plans);
      setBillingHistory(history);
    } catch (error) {
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      await SubscriptionService.upgradeSubscription(currentSubscription?.userId, planId);
      toast.success('Subscription upgraded successfully');
      fetchSubscriptionData();
    } catch (error) {
      toast.error('Failed to upgrade subscription');
    }
  };

  const handleDowngrade = async (planId) => {
    try {
      await SubscriptionService.downgradeSubscription(currentSubscription?.userId, planId);
      toast.success('Subscription downgraded successfully');
      fetchSubscriptionData();
    } catch (error) {
      toast.error('Failed to downgrade subscription');
    }
  };

  const handleCancel = async () => {
    try {
      await SubscriptionService.cancelSubscription(currentSubscription?.userId);
      toast.success('Subscription cancelled');
      setShowCancelDialog(false);
      fetchSubscriptionData();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading subscription data...</p>
      </div>
    );
  }

  const PLAN_ORDER = { free: 0, pro: 1, premium: 2 };
  const nextBillingDate = currentSubscription?.renewalDate
    ? new Date(currentSubscription.renewalDate).toLocaleDateString()
    : 'N/A';

  return (
    <>
      <Helmet>
        <title>Subscription Management - VaykAIo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage your plan, billing, and account.</p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Current Plan</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade/Downgrade</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
          </TabsList>

          {/* Current Plan Tab */}
          <TabsContent value="current" className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{currentSubscription?.plan.name}</CardTitle>
                    <CardDescription>Your current subscription plan</CardDescription>
                  </div>
                  <Badge variant={currentSubscription?.status === 'active' ? 'default' : 'destructive'}>
                    {currentSubscription?.status === 'active' ? 'Active' : 'Cancelled'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Features */}
                <div>
                  <h3 className="font-semibold mb-4">Plan Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentSubscription?.plan.features && Object.entries(currentSubscription.plan.features).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        {value ? (
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {typeof value === 'boolean' ? (value ? 'Included' : 'Not included') : value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Info */}
                <div className="pt-6 border-t space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Price</p>
                      <p className="text-2xl font-bold">${currentSubscription?.plan.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Billing Date</p>
                      <p className="text-lg font-medium">{nextBillingDate}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Payment Method</p>
                          <p className="text-sm text-muted-foreground">
                            {currentSubscription?.paymentMethod
                              ? `${currentSubscription.paymentMethod.brand} •••• ${currentSubscription.paymentMethod.last4}`
                              : 'No payment method'}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                </div>

                {/* Cancel Button */}
                {currentSubscription?.status === 'active' && currentSubscription?.planId !== 'free' && (
                  <div className="pt-6 border-t">
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                          <LogOut className="h-4 w-4 mr-2" /> Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Subscription</DialogTitle>
                          <DialogDescription>
                            We're sorry to see you go. Please let us know why you're cancelling.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Reason for cancellation</Label>
                            <Textarea
                              placeholder="Help us improve..."
                              value={cancellationFeedback}
                              onChange={(e) => setCancellationFeedback(e.target.value)}
                              className="min-h-24"
                            />
                          </div>
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              Your subscription will be cancelled immediately. You'll have access until the end of your billing period.
                            </AlertDescription>
                          </Alert>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Keep Subscription</Button>
                          <Button variant="destructive" onClick={handleCancel}>Confirm Cancellation</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upgrade/Downgrade Tab */}
          <TabsContent value="upgrade" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allPlans.map((plan) => {
                const isCurrent = currentSubscription?.planId === plan.id;
                const canUpgrade = PLAN_ORDER[plan.id] > PLAN_ORDER[currentSubscription?.planId];

                return (
                  <Card
                    key={plan.id}
                    className={`flex flex-col ${isCurrent ? 'ring-2 ring-primary border-primary' : ''}`}
                  >
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      {isCurrent && (
                        <Badge className="w-fit mt-4">Current Plan</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                      <ul className="space-y-3">
                        {Object.entries(plan.features).map(([key, value]) => (
                          <li key={key} className="flex items-start gap-3">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}: {
                                typeof value === 'boolean' ? (value ? 'Included' : 'Not included') : value
                              }
                            </span>
                          </li>
                        ))}
                      </ul>

                      {!isCurrent && (
                        <Button
                          className="w-full"
                          onClick={() => canUpgrade ? handleUpgrade(plan.id) : handleDowngrade(plan.id)}
                        >
                          {canUpgrade ? 'Upgrade' : 'Downgrade'} <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Billing History Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Billing History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No billing history yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        billingHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-sm">{record.id}</TableCell>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell className="capitalize">{record.planName}</TableCell>
                            <TableCell className="font-medium">${record.amount}</TableCell>
                            <TableCell>
                              <Badge variant={record.status === 'paid' ? 'default' : 'secondary'}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">Download</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SubscriptionManagementPage;
