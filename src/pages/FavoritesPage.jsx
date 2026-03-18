import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Heart,
  Share2,
  MoreHorizontal,
  Plus,
  Trash2,
  MapPin,
  Star,
  FolderPlus,
  Copy,
  LogIn,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Mock favorite data
const MOCK_FAVORITES = {
  restaurants: [
    {
      id: 1,
      name: 'The French Laundry',
      category: 'Fine Dining',
      rating: 4.9,
      location: 'Yountville, CA',
      priceRange: '$$$$',
      image: 'https://images.unsplash.com/photo-1504674900769-7b8f50ad5307?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Chez Panisse',
      category: 'Farm-to-Table',
      rating: 4.7,
      location: 'Berkeley, CA',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1517248135467-4d71bcdd2085?w=200&h=200&fit=crop',
    },
  ],
  attractions: [
    {
      id: 3,
      name: 'Golden Gate Bridge',
      category: 'Landmark',
      rating: 4.8,
      location: 'San Francisco, CA',
      priceRange: 'Free',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop',
    },
    {
      id: 4,
      name: 'Alcatraz Island',
      category: 'Historical Site',
      rating: 4.6,
      location: 'San Francisco, CA',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    },
  ],
  experiences: [
    {
      id: 5,
      name: 'Wine Tasting Tour',
      category: 'Food & Wine',
      rating: 4.9,
      location: 'Napa Valley, CA',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1506377585622-bedcbb3b2fc3?w=200&h=200&fit=crop',
    },
  ],
};

const CATEGORIES = [
  { id: 'all', label: 'All Favorites', icon: '❤️' },
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️', count: 2 },
  { id: 'attractions', label: 'Attractions', icon: '🎭', count: 2 },
  { id: 'experiences', label: 'Experiences', icon: '⭐', count: 1 },
];

const CUSTOM_LISTS = [
  { id: 1, name: 'Must Visit', color: 'bg-red-500/10 text-red-700 border-red-500/20', count: 5 },
  { id: 2, name: 'Budget Friendly', color: 'bg-green-500/10 text-green-700 border-green-500/20', count: 3 },
];

const FavoritesPage = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showNewListDialog, setShowNewListDialog] = useState(false);
  const [newListName, setNewListName] = useState('');

  const currentFavorites = selectedTab === 'all'
    ? Object.values(MOCK_FAVORITES).flat()
    : MOCK_FAVORITES[selectedTab] || [];

  const handleAddToItinerary = (favorite) => {
    toast.success(`Added "${favorite.name}" to your itinerary!`);
  };

  const handleShare = (favorite) => {
    const text = `Check out ${favorite.name} - ${favorite.location}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleRemoveFavorite = (favoriteId) => {
    toast.success('Removed from favorites');
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      toast.success(`Created list "${newListName}"`);
      setNewListName('');
      setShowNewListDialog(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Favorites | VaykAIo</title>
        <meta name="description" content="Your saved favorite places and experiences." />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Favorites</h1>
          <p className="text-muted-foreground">
            Saved places and experiences you love
          </p>
        </div>

        {/* Custom Lists Section */}
        {CUSTOM_LISTS.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Lists</h2>
              <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New List
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new list</DialogTitle>
                    <DialogDescription>
                      Organize your favorites into custom lists
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="List name..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateList();
                        }
                      }}
                    />
                    <Button onClick={handleCreateList} className="w-full">
                      Create List
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CUSTOM_LISTS.map(list => (
                <Card
                  key={list.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className={list.color}>{list.count} items</Badge>
                        <h3 className="font-semibold text-lg mt-2">{list.name}</h3>
                      </div>
                      <div className="text-3xl">📋</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Categories */}
        <div>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              {CATEGORIES.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm">
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline ml-1">{cat.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Favorites Grid */}
            {CATEGORIES.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-6">
                {currentFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentFavorites.map(favorite => (
                      <Card
                        key={favorite.id}
                        className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 group"
                      >
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden bg-muted">
                          <img
                            src={favorite.image}
                            alt={favorite.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                          <Badge className="absolute top-2 left-2 bg-white/90 text-black hover:bg-white">
                            {favorite.category}
                          </Badge>
                        </div>

                        {/* Content */}
                        <CardContent className="flex-1 pt-4 space-y-2">
                          <div>
                            <h3 className="font-semibold text-lg line-clamp-1">
                              {favorite.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{favorite.location}</span>
                            </div>
                          </div>

                          {/* Rating & Price */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{favorite.rating}</span>
                            </div>
                            <Badge variant="outline">{favorite.priceRange}</Badge>
                          </div>
                        </CardContent>

                        {/* Action Buttons */}
                        <div className="px-4 pb-4 space-y-2">
                          <Button
                            className="w-full"
                            onClick={() => handleAddToItinerary(favorite)}
                          >
                            Add to Itinerary
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              size="sm"
                              onClick={() => handleShare(favorite)}
                            >
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy link
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <LogIn className="w-4 h-4 mr-2" />
                                  Add to list
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleRemoveFavorite(favorite.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Heart icon places to save them to your favorites
                    </p>
                    <Button asChild>
                      <a href="/discover">Discover Places</a>
                    </Button>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Share List Section */}
        {currentFavorites.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Share with trip members</h3>
                  <p className="text-sm text-muted-foreground">
                    Let others see your favorite picks
                  </p>
                </div>
                <Button className="whitespace-nowrap">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share List
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default FavoritesPage;
