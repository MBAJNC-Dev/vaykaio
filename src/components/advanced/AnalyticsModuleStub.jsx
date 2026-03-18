
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement Advanced Analytics.
// Add dependencies: Recharts or Chart.js.
// Features to build: User spending heatmaps, carbon footprint tracking, travel habit insights.

const AnalyticsModuleStub = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <BarChart3 className="w-6 h-6 text-foreground" />
        </div>
        <CardTitle>Deep Insights</CardTitle>
        <CardDescription>Understand your travel habits.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          Coming Soon
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Visualize your spending across categories, track your carbon footprint, and discover patterns in your travel history.
        </p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsModuleStub;
