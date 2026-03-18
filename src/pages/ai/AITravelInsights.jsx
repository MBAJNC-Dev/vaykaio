
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CloudRain, Users, DollarSign } from 'lucide-react';

const mockData = [
  { month: 'Jan', price: 400, crowds: 30, weather: 45 },
  { month: 'Feb', price: 300, crowds: 20, weather: 48 },
  { month: 'Mar', price: 550, crowds: 50, weather: 60 },
  { month: 'Apr', price: 700, crowds: 70, weather: 72 },
  { month: 'May', price: 850, crowds: 85, weather: 78 },
  { month: 'Jun', price: 900, crowds: 95, weather: 85 },
];

const AITravelInsights = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Travel Insights | AI Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Destination Insights</h1>
        <p className="text-lg text-muted-foreground mt-2">Data-driven analysis to help you pick the perfect time to travel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Best Value Month</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">February</div><p className="text-sm text-muted-foreground mt-1">Average flight $300</p></CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-slate-900">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-2"><CloudRain className="w-4 h-4"/> Best Weather</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">May</div><p className="text-sm text-muted-foreground mt-1">78°F, Low precipitation</p></CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-slate-900">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2"><Users className="w-4 h-4"/> Lowest Crowds</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">January</div><p className="text-sm text-muted-foreground mt-1">30% capacity index</p></CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Annual Trends Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} name="Price Index" />
                <Line type="monotone" dataKey="crowds" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} name="Crowd Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITravelInsights;
