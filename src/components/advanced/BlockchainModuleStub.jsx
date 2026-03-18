
import React from 'react';
import { Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// TODO PHASE 2: Implement Web3/Blockchain integration.
// Add dependencies: ethers.js or wagmi.
// Features to build: NFT ticketing, decentralized identity (DID) profiles, crypto payments, DAO governance for community features.

const BlockchainModuleStub = () => {
  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
          <Link2 className="w-6 h-6 text-accent" />
        </div>
        <CardTitle>Web3 & Blockchain</CardTitle>
        <CardDescription>Decentralized identity and crypto payments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
          Coming Soon
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Secure your bookings as NFTs and pay with your favorite cryptocurrencies. Smart contract integration is currently in development.
        </p>
      </CardContent>
    </Card>
  );
};

export default BlockchainModuleStub;
