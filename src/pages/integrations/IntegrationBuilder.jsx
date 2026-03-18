
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, Webhook } from 'lucide-react';

const IntegrationBuilder = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Custom Integrations | Admin</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Integration Builder</h1>
        <p className="text-muted-foreground mt-2">Create custom webhooks and API connections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-dashed border-2 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[250px] text-center p-6">
          <Webhook className="w-10 h-10 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">New Webhook</CardTitle>
          <CardDescription>Listen to events in real-time.</CardDescription>
        </Card>
        
        <Card className="border-dashed border-2 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[250px] text-center p-6">
          <Code2 className="w-10 h-10 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Custom API App</CardTitle>
          <CardDescription>Build a private OAuth application.</CardDescription>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationBuilder;
