
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const BudgetPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ category: 'other', planned_amount: '', actual_amount: '', notes: '' });

  useEffect(() => {
    fetchData();
  }, [tripId]);

  const fetchData = async () => {
    try {
      const tripRecord = await pb.collection('trips').getOne(tripId, { $autoCancel: false });
      setTrip(tripRecord);

      const budgetRecords = await pb.collection('budget').getList(1, 50, {
        filter: `trip_id = "${tripId}"`,
        $autoCancel: false,
      });
      setBudgets(budgetRecords.items);
    } catch (error) {
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const record = await pb.collection('budget').create({
        ...newItem,
        trip_id: tripId,
        planned_amount: Number(newItem.planned_amount) || 0,
        actual_amount: Number(newItem.actual_amount) || 0
      }, { $autoCancel: false });
      setBudgets([...budgets, record]);
      setNewItem({ category: 'other', planned_amount: '', actual_amount: '', notes: '' });
      toast.success('Budget item added');
    } catch (error) {
      toast.error('Failed to add budget item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget item?')) return;
    try {
      await pb.collection('budget').delete(id, { $autoCancel: false });
      setBudgets(budgets.filter(b => b.id !== id));
      toast.success('Item deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const totalPlanned = budgets.reduce((sum, b) => sum + (b.planned_amount || 0), 0);
  const totalActual = budgets.reduce((sum, b) => sum + (b.actual_amount || 0), 0);
  const tripBudget = trip?.budget || 0;
  const percentUsed = tripBudget > 0 ? Math.min(100, (totalActual / tripBudget) * 100) : 0;

  const chartData = budgets.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.actual_amount || 0;
    } else {
      acc.push({ name: curr.category, value: curr.actual_amount || 0 });
    }
    return acc;
  }, []).filter(item => item.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

  if (loading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;

  return (
    <>
      <Helmet><title>Budget - VaykAIo</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2"><DollarSign className="w-8 h-8 text-primary"/> Budget Tracker</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Total Spent: ${totalActual.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">Budget: ${tripBudget.toLocaleString()}</span>
                </div>
                <Progress value={percentUsed} className={`h-3 ${percentUsed > 90 ? 'bg-destructive/20' : ''}`} indicatorClassName={percentUsed > 90 ? 'bg-destructive' : 'bg-primary'} />
                {percentUsed > 100 && <p className="text-xs text-destructive mt-2">You are over budget!</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Planned Total</p>
                  <p className="text-2xl font-bold">${totalPlanned.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className={`text-2xl font-bold ${tripBudget - totalActual < 0 ? 'text-destructive' : 'text-green-600'}`}>
                    ${(tripBudget - totalActual).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
            <CardContent className="h-[200px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No spending data yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Add Budget Item</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <Select value={newItem.category} onValueChange={v => setNewItem({...newItem, category: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flights">Flights</SelectItem>
                    <SelectItem value="hotels">Hotels</SelectItem>
                    <SelectItem value="activities">Activities</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Planned ($)</label>
                <Input type="number" value={newItem.planned_amount} onChange={e => setNewItem({...newItem, planned_amount: e.target.value})} placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Actual ($)</label>
                <Input type="number" value={newItem.actual_amount} onChange={e => setNewItem({...newItem, actual_amount: e.target.value})} placeholder="0" />
              </div>
              <div className="space-y-1 md:col-span-2 flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium">Notes</label>
                  <Input value={newItem.notes} onChange={e => setNewItem({...newItem, notes: e.target.value})} placeholder="Optional notes" />
                </div>
                <Button type="submit"><Plus className="w-4 h-4 mr-2"/> Add</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <Card key={b.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium capitalize">{b.category}</p>
                  <p className="text-sm text-muted-foreground">{b.notes || 'No notes'}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Planned: ${b.planned_amount || 0}</p>
                    <p className="font-bold">Actual: ${b.actual_amount || 0}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default BudgetPage;
