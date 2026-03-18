
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Copy, Users } from 'lucide-react';

const ReferralProgram = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Refer & Earn | Vacation Planner</title></Helmet>
      
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Invite Friends, Earn Travel Credit</h1>
        <p className="text-lg text-muted-foreground mt-4">Give your friends $20 off their first premium booking, and get $20 when they travel.</p>
      </div>

      <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/50">
        <CardHeader className="text-center">
          <CardTitle>Your Unique Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="max-w-md mx-auto space-y-6">
          <div className="flex gap-2">
            <Input readOnly value="https://vacationplanner.com/ref/maya2023" className="bg-background font-mono text-center text-lg h-12" />
            <Button className="h-12 px-6"><Copy className="w-4 h-4 mr-2" /> Copy</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">3</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Friends Joined</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">$60</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Credit Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralProgram;
