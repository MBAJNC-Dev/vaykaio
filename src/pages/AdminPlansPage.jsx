
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Edit, Check } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AdminPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', trip_limit: '', ai_requests_limit: '', features: '' });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const records = await pb.collection('subscription_plans').getList(1, 50, {
        sort: 'price',
        $autoCancel: false,
      });
      setPlans(records.items);
    } catch (error) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const record = await pb.collection('subscription_plans').create({
        ...newPlan,
        price: Number(newPlan.price) || 0,
        trip_limit: Number(newPlan.trip_limit) || 0,
        ai_requests_limit: Number(newPlan.ai_requests_limit) || 0
      }, { $autoCancel: false });
      setPlans([...plans, record].sort((a, b) => a.price - b.price));
      setNewPlan({ name: '', price: '', trip_limit: '', ai_requests_limit: '', features: '' });
      toast.success('Plan added successfully');
    } catch (error) {
      toast.error('Failed to add plan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subscription plan?')) return;
    try {
      await pb.collection('subscription_plans').delete(id, { $autoCancel: false });
      setPlans(plans.filter(p => p.id !== id));
      toast.success('Plan deleted');
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  return (
    <>
      <Helmet><title>Manage Plans - Admin - VaykAIo</title></Helmet>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
        </div>

        <Card>
          <CardHeader><CardTitle>Create New Plan</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-sm font-medium">Plan Name</label>
                <Input required value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} placeholder="e.g. Premium" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Price ($)</label>
                <Input type="number" step="0.01" required value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: e.target.value})} placeholder="9.99" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Trip Limit</label>
                <Input type="number" required value={newPlan.trip_limit} onChange={e => setNewPlan({...newPlan, trip_limit: e.target.value})} placeholder="10" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">AI Requests Limit</label>
                <Input type="number" required value={newPlan.ai_requests_limit} onChange={e => setNewPlan({...newPlan, ai_requests_limit: e.target.value})} placeholder="100" />
              </div>
              <Button type="submit"><Plus className="w-4 h-4 mr-2"/> Add Plan</Button>
              <div className="space-y-1 md:col-span-2 lg:col-span-5">
                <label className="text-sm font-medium">Features (comma separated)</label>
                <Input value={newPlan.features} onChange={e => setNewPlan({...newPlan, features: e.target.value})} placeholder="Feature 1, Feature 2, Feature 3" />
              </div>
            </form>
          </CardContent>
        </Card>

        {loading ? <Skeleton className="h-64 w-full" /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <Card key={plan.id} className="flex flex-col relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="text-muted-foreground">Trip Limit</span>
                      <span className="font-medium">{plan.trip_limit}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="text-muted-foreground">AI Requests</span>
                      <span className="font-medium">{plan.ai_requests_limit}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features?.split(',').map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" className="w-full" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPlansPage;
