
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gift, Copy, CheckCircle2, Share2, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const ReferralProgramPage = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://vaykaio.com/invite/ref_8x9a2b";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet><title>Refer a Friend - VaykAIo</title></Helmet>
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-primary/20">
          <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Gift className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Give $10, Get $10</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Invite your friends to VaykAIo. They get $10 off their first month of Pro, and you get $10 in credit when they subscribe.
          </p>
          
          <div className="max-w-md mx-auto bg-background p-2 rounded-xl shadow-sm flex items-center gap-2 border">
            <Input value={referralLink} readOnly className="border-0 focus-visible:ring-0 bg-transparent font-mono text-sm" />
            <Button onClick={handleCopy} className="shrink-0">
              {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                <h3 className="text-2xl font-bold">3</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Earned Credit</p>
                <h3 className="text-2xl font-bold">$30.00</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Credit</p>
                <h3 className="text-2xl font-bold">$10.00</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>Track the status of your invites.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Friend</TableHead>
                  <TableHead>Date Invited</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">alex@example.com</TableCell>
                  <TableCell>Oct 12, 2025</TableCell>
                  <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge></TableCell>
                  <TableCell className="text-right text-green-600 font-medium">+$10.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">sarah.j@example.com</TableCell>
                  <TableCell>Oct 15, 2025</TableCell>
                  <TableCell><Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge></TableCell>
                  <TableCell className="text-right text-muted-foreground font-medium">--</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </>
  );
};

export default ReferralProgramPage;
