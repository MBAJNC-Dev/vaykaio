
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ExternalLink, CreditCard, Mail, MessageSquare, Users, BarChart, Megaphone, Share2, Cloud, LayoutList, Code } from 'lucide-react';

const IntegrationsPage = () => {
  const [filter, setFilter] = useState('All');

  const categories = [
    { name: 'All', icon: LayoutList },
    { name: 'Payments', icon: CreditCard },
    { name: 'Email', icon: Mail },
    { name: 'SMS/Comms', icon: MessageSquare },
    { name: 'CRM', icon: Users },
    { name: 'Analytics', icon: BarChart },
    { name: 'Marketing', icon: Megaphone },
    { name: 'Social', icon: Share2 },
    { name: 'Cloud Storage', icon: Cloud },
    { name: 'Dev Tools', icon: Code },
  ];

  const integrations = [
    { name: 'Stripe', category: 'Payments', status: 'Active', desc: 'Process payments and subscriptions securely.' },
    { name: 'PayPal', category: 'Payments', status: 'Planned', desc: 'Accept global payments via PayPal.' },
    { name: 'Mailchimp', category: 'Email', status: 'Active', desc: 'Sync contacts and send automated campaigns.' },
    { name: 'SendGrid', category: 'Email', status: 'Active', desc: 'Reliable transactional email delivery.' },
    { name: 'Twilio', category: 'SMS/Comms', status: 'Planned', desc: 'Send SMS alerts for itinerary updates.' },
    { name: 'Salesforce', category: 'CRM', status: 'Planned', desc: 'Enterprise customer relationship management.' },
    { name: 'HubSpot', category: 'CRM', status: 'Active', desc: 'Inbound marketing and sales software.' },
    { name: 'Google Analytics', category: 'Analytics', status: 'Active', desc: 'Track user behavior and conversions.' },
    { name: 'Mixpanel', category: 'Analytics', status: 'Planned', desc: 'Advanced product analytics.' },
    { name: 'AWS S3', category: 'Cloud Storage', status: 'Active', desc: 'Secure document and photo storage.' },
    { name: 'GitHub', category: 'Dev Tools', status: 'Active', desc: 'Connect repositories for custom workflows.' },
  ];

  const filteredIntegrations = filter === 'All' 
    ? integrations 
    : integrations.filter(i => i.category === filter);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>Integrations | VaykAIo</title>
      </Helmet>

      <section className="bg-muted/30 border-b py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="mb-6">Connect your favorite tools</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            VaykAIo integrates seamlessly with the software you already use to run your business and manage your travels.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search integrations..." className="pl-12 h-12" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="flex flex-col gap-1">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setFilter(cat.name)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat.name ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration, idx) => (
              <Card key={idx} className="card-hover border-border/50 flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-lg">
                      {integration.name.charAt(0)}
                    </div>
                    <Badge variant={integration.status === 'Active' ? 'default' : 'secondary'}>
                      {integration.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                  <CardDescription className="text-sm">{integration.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground mb-6">{integration.desc}</p>
                  <a href="#" className="text-sm font-medium text-primary flex items-center hover:underline">
                    View Documentation <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default IntegrationsPage;
