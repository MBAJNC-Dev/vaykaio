
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart } from 'lucide-react';

const NFTMarketplacePage = () => {
  const listings = [
    { id: 1, name: 'Eiffel Tower Sunset', price: '0.05 ETH', creator: '0x123...abc', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=500&q=60' },
    { id: 2, name: 'Tokyo Neon Nights', price: '0.08 ETH', creator: '0x456...def', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=60' },
    { id: 3, name: 'Swiss Alps Retreat', price: '0.12 ETH', creator: '0x789...ghi', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=500&q=60' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <Helmet><title>NFT Marketplace</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Travel NFT Marketplace</h1>
          <p className="text-muted-foreground mt-1">Discover and collect unique travel experiences.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search collections..." className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map(item => (
          <Card key={item.id} className="overflow-hidden group card-hover">
            <div className="aspect-square bg-muted relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground">
                {item.price}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-muted-foreground truncate mt-1">by {item.creator}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full"><ShoppingCart className="w-4 h-4 mr-2"/> Buy Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NFTMarketplacePage;
