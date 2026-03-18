
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePlus, Sparkles, Upload } from 'lucide-react';
import Web3WalletConnection from '@/components/Web3WalletConnection.jsx';
import { toast } from 'sonner';

const NFTMintingPage = () => {
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = (e) => {
    e.preventDefault();
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      toast.success('NFT Minted Successfully! View it in your gallery.');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>Mint NFT - Web3</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mint Travel Memory NFT</h1>
        <p className="text-muted-foreground mt-2">Turn your favorite travel moments into verifiable digital collectibles.</p>
      </div>

      <Web3WalletConnection />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>NFT Details</CardTitle>
            <CardDescription>Provide metadata for your new token.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMint} className="space-y-6">
              <div className="space-y-2">
                <Label>Asset Name</Label>
                <Input placeholder="e.g., Sunset in Santorini" required />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe this memory..." required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Collection</Label>
                  <Select defaultValue="travel_2026">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel_2026">Travel Memories 2026</SelectItem>
                      <SelectItem value="achievements">Travel Achievements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Blockchain</Label>
                  <Select defaultValue="polygon">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="polygon">Polygon (Low Fees)</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isMinting}>
                {isMinting ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-2" />}
                {isMinting ? 'Minting to Blockchain...' : 'Mint NFT'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer aspect-square">
              <div className="p-4 bg-background rounded-full shadow-sm">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF up to 10MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NFTMintingPage;
