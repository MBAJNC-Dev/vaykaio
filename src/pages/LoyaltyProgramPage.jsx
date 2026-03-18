
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, Star, Plane, Coffee, Gift } from 'lucide-react';

const LoyaltyProgramPage = () => {
  return (
    <>
      <Helmet><title>VaykAIo Rewards - Loyalty Program</title></Helmet>
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-center bg-card rounded-3xl p-8 shadow-lg border ring-1 ring-primary/10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-inner shrink-0">
            <Crown className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <Badge className="bg-amber-500 hover:bg-amber-600 border-0 mb-2">Gold Tier</Badge>
              <h1 className="text-3xl font-bold tracking-tight">You have 2,450 Points</h1>
              <p className="text-muted-foreground mt-1">Earn points by planning trips, adding reviews, and inviting friends.</p>
            </div>
            
            <div className="space-y-2 max-w-md mx-auto md:mx-0">
              <div className="flex justify-between text-sm font-medium">
                <span>Gold</span>
                <span className="text-muted-foreground">550 pts to Platinum</span>
              </div>
              <Progress value={80} className="h-2 bg-muted" indicatorClassName="bg-amber-500" />
            </div>
          </div>
          <div className="shrink-0">
            <Button size="lg" className="rounded-full px-8 shadow-md">Redeem Points</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Plane className="w-5 h-5 text-primary"/> Plan Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Earn 100 points for every completed trip itinerary.</p>
              <Button variant="outline" className="w-full">Create Trip</Button>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Star className="w-5 h-5 text-amber-500"/> Review Places</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Earn 25 points for reviewing restaurants and activities.</p>
              <Button variant="outline" className="w-full">Write Review</Button>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Gift className="w-5 h-5 text-green-500"/> Refer Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Earn 500 points when a friend joins via your link.</p>
              <Button variant="outline" className="w-full">Invite Friends</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Points History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Oct 15, 2025</TableCell>
                  <TableCell>Completed "Paris Getaway" Trip</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">+100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Oct 12, 2025</TableCell>
                  <TableCell>Redeemed for $5 App Credit</TableCell>
                  <TableCell className="text-right text-destructive font-medium">-500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Oct 10, 2025</TableCell>
                  <TableCell>Reviewed "Le Jules Verne"</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">+25</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </>
  );
};

export default LoyaltyProgramPage;
