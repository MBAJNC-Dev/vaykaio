
import React from 'react';
import { Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement IoT (Internet of Things) integrations.
// Features to build: Smart luggage tracking APIs, hotel room automation (smart locks/thermostats) via partner APIs.

const IoTModuleStub = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <Wifi className="w-6 h-6 text-foreground" />
        </div>
        <CardTitle>IoT Connectivity</CardTitle>
        <CardDescription>Smart luggage and hotel integrations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          Research Phase
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Track your smart luggage directly from the dashboard and sync your itinerary with compatible smart hotel rooms.
        </p>
      </CardContent>
    </Card>
  );
};

export default IoTModuleStub;
