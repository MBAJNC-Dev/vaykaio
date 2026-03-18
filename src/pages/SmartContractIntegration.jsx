
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Code2, Play, Box, FileJson } from 'lucide-react';
import Web3WalletConnection from '@/components/Web3WalletConnection.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const SmartContractIntegration = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    if (pb.authStore.isValid) {
      pb.collection('smart_contracts').getList(1, 10, {
        filter: `user_id = "${pb.authStore.model.id}"`,
        $autoCancel: false
      }).then(res => setContracts(res.items)).catch(console.error);
    }
  }, []);

  const handleDeploy = (e) => {
    e.preventDefault();
    toast.success('Contract deployment initiated (Simulated)');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>Smart Contracts - Web3</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Contracts</h1>
        <p className="text-muted-foreground mt-2">Deploy and interact with blockchain smart contracts.</p>
      </div>

      <Web3WalletConnection />

      <Tabs defaultValue="deploy" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
          <TabsTrigger value="interact">Interact</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Deploy New Contract</CardTitle>
              <CardDescription>Compile and deploy Solidity contracts to the network.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeploy} className="space-y-4">
                <div className="space-y-2">
                  <Label>Contract Name</Label>
                  <Input placeholder="e.g., MyToken" required />
                </div>
                <div className="space-y-2">
                  <Label>Source Code (Solidity)</Label>
                  <Textarea placeholder="pragma solidity ^0.8.0; ..." className="font-mono h-48" required />
                </div>
                <div className="space-y-2">
                  <Label>Constructor Arguments (JSON array)</Label>
                  <Input placeholder='["Arg1", 1000]' />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2" /> Deploy Contract
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Interact with Contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Contract Address</Label>
                <Input placeholder="0x..." />
              </div>
              <div className="space-y-2">
                <Label>ABI (JSON)</Label>
                <Textarea placeholder='[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"}]' className="font-mono h-32" />
              </div>
              <Button variant="secondary"><FileJson className="w-4 h-4 mr-2" /> Load Interface</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.length === 0 ? (
              <Card className="md:col-span-2 bg-muted/50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Code2 className="w-8 h-8 mb-2 opacity-50" />
                  <p>No contracts deployed yet</p>
                </CardContent>
              </Card>
            ) : (
              contracts.map(contract => (
                <Card key={contract.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Box className="w-4 h-4 text-primary" /> {contract.contract_name || 'Unnamed Contract'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-mono text-muted-foreground break-all">{contract.contract_address}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">View on Explorer</Button>
                      <Button size="sm">Interact</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartContractIntegration;
