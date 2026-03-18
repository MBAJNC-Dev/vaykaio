
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Route, Clock, Zap } from 'lucide-react';

const AISmarterPlanning = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Smart Planning | AI Vacation Planner</title></Helmet>
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Smart Itinerary Optimization</h1>
        <p className="text-lg text-muted-foreground">Let our AI reorganize your plans for maximum efficiency, minimal travel time, and perfect pacing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Route className="w-5 h-5 text-primary" /> Current vs Optimized Route</CardTitle>
            <CardDescription>We found a way to save you 2.5 hours of transit time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[400px] bg-muted rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed">
              <p className="text-muted-foreground flex items-center gap-2"><BrainCircuit className="w-6 h-6" /> Interactive Map Visualization Placeholder</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5" /> Optimization Ready</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-2">
                <span>Transit Time Saved</span>
                <span className="font-bold">2h 30m</span>
              </div>
              <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-2">
                <span>Cost Reduced</span>
                <span className="font-bold">$45.00</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span>Pacing Score</span>
                <span className="font-bold text-green-300">Excellent</span>
              </div>
              <Button className="w-full bg-background text-foreground hover:bg-background/90 mt-4">Apply Optimization</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Clock className="w-5 h-5 text-accent" /> Smart Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <span className="font-semibold block mb-1">Move Louvre Visit</span>
                Shift from 2 PM to 9 AM to avoid peak crowd hours (estimated 40% fewer people).
              </div>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <span className="font-semibold block mb-1">Group Activities</span>
                Grouped Montmartre activities together to save 45 mins of metro travel.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AISmarterPlanning;
