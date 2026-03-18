
import React from 'react';
import { Glasses } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement Virtual Reality features.
// Add dependencies: A-Frame, WebXR API.
// Features to build: 360-degree destination previews, virtual hotel tours before booking.

const VRModuleStub = () => {
  return (
    <Card className="border-purple-500/20 bg-purple-500/5">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
          <Glasses className="w-6 h-6 text-purple-500" />
        </div>
        <CardTitle>VR Pre-Travel</CardTitle>
        <CardDescription>Immersive 360° destination previews.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500">
          Coming Soon
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Step into your hotel room or walk the streets of your destination in full Virtual Reality before you even pack your bags.
        </p>
      </CardContent>
    </Card>
  );
};

export default VRModuleStub;
