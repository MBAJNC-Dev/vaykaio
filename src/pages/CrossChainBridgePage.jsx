
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import Web3WalletConnection from '@/components/Web3WalletConnection.jsx';

const CrossChainBridgePage = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <Helmet><title>Cross-Chain Bridge</title></Helmet>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Bridge Assets</h1>
        <p className="text-muted-foreground mt-1">Transfer tokens securely between blockchains.</p>
      </div>

      <Web3WalletConnection />

      <Card>
        <CardHeader>
          <CardTitle>Bridge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">From Network</p>
              <Button variant="outline" className="w-full justify-start">Ethereum Mainnet</Button>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
            <div className="flex-1 w-full border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2">To Network</p>
              <Button variant="outline" className="w-full justify-start">Polygon</Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Amount to Bridge</p>
            <div className="flex gap-2">
              <Input type="number" placeholder="0.00" className="flex-1" />
              <Button variant="secondary">USDC</Button>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Bridge Fee</span><span>0.1%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Estimated Time</span><span>~5 minutes</span></div>
          </div>

          <Button className="w-full" size="lg">Bridge Assets</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossChainBridgePage;
