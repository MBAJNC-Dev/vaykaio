
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Jan', predicted: 4000, actual: 4200 },
  { name: 'Feb', predicted: 3000, actual: 3100 },
  { name: 'Mar', predicted: 5000, actual: null },
  { name: 'Apr', predicted: 7000, actual: null },
];

const PredictiveAnalytics = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Predictive Analytics | Admin</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Predictive Analytics</h1>
        <p className="text-muted-foreground mt-2">AI-driven forecasts for platform usage and revenue.</p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Revenue Forecast (Q1-Q2)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} name="Actual Revenue" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(var(--accent))" strokeWidth={3} strokeDasharray="5 5" name="Predicted Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
