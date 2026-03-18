
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Send, Tag } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const NFTGalleryPage = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (pb.authStore.isValid) {
      pb.collection('nfts').getList(1, 20, {
        filter: `user_id = "${pb.authStore.model.id}"`,
        $autoCancel: false
      }).then(res => setNfts(res.items)).catch(console.error);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>My NFT Gallery</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Collection</h1>
          <p className="text-muted-foreground mt-1">Manage your digital assets and travel memories.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search NFTs..." className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No NFTs found in your wallet.</p>
            <Button variant="link" className="mt-2">Mint your first NFT</Button>
          </div>
        ) : (
          nfts.map(nft => (
            <Card key={nft.id} className="overflow-hidden group card-hover">
              <div className="aspect-square bg-muted relative">
                {nft.image_url ? (
                  <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                )}
                <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                  {nft.blockchain || 'Polygon'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{nft.name || 'Unnamed NFT'}</h3>
                <p className="text-sm text-muted-foreground truncate mt-1">{nft.description || 'No description'}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="outline" className="w-full" size="sm"><Send className="w-3 h-3 mr-2"/> Transfer</Button>
                <Button className="w-full" size="sm"><Tag className="w-3 h-3 mr-2"/> Sell</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NFTGalleryPage;
