
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Server, Globe, Mail, CreditCard, HardDrive, RefreshCw, Trash2 } from 'lucide-react';

const AdminSystemHealth = () => {
  const metrics = [
    { name: 'Database', icon: Database, status: 'Operational', color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'API Server', icon: Server, status: 'Operational', color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Web Frontend', icon: Globe, status: 'Operational', color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Email Service', icon: Mail, status: 'Degraded', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Payment Gateway', icon: CreditCard, status: 'Operational', color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Storage', icon: HardDrive, status: '85% Full', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6">
      <Helmet><title>System Health | Admin Portal</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Monitor infrastructure and service status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Trash2 className="w-4 h-4 mr-2" /> Clear Cache</Button>
          <Button><RefreshCw className="w-4 h-4 mr-2" /> Restart Services</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-full ${metric.bg}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                <p className={`text-lg font-bold ${metric.color}`}>{metric.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Version</span><span className="font-medium">v2.4.1</span></div>
          <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Environment</span><span className="font-medium">Production</span></div>
          <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Node.js</span><span className="font-medium">v20.x</span></div>
          <div className="flex justify-between py-2"><span className="text-muted-foreground">Uptime</span><span className="font-medium">14 days, 6 hours</span></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemHealth;
