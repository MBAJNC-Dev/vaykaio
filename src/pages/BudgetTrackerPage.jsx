
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { DollarSign, Plus, Receipt, TrendingUp, AlertCircle, Download } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const BudgetTrackerPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripRecord = await pb.collection('trips').getOne(tripId, { $autoCancel: false });
        setTrip(tripRecord);

        const expensesRecords = await pb.collection('expenses').getFullList({
          filter: `trip_id="${tripId}"`,
          sort: '-date',
          $autoCancel: false
        });
        setExpenses(expensesRecords);
      } catch (error) {
        toast.error('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  const totalBudget = trip?.budget || 0;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  // Group expenses by category for chart
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const chartData = Object.keys(expensesByCategory).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: expensesByCategory[key]
  }));

  if (loading) return <div className="p-12 text-center">Loading budget data...</div>;

  return (
    <>
      <Helmet><title>Budget Tracker - VaykAIo</title></Helmet>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget Tracker</h1>
            <p className="text-muted-foreground mt-1">Manage expenses for {trip?.destination}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Expense</Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Budget</p>
                  <h3 className="text-3xl font-bold">${totalBudget.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><DollarSign className="w-5 h-5" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Spent</p>
                  <h3 className="text-3xl font-bold">${totalSpent.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600"><Receipt className="w-5 h-5" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className={remaining < 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Remaining</p>
                  <h3 className={`text-3xl font-bold ${remaining < 0 ? 'text-destructive' : 'text-green-600'}`}>
                    ${remaining.toLocaleString()}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${remaining < 0 ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-600'}`}>
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h4 className="font-semibold">Budget Usage</h4>
                <p className="text-sm text-muted-foreground">{percentUsed.toFixed(1)}% of total budget spent</p>
              </div>
              {percentUsed >= 90 && (
                <span className="flex items-center text-sm font-medium text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                  <AlertCircle className="w-4 h-4 mr-1" /> Approaching Limit
                </span>
              )}
            </div>
            <Progress value={percentUsed} className={`h-3 mt-4 ${percentUsed > 100 ? 'bg-destructive' : ''}`} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => `$${value}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No expenses recorded yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Expenses List */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              {expenses.length > 0 ? (
                <div className="space-y-4">
                  {expenses.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {expense.category.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(expense.date), 'MMM d, yyyy')} • Paid by {expense.paid_by || 'You'}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-lg">
                        ${expense.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-dashed border-2 rounded-xl">
                  <Receipt className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No expenses added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BudgetTrackerPage;
