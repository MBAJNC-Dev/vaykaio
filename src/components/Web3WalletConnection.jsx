
import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, Loader2, Link as LinkIcon } from 'lucide-react';

const Web3WalletConnection = () => {
  const { address, balance, network, isConnecting, connectWallet, disconnectWallet } = useWeb3();

  if (address) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Connected Wallet</p>
              <p className="font-mono font-semibold">{address.slice(0, 6)}...{address.slice(-4)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-muted-foreground font-medium">Balance</p>
              <p className="font-semibold">{parseFloat(balance).toFixed(4)} ETH</p>
            </div>
            <Badge variant="outline" className="bg-background">
              {network?.name || 'Unknown Network'}
            </Badge>
            <Button variant="ghost" size="icon" onClick={disconnectWallet} title="Disconnect">
              <LogOut className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <LinkIcon className="h-5 w-5" /> Connect Web3 Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Button variant="outline" className="h-16 flex flex-col gap-2" onClick={() => connectWallet('metamask')} disabled={isConnecting}>
          {isConnecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-6 w-6" />}
          MetaMask
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-2" onClick={() => connectWallet('walletconnect')} disabled={isConnecting}>
          <Wallet className="h-5 w-5 text-blue-500" />
          WalletConnect
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-2" onClick={() => connectWallet('coinbase')} disabled={isConnecting}>
          <div className="h-5 w-5 rounded-full bg-blue-600" />
          Coinbase
        </Button>
      </CardContent>
    </Card>
  );
};

export default Web3WalletConnection;
