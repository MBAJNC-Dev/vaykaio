
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ArrowRight, Clock, Map, CheckCircle2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AITravelOptimizationPage = () => {
  const { tripId } = useParams();
  const [loading, setLoading] = useState(true);
  const [optimization, setOptimization] = useState(null);

  useEffect(() => {
    const fetchOptimization = async () => {
      try {
        setLoading(true);
        // Mock optimization data
        setTimeout(() => {
          setOptimization({
            score: 85,
            timeSaved: '1h 45m',
            distanceSaved: '12 km',
            currentRoute: ['Hotel', 'Museum', 'Lunch', 'Park', 'Dinner'],
            optimizedRoute: ['Hotel', 'Park', 'Museum', 'Lunch', 'Dinner'],
            reason: 'Reordering the Park and Museum reduces backtracking across the city, saving nearly 2 hours of transit time.'
          });
          setLoading(false);
        }, 1500);
      } catch (error) {
        toast.error('Failed to load optimization');
        setLoading(false);
      }
    };
    fetchOptimization();
  }, [tripId]);

  return (
    <>
      <Helmet><title>Route Optimization - VaykAIo</title></Helmet>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Map className="w-8 h-8 text-primary" /> AI Route Optimization
          </h1>
          <p className="text-muted-foreground mt-1">Maximize your time by minimizing transit.</p>
        </div>

        {loading ? (
          <Card className="h-[400px] flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-bold mb-2">Analyzing your itinerary...</h3>
            <p className="text-muted-foreground">Calculating optimal routes and transit times.</p>
          </Card>
        ) : optimization && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <Card className="lg:col-span-1 bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-3xl font-bold text-primary">{optimization.score}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Efficiency Score</h3>
                <p className="text-sm text-muted-foreground mb-6">Your current itinerary is good, but we can make it better.</p>
                
                <div className="space-y-3 text-left">
                  <div className="bg-background p-3 rounded-lg border flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time Saved</p>
                      <p className="font-bold">{optimization.timeSaved}</p>
                    </div>
                  </div>
                  <div className="bg-background p-3 rounded-lg border flex items-center gap-3">
                    <Map className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Distance Saved</p>
                      <p className="font-bold">{optimization.distanceSaved}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> Suggested Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-xl border">
                  <p className="text-sm leading-relaxed">{optimization.reason}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Current Route</h4>
                    <div className="space-y-2">
                      {optimization.currentRoute.map((stop, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{i+1}</div>
                          <span className="text-muted-foreground">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Optimized Route</h4>
                    <div className="space-y-2">
                      {optimization.optimizedRoute.map((stop, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{i+1}</div>
                          <span className="font-medium">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1"><CheckCircle2 className="w-4 h-4 mr-2" /> Apply Optimization</Button>
                  <Button variant="outline" className="flex-1">Keep Current</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default AITravelOptimizationPage;
