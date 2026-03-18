
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Crown, Star } from 'lucide-react';

const LoyaltyRewards = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Loyalty Rewards | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Crown className="w-8 h-8 text-amber-500" /> Explorer Rewards
        </h1>
        <p className="text-muted-foreground mt-2">Earn points on every booking and unlock exclusive perks.</p>
      </div>

      <Card className="shadow-lg border-0 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <CardContent className="p-8 relative z-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-amber-400 font-medium tracking-wider uppercase text-sm mb-2">Current Tier</p>
              <h2 className="text-4xl font-bold">Gold Explorer</h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">12,450</p>
              <p className="text-slate-400 text-sm">Available Points</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-300">
              <span>2,550 points to Platinum</span>
              <span>15,000</span>
            </div>
            <Progress value={83} className="h-2 bg-slate-800 [&>div]:bg-amber-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyRewards;
