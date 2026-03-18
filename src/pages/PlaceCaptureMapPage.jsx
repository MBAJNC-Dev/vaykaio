
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Map as MapIcon, List, MapPin, Star, Navigation, Coffee, Utensils, ShoppingBag, Camera } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const PlaceCaptureMapPage = () => {
  const { tripId } = useParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const records = await pb.collection('places').getList(1, 100, {
          filter: `trip_id="${tripId}"`,
          sort: '-created',
          $autoCancel: false
        });
        setPlaces(records.items);
      } catch (error) {
        toast.error('Failed to load captured places');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [tripId]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'restaurant': return <Utensils className="w-4 h-4" />;
      case 'cafe': return <Coffee className="w-4 h-4" />;
      case 'shop': return <ShoppingBag className="w-4 h-4" />;
      case 'attraction': return <Camera className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'restaurant': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cafe': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'shop': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'attraction': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredPlaces = activeCategory === 'all' ? places : places.filter(p => p.category === activeCategory);

  return (
    <>
      <Helmet><title>Captured Places - VaykAIo</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-6 h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" /> Captured Places
            </h1>
            <p className="text-muted-foreground mt-1">Your personal map of discovered gems.</p>
          </div>
          <div className="flex gap-2 bg-muted p-1 rounded-lg">
            <Button variant="secondary" size="sm" className="shadow-sm"><MapIcon className="w-4 h-4 mr-2" /> Map</Button>
            <Button variant="ghost" size="sm" asChild><Link to={`/trip/${tripId}/places/list`}><List className="w-4 h-4 mr-2" /> List</Link></Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar flex-shrink-0">
          <Badge 
            variant={activeCategory === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer px-4 py-1.5 text-sm"
            onClick={() => setActiveCategory('all')}
          >
            All Places
          </Badge>
          {['restaurant', 'cafe', 'attraction', 'shop', 'hotel'].map(cat => (
            <Badge 
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'} 
              className="cursor-pointer px-4 py-1.5 text-sm capitalize"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Map Area (Mocked for visual representation) */}
          <Card className="lg:col-span-2 overflow-hidden relative border-2">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay z-0" />
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 z-0 flex items-center justify-center">
              {/* Mock Map Background */}
              <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.2) 0%, transparent 60%)' }} />
              
              {/* Mock Map Pins */}
              {filteredPlaces.map((place, i) => (
                <div 
                  key={place.id} 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{ 
                    left: `${20 + (i * 15) % 60}%`, 
                    top: `${20 + (i * 25) % 60}%` 
                  }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${getCategoryColor(place.category).split(' ')[0]} ${getCategoryColor(place.category).split(' ')[1]}`}>
                    {getCategoryIcon(place.category)}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-background px-3 py-1.5 rounded-lg shadow-xl border text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    {place.name}
                  </div>
                </div>
              ))}
              
              {filteredPlaces.length === 0 && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mb-4 opacity-20" />
                  <p>No places captured yet.</p>
                </div>
              )}
            </div>
            
            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <Button size="icon" variant="secondary" className="shadow-md"><Navigation className="w-4 h-4" /></Button>
              <Button size="icon" variant="secondary" className="shadow-md">+</Button>
              <Button size="icon" variant="secondary" className="shadow-md">-</Button>
            </div>
          </Card>

          {/* List Area */}
          <Card className="flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-muted/30 font-semibold flex justify-between items-center">
              <span>Saved Locations</span>
              <Badge variant="secondary">{filteredPlaces.length}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : filteredPlaces.length > 0 ? (
                filteredPlaces.map(place => (
                  <div key={place.id} className="p-3 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${getCategoryColor(place.category)}`}>
                        {getCategoryIcon(place.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{place.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">{place.category}</p>
                        {place.notes && <p className="text-xs mt-2 line-clamp-2 text-foreground/80">{place.notes}</p>}
                        <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground font-medium">
                          <span>{formatDistanceToNow(new Date(place.created), { addSuffix: true })}</span>
                          {place.rating && <span className="flex items-center text-yellow-600"><Star className="w-3 h-3 mr-0.5 fill-current" /> {place.rating}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">No places found for this category.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceCaptureMapPage;
