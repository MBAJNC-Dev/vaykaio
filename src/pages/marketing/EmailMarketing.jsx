
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

const EmailMarketing = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Email Preferences | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Email Preferences</h1>
        <p className="text-muted-foreground mt-2">Manage what we send to your inbox.</p>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Weekly Newsletter</Label>
              <p className="text-sm text-muted-foreground">Travel tips, destination guides, and community highlights.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Promotions & Offers</Label>
              <p className="text-sm text-muted-foreground">Exclusive discounts and partner deals.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailMarketing;
