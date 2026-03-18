import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Search,
  MapPin,
  Star,
  Heart,
  Filter,
  Map as MapIcon,
  Grid3X3,
  Clock,
  DollarSign,
  Users,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock discovery data
const MOCK_DISCOVERIES = [
  {
    id: 1,
    name: 'The French Laundry',
    category: 'restaurants',
    image: 'https://images.unsplash.com/photo-1504674900769-7b8f50ad5307?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 2840,
    distance: 0.5,
    priceRange: '$$$$',
    description: 'Michelin-starred fine dining experience',
    hours: '11:30 AM - 9:00 PM',
  },
  {
    id: 2,
    name: 'Muir Woods National Monument',
    category: 'attractions',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    rating: 4.7,
    reviews: 4200,
    distance: 15,
    priceRange: '$',
    description: 'Ancient redwood forests with scenic trails',
    hours: 'Sunrise - Sunset',
  },
  {
    id: 3,
    name: 'Wine Country Tour',
    category: 'tours',
    image: 'https://images.unsplash.com/photo-1506377585622-bedcbb3b2fc3?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 1560,
    distance: 60,
    priceRange: '$$$',
    description: 'Guided tour of Napa Valley vineyards',
    hours: '9:00 AM - 5:00 PM',
  },
  {
    id: 4,
    name: 'Jazz at the Pearl',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 890,
    distance: 2,
    priceRange: '$$',
    description: 'Live jazz performances every evening',
    hours: '7:00 PM - 11:00 PM',
  },
  {
    id: 5,
    name: 'Cooking Class: Italian Basics',
    category: 'experiences',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    rating: 4.9,
    reviews: 320,
    distance: 3,
    priceRange: '$$',
    description: 'Learn authentic Italian cooking techniques',
    hours: '2:00 PM - 5:00 PM',
  },
  {
    id: 6,
    name: 'Marina Bay Area',
    category: 'attractions',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop',
    rating: 4.5,
    reviews: 3100,
    distance: 8,
    priceRange: '$',
    description: 'Beautiful waterfront with shops and restaurants',
    hours: 'Always open',
  },
];

const CATEGORIES = [
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
  { id: 'attractions', label: 'Attractions', icon: '🎭' },
  { id: 'tours', label: 'Tours', icon: '🚶' },
  { id: 'events', label: 'Events', icon: '🎵' },
  { id: 'experiences', label: 'Experiences', icon: '⭐' },
];

const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];

const DiscoveryPage = () => {
  const { tripId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedRating, setSelectedRating] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

  // Filter logic
  const filteredDiscoveries = useMemo(() => {
    return MOCK_DISCOVERIES.filter(item => {
      // Search filter
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) {
        return false;
      }

      // Price range filter
      if (selectedPriceRanges.length > 0 && !selectedPriceRanges.includes(item.priceRange)) {
        return false;
      }

      // Rating filter
      if (selectedRating !== 'all') {
        const minRating = parseFloat(selectedRating);
        if (item.rating < minRating) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategories, selectedPriceRanges, selectedRating]);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const toggleCategory = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newCategories);
  };

  const togglePriceRange = (priceRange) => {
    const newPrices = selectedPriceRanges.includes(priceRange)
      ? selectedPriceRanges.filter(p => p !== priceRange)
      : [...selectedPriceRanges, priceRange];
    setSelectedPriceRanges(newPrices);
  };

  return (
    <>
      <Helmet>
        <title>Discover | VaykAIo</title>
        <meta name="description" content="Discover restaurants, attractions, tours, and experiences." />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover</h1>
            <p className="text-muted-foreground">
              Find restaurants, attractions, tours, and experiences at your destination
            </p>
          </div>

          {/* AI Recommendation Button */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">What should we do now?</p>
                <p className="text-sm text-muted-foreground">
                  Let AI suggest activities based on your preferences
                </p>
              </div>
            </div>
            <Button className="whitespace-nowrap">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Suggestions
            </Button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Found {filteredDiscoveries.length} {filteredDiscoveries.length === 1 ? 'place' : 'places'}
            </div>
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-4 space-y-6 sticky top-20">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Category</p>
                {CATEGORIES.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <Checkbox
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                    />
                    <span className="text-sm">{cat.icon} {cat.label}</span>
                  </label>
                ))}
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Price Range</p>
                {PRICE_RANGES.map(range => (
                  <label key={range} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <Checkbox
                      checked={selectedPriceRanges.includes(range)}
                      onCheckedChange={() => togglePriceRange(range)}
                    />
                    <span className="text-sm">{range}</span>
                  </label>
                ))}
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Minimum Rating</p>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4.0">4.0+ ⭐</SelectItem>
                    <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                    <SelectItem value="4.8">4.8+ ⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {(selectedCategories.length > 0 || selectedPriceRanges.length > 0 || selectedRating !== 'all') && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedPriceRanges([]);
                    setSelectedRating('all');
                    setSearchQuery('');
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </div>

          {/* Results Grid/Map */}
          <div className="lg:col-span-3">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDiscoveries.length > 0 ? (
                  filteredDiscoveries.map(item => (
                    <Card key={item.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 group">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            <Heart
                              className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-white/90 text-black hover:bg-white">
                            {CATEGORIES.find(c => c.id === item.category)?.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent className="flex-1 pt-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{item.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({item.reviews} reviews)</span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{item.distance} km</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>{item.priceRange}</span>
                          </div>
                          <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="line-clamp-1">{item.hours}</span>
                          </div>
                        </div>
                      </CardContent>

                      {/* Action Buttons */}
                      <div className="px-4 pb-4 flex gap-2">
                        <Button variant="outline" className="flex-1">
                          Details
                        </Button>
                        <Button className="flex-1">
                          Add to Itinerary
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No places found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                  </div>
                )}
              </div>
            ) : (
              // Map View Placeholder
              <Card className="h-96 flex items-center justify-center bg-muted">
                <div className="text-center">
                  <MapIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive map view coming soon</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscoveryPage;
