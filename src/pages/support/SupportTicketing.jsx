
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Ticket } from 'lucide-react';

const SupportTicketing = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Support Tickets | Vacation Planner</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground mt-2">Track your requests and issues.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Ticket</Button>
      </div>

      <Card className="shadow-sm border-0">
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <Ticket className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <h4 className="font-semibold">Issue with payment processing</h4>
                  <p className="text-sm text-muted-foreground mt-1">#TKT-892 • Created 2 days ago</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-0">In Progress</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketing;
