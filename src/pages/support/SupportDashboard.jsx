
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Clock } from 'lucide-react';

const SupportDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Agent Dashboard | Support</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Support Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of current support metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-primary"/> 24</div></CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-accent"/> 12m</div></CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active Agents</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-green-500"/> 5</div></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportDashboard;
