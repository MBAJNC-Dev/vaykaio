
import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement Real-Time collaboration and data sync.
// Add dependencies: Socket.io, Yjs, or utilize PocketBase real-time subscriptions.
// Features to build: Live cursor tracking for group planning, instant chat, live flight status updates.

const RealTimeModuleStub = () => {
  return (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
          <Activity className="w-6 h-6 text-green-500" />
        </div>
        <CardTitle>Real-Time Sync</CardTitle>
        <CardDescription>Live collaboration and instant updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
          Integration In-Progress
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Plan together with your family in real-time. See their cursors, chat instantly, and get live flight delay notifications.
        </p>
      </CardContent>
    </Card>
  );
};

export default RealTimeModuleStub;
