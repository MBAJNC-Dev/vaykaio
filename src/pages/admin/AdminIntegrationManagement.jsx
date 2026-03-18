
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Blocks, Settings } from 'lucide-react';

const AdminIntegrationManagement = () => {
  const integrations = [
    { name: 'Stripe', category: 'Payments', status: 'connected', desc: 'Payment processing and subscriptions.' },
    { name: 'SendGrid', category: 'Email', status: 'connected', desc: 'Transactional and marketing emails.' },
    { name: 'OpenAI', category: 'AI Services', status: 'connected', desc: 'LLM provider for itinerary generation.' },
    { name: 'Google Maps', category: 'Maps', status: 'disconnected', desc: 'Places API and routing.' },
  ];

  return (
    <div className="space-y-6">
      <Helmet><title>Integrations | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Manage third-party service connections.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((int, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary/10 rounded-lg"><Blocks className="w-6 h-6 text-primary" /></div>
                <Badge variant={int.status === 'connected' ? 'default' : 'secondary'} className={int.status === 'connected' ? 'bg-green-500 hover:bg-green-600' : ''}>
                  {int.status}
                </Badge>
              </div>
              <CardTitle className="mt-4">{int.name}</CardTitle>
              <CardDescription>{int.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground mb-4">{int.desc}</p>
              <Button variant="outline" className="w-full"><Settings className="w-4 h-4 mr-2" /> Configure</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminIntegrationManagement;
