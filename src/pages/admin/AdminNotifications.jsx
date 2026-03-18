
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

const AdminNotifications = () => {
  const alerts = [
    { id: 1, type: 'warning', title: 'High API Latency', message: 'OpenAI API response times are exceeding 5 seconds.', time: '10 mins ago' },
    { id: 2, type: 'info', title: 'New Enterprise Signup', message: 'Acme Corp has registered for an Enterprise plan.', time: '1 hour ago' },
    { id: 3, type: 'success', title: 'Database Backup Complete', message: 'Daily automated backup finished successfully.', time: '3 hours ago' },
  ];

  const getIcon = (type) => {
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    if (type === 'success') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Helmet><title>Alerts | Admin Portal</title></Helmet>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
          <p className="text-muted-foreground">Important notifications requiring admin attention.</p>
        </div>
        <Button variant="outline">Mark All Read</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Alerts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/20">
              <div className="mt-0.5">{getIcon(alert.type)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{alert.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
