
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const RefundCancellation = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Request Refund | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Cancel & Refund</h1>
        <p className="text-muted-foreground mt-2">Submit a request to cancel your booking.</p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex gap-3 text-amber-800 dark:text-amber-300">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Cancellation Policy</p>
          <p>You are eligible for a full refund if cancelled 14 days prior to departure. Cancellations within 14 days are subject to a 20% fee.</p>
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Tokyo Adventure (Ref: #TK-8921)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Reason for Cancellation</Label>
            <Textarea placeholder="Please tell us why you need to cancel..." className="min-h-[100px]" />
          </div>
          <Button variant="destructive" className="w-full">Submit Cancellation Request</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundCancellation;
