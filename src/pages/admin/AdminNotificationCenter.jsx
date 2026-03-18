
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AdminNotificationCenter = () => {
  const notifications = [
    { id: 1, title: 'System Update Complete', message: 'Version 2.4.1 deployed successfully.', type: 'success', time: '2 hours ago' },
    { id: 2, title: 'High API Usage', message: 'OpenAI API quota is at 85%.', type: 'warning', time: '5 hours ago' },
    { id: 3, title: 'New Admin Login', message: 'Login from new IP address detected.', type: 'info', time: '1 day ago' },
  ];

  const getIcon = (type) => {
    if (type === 'success') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (type === 'warning') return <AlertCircle className="w-5 h-5 text-amber-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Helmet><title>Notification Center | Admin</title></Helmet>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-muted-foreground">System alerts and administrative messages.</p>
        </div>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Recent Alerts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className="flex items-start gap-4 p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
              <div className="mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notif.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationCenter;
