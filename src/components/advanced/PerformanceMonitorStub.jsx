
import React from 'react';
import { Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement Performance Monitoring.
// Features to build: Client-side performance tracking (Web Vitals), offline-first PWA capabilities, edge caching metrics.

const PerformanceMonitorStub = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <Zap className="w-6 h-6 text-foreground" />
        </div>
        <CardTitle>Edge Performance</CardTitle>
        <CardDescription>Lightning fast, anywhere in the world.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          In Development
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Optimized for slow hotel Wi-Fi. Full offline capabilities and edge-cached data ensure your itinerary loads instantly.
        </p>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitorStub;
