
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, ArrowRightLeft, Zap } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const BlockchainAnalyticsPage = () => {
  const [metrics, setMetrics] = useState({
    tvl: '$4.2M',
    volume24h: '$125K',
    activeUsers: '1,240',
    transactions: '8,492'
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>Blockchain Analytics</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Analytics</h1>
        <p className="text-muted-foreground mt-1">Real-time metrics for the TravelMatrix protocol.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Total Value Locked</p>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mt-2">{metrics.tvl}</h3>
            <p className="text-xs text-green-600 mt-1">+2.4% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
              <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mt-2">{metrics.volume24h}</h3>
            <p className="text-xs text-green-600 mt-1">+12.5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Active Wallets</p>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mt-2">{metrics.activeUsers}</h3>
            <p className="text-xs text-muted-foreground mt-1">Across all chains</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mt-2">{metrics.transactions}</h3>
            <p className="text-xs text-muted-foreground mt-1">Lifetime</p>
          </CardContent>
        </Card>
      </div>

      <Card className="h-96 flex items-center justify-center bg-muted/20 border-dashed">
        <p className="text-muted-foreground">Interactive charts will render here (Recharts integration)</p>
      </Card>
    </div>
  );
};

export default BlockchainAnalyticsPage;
