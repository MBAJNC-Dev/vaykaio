
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Smartphone } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const RFPNotificationsPage = () => {
  const [settings, setSettings] = useState({
    response_received: true,
    deadline_approaching: true,
    follow_up_reminder: false,
    quote_expiration: true
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preferences updated');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>RFP Notifications | TravelMatrix</title></Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
        <p className="text-muted-foreground mt-1">Manage how and when you receive RFP updates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Email Alerts</CardTitle>
          <CardDescription>Configure which events trigger an email notification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">New Response Received</Label>
              <p className="text-sm text-muted-foreground">Get notified when a property submits a quote.</p>
            </div>
            <Switch checked={settings.response_received} onCheckedChange={() => handleToggle('response_received')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Deadline Approaching</Label>
              <p className="text-sm text-muted-foreground">Alert 24 hours before your requested response deadline.</p>
            </div>
            <Switch checked={settings.deadline_approaching} onCheckedChange={() => handleToggle('deadline_approaching')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Follow-up Reminders</Label>
              <p className="text-sm text-muted-foreground">Remind me to follow up on pending RFPs after 3 days.</p>
            </div>
            <Switch checked={settings.follow_up_reminder} onCheckedChange={() => handleToggle('follow_up_reminder')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Quote Expiration</Label>
              <p className="text-sm text-muted-foreground">Alert when a received quote is about to expire.</p>
            </div>
            <Switch checked={settings.quote_expiration} onCheckedChange={() => handleToggle('quote_expiration')} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RFPNotificationsPage;
