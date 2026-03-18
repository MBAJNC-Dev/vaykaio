
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Clock } from 'lucide-react';

const PromotionsDiscounts = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Promotions | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Active Promotions</h1>
        <p className="text-muted-foreground mt-2">Special offers and discounts for your next trip.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md border-0 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Tag className="w-5 h-5 text-primary"/> Summer Early Bird</CardTitle>
            <CardDescription>Book your summer getaway before March 31st.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-primary">15% OFF</div>
              <Button variant="outline">Use Code: SUMMER15</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1"><Clock className="w-3 h-3"/> Expires in 14 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromotionsDiscounts;
