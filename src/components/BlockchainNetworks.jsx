
import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

const NETWORKS = [
  { id: '1', name: 'Ethereum Mainnet', type: 'mainnet' },
  { id: '137', name: 'Polygon', type: 'mainnet' },
  { id: '56', name: 'BNB Smart Chain', type: 'mainnet' },
  { id: '42161', name: 'Arbitrum One', type: 'L2' },
  { id: '10', name: 'Optimism', type: 'L2' },
  { id: '11155111', name: 'Sepolia Testnet', type: 'testnet' },
];

const BlockchainNetworks = () => {
  const { network } = useWeb3();
  const currentChainId = network?.chainId?.toString() || '1';

  const handleNetworkSwitch = async (chainId) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch network', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Activity className="h-4 w-4 text-muted-foreground" />
      <Select value={currentChainId} onValueChange={handleNetworkSwitch}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Network" />
        </SelectTrigger>
        <SelectContent>
          {NETWORKS.map((net) => (
            <SelectItem key={net.id} value={net.id}>
              <div className="flex items-center justify-between w-full gap-2">
                <span>{net.name}</span>
                <Badge variant="secondary" className="text-[10px] px-1 py-0">{net.type}</Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Connected
      </div>
    </div>
  );
};

export default BlockchainNetworks;
