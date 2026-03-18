
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, Download, CheckCircle2 } from 'lucide-react';

const OfflineMode = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Offline Access | Vacation Planner</title></Helmet>
      
      <div className="text-center">
        <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4">
          <WifiOff className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Offline Access</h1>
        <p className="text-muted-foreground mt-2">Download your itineraries to access them without internet.</p>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle>Available for Download</CardTitle>
          <CardDescription>Save data to your device storage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-xl">
            <div>
              <p className="font-semibold">Tokyo Adventure</p>
              <p className="text-sm text-muted-foreground">14 Days • 12.4 MB</p>
            </div>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Download</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-xl bg-primary/5 border-primary/20">
            <div>
              <p className="font-semibold">Iceland Roadtrip</p>
              <p className="text-sm text-muted-foreground">Downloaded • 8.2 MB</p>
            </div>
            <span className="flex items-center text-sm font-medium text-primary"><CheckCircle2 className="w-4 h-4 mr-1" /> Saved</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineMode;
