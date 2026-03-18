
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDownUp, Settings2 } from 'lucide-react';
import Web3WalletConnection from '@/components/Web3WalletConnection.jsx';

const CryptoSwapPage = () => {
  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-8">
      <Helmet><title>Swap Tokens</title></Helmet>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Swap Tokens</h1>
        <p className="text-muted-foreground mt-1">Instantly trade tokens across networks.</p>
      </div>

      <Web3WalletConnection />

      <Card className="shadow-lg border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Swap</CardTitle>
          <Button variant="ghost" size="icon"><Settings2 className="w-4 h-4" /></Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="bg-muted/50 p-4 rounded-xl border">
            <p className="text-sm text-muted-foreground mb-2">You pay</p>
            <div className="flex gap-2">
              <Input type="number" placeholder="0.0" className="text-2xl font-semibold bg-transparent border-0 px-0 focus-visible:ring-0" />
              <Button variant="secondary" className="shrink-0">ETH</Button>
            </div>
          </div>
          
          <div className="flex justify-center -my-3 relative z-10">
            <Button variant="outline" size="icon" className="rounded-full bg-background shadow-sm border-muted-foreground/20">
              <ArrowDownUp className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border">
            <p className="text-sm text-muted-foreground mb-2">You receive</p>
            <div className="flex gap-2">
              <Input type="number" placeholder="0.0" className="text-2xl font-semibold bg-transparent border-0 px-0 focus-visible:ring-0" readOnly />
              <Button variant="secondary" className="shrink-0">USDC</Button>
            </div>
          </div>

          <Button className="w-full mt-4" size="lg">Review Swap</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoSwapPage;
