
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Utensils, Camera, BookOpen, Calendar, Clock, Star } from 'lucide-react';

const AdvancedSearchPage = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  // Mock search results
  const results = [
    { id: 1, type: 'restaurant', title: 'Le Jules Verne', subtitle: 'French Cuisine • $$$$', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-100' },
    { id: 2, type: 'activity', title: 'Eiffel Tower Summit', subtitle: 'Culture • 2 hours', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 3, type: 'photo', title: 'Sunset at the Seine', subtitle: 'Album: Paris Day 2', icon: Camera, color: 'text-pink-500', bg: 'bg-pink-100' },
    { id: 4, type: 'journal', title: 'The best croissant ever', subtitle: 'Journal Entry • May 14', icon: BookOpen, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  const filteredResults = activeFilter === 'all' ? results : results.filter(r => r.type === activeFilter);

  return (
    <>
      <Helmet><title>Global Search - VaykAIo</title></Helmet>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Find anything in your trips</h1>
          <p className="text-lg text-muted-foreground">Search across itineraries, expenses, photos, and journals.</p>
        </div>

        <Card className="shadow-lg border-primary/20 overflow-hidden">
          <CardContent className="p-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for 'Paris', 'Dinner', or 'Eiffel Tower'..." 
                  className="h-14 pl-12 text-lg border-0 focus-visible:ring-0 bg-transparent"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8 rounded-xl" disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant={activeFilter === 'all' ? 'default' : 'outline'} onClick={() => setActiveFilter('all')} className="rounded-full">All Results</Button>
          <Button variant={activeFilter === 'activity' ? 'default' : 'outline'} onClick={() => setActiveFilter('activity')} className="rounded-full"><MapPin className="w-4 h-4 mr-2"/> Activities</Button>
          <Button variant={activeFilter === 'restaurant' ? 'default' : 'outline'} onClick={() => setActiveFilter('restaurant')} className="rounded-full"><Utensils className="w-4 h-4 mr-2"/> Restaurants</Button>
          <Button variant={activeFilter === 'photo' ? 'default' : 'outline'} onClick={() => setActiveFilter('photo')} className="rounded-full"><Camera className="w-4 h-4 mr-2"/> Photos</Button>
          <Button variant={activeFilter === 'journal' ? 'default' : 'outline'} onClick={() => setActiveFilter('journal')} className="rounded-full"><BookOpen className="w-4 h-4 mr-2"/> Journals</Button>
          <Button variant="ghost" className="rounded-full text-muted-foreground"><Filter className="w-4 h-4 mr-2"/> More Filters</Button>
        </div>

        {query && !isSearching && (
          <div className="space-y-4 animate-fade-in mt-8">
            <h3 className="font-semibold text-muted-foreground px-2">Results for "{query}"</h3>
            {filteredResults.map((result) => {
              const Icon = result.icon;
              return (
                <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.bg} ${result.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{result.title}</h4>
                      <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star className="w-5 h-5 text-muted-foreground hover:text-yellow-500" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdvancedSearchPage;
