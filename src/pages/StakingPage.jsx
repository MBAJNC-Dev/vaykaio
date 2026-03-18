
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, TrendingUp, Lock } from 'lucide-react';
import Web3WalletConnection from '@/components/Web3WalletConnection.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const StakingPage = () => {
  const [amount, setAmount] = useState('');

  const handleStake = (e) => {
    e.preventDefault();
    toast.success(`Successfully staked ${amount} tokens!`);
    setAmount('');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>Staking & Yield</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staking & Yield</h1>
        <p className="text-muted-foreground mt-1">Earn rewards by locking your tokens to secure the network.</p>
      </div>

      <Web3WalletConnection />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Stake TRV Tokens</CardTitle>
            <CardDescription>Lock tokens to earn up to 12.5% APY</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStake} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Amount to Stake</Label>
                  <span className="text-sm text-muted-foreground">Balance: 1,500 TRV</span>
                </div>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16"
                    required
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1 h-8" onClick={() => setAmount('1500')}>
                    MAX
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors bg-primary/5 border-primary">
                  <p className="font-bold">30 Days</p>
                  <p className="text-sm text-muted-foreground">5% APY</p>
                </div>
                <div className="border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                  <p className="font-bold">90 Days</p>
                  <p className="text-sm text-muted-foreground">8% APY</p>
                </div>
                <div className="border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                  <p className="font-bold">365 Days</p>
                  <p className="text-sm text-muted-foreground">12.5% APY</p>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Lock className="w-4 h-4 mr-2" /> Stake Tokens
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <p className="text-primary-foreground/80 text-sm font-medium">Total Staked</p>
              <h3 className="text-3xl font-bold mt-1">0.00 TRV</h3>
              <div className="mt-4 pt-4 border-t border-primary-foreground/20">
                <p className="text-primary-foreground/80 text-sm font-medium">Pending Rewards</p>
                <div className="flex justify-between items-end mt-1">
                  <h3 className="text-2xl font-bold">0.00 TRV</h3>
                  <Button size="sm" variant="secondary" className="bg-white text-primary hover:bg-white/90">Claim</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
