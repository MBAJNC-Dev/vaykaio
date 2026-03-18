
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Wallet, PieChart } from 'lucide-react';
import Web3WalletConnection from '@/components/Web3WalletConnection.jsx';
import pb from '@/lib/pocketbaseClient';

const CryptoPortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    if (pb.authStore.isValid) {
      pb.collection('crypto_portfolios').getFirstListItem(`user_id="${pb.authStore.model.id}"`, {
        $autoCancel: false
      }).then(setPortfolio).catch(() => {
        // Mock data if none exists
        setPortfolio({ total_balance_usd: 12450.75, total_balance_crypto: 4.2 });
      });
    }
  }, []);

  const assets = [
    { symbol: 'ETH', name: 'Ethereum', balance: '2.5', value: 8750.00, change: 5.2 },
    { symbol: 'USDC', name: 'USD Coin', balance: '2500', value: 2500.00, change: 0.01 },
    { symbol: 'MATIC', name: 'Polygon', balance: '1500', value: 1200.75, change: -2.4 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>Crypto Portfolio</title></Helmet>
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Overview</h1>
          <p className="text-muted-foreground mt-1">Track your crypto assets across all connected networks.</p>
        </div>
      </div>

      <Web3WalletConnection />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-primary text-primary-foreground">
          <CardContent className="p-8">
            <p className="text-primary-foreground/80 font-medium mb-2">Total Balance</p>
            <h2 className="text-5xl font-bold tracking-tight">${portfolio?.total_balance_usd?.toLocaleString() || '0.00'}</h2>
            <div className="mt-6 flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +$450.20 (24h)
              </Badge>
              <span className="text-sm text-primary-foreground/80">≈ {portfolio?.total_balance_crypto || '0'} ETH</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PieChart className="w-4 h-4" /> Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {assets.map(asset => (
                <div key={asset.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium">{asset.symbol}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((asset.value / 12450.75) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Value (USD)</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.symbol}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{asset.balance}</TableCell>
                  <TableCell className="text-right">${asset.value.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <span className={`flex items-center justify-end text-sm ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1"/> : <ArrowDownRight className="w-3 h-3 mr-1"/>}
                      {Math.abs(asset.change)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoPortfolioPage;
