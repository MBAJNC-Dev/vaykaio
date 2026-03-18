
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Blocks, Plus } from 'lucide-react';

const IntegrationMarketplace = () => {
  const apps = [
    { id: 1, name: 'Google Calendar', desc: 'Sync your itineraries directly to your calendar.', connected: true },
    { id: 2, name: 'Splitwise', desc: 'Automatically export group expenses.', connected: false },
    { id: 3, name: 'Uber', desc: 'Book rides directly from your itinerary.', connected: false },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>App Marketplace | Vacation Planner</title></Helmet>
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Blocks className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Integration Marketplace</h1>
        <p className="text-lg text-muted-foreground mt-4">Connect your favorite tools to supercharge your travel planning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apps.map(app => (
          <Card key={app.id} className="shadow-sm border-0 flex flex-col">
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.desc}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4">
              <Button variant={app.connected ? "secondary" : "default"} className="w-full">
                {app.connected ? 'Connected' : <><Plus className="w-4 h-4 mr-2" /> Connect</>}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationMarketplace;
