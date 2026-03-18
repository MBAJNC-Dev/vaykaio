
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Clock } from 'lucide-react';

const Challenges = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Challenges | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Active Challenges</h1>
        <p className="text-muted-foreground mt-2">Complete tasks to earn bonus points and exclusive badges.</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border-0 border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-accent"/> Summer Explorer</CardTitle>
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded flex items-center gap-1"><Clock className="w-3 h-3"/> 5 days left</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Visit 3 different beaches and upload a photo for each.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span>2 / 3</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Challenges;
