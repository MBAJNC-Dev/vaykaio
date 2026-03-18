
import React from 'react';
import { View } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement Augmented Reality features.
// Add dependencies: react-three-fiber, @react-three/xr.
// Features to build: AR city guides, translation overlays, interactive hotel room previews.

const ARModuleStub = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <View className="w-6 h-6 text-foreground" />
        </div>
        <CardTitle>AR City Guides</CardTitle>
        <CardDescription>Augmented reality overlays for your destination.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          In Development
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Point your camera at landmarks to instantly receive historical context, reviews, and AI-generated audio tours.
        </p>
      </CardContent>
    </Card>
  );
};

export default ARModuleStub;
