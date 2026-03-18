
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Plane, CloudRain, Tag } from 'lucide-react';

const PushNotifications = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Notifications | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Notification Preferences</h1>
        <p className="text-muted-foreground mt-2">Control how and when we contact you.</p>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Flight Alerts</Label>
              <p className="text-sm text-muted-foreground">Delays, gate changes, and check-in reminders.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Weather Warnings</Label>
              <p className="text-sm text-muted-foreground">Severe weather alerts for your destination.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Price Drops</Label>
              <p className="text-sm text-muted-foreground">Alerts when saved trips drop in price.</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PushNotifications;
