
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Radar, AlertTriangle, PlaneTakeoff } from 'lucide-react';

const AIPredictiveAnalytics = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Predictive Analytics | AI Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Predictive Analytics</h1>
        <p className="text-lg text-muted-foreground mt-2">Forecasting flight prices, hotel availability, and travel disruptions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PlaneTakeoff className="w-5 h-5 text-primary" /> Flight Price Forecast</CardTitle>
            <CardDescription>JFK to CDG (Next 30 Days)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recommendation</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">Buy Now</p>
              <p className="text-sm mt-2">Prices are expected to rise by 15% in the next 7 days.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence Score</span>
                <span className="font-bold">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-accent" /> Disruption Risk</CardTitle>
            <CardDescription>Based on historical weather and airline data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg flex items-start gap-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full">
                  <Radar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Moderate Weather Risk</h4>
                  <p className="text-sm text-muted-foreground mt-1">20% chance of delays due to forecasted thunderstorms in the departure region.</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg flex items-start gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
                  <PlaneTakeoff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">High Airline Reliability</h4>
                  <p className="text-sm text-muted-foreground mt-1">Selected airline has a 94% on-time performance record for this route.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIPredictiveAnalytics;
