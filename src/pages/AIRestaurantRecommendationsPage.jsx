
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, MapPin, DollarSign, Heart, Plus, Star, Utensils } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AIRestaurantRecommendationsPage = () => {
  const { tripId } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Mocking AI recommendations
        const mockData = [
          { id: '1', name: 'Le Jules Verne', cuisine: 'French', rating: 4.9, price: '$$$$', distance: '0.5 km', reason: 'Iconic dining experience matching your luxury preference.', image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500&q=80' },
          { id: '2', name: 'L\'As du Fallafel', cuisine: 'Middle Eastern', rating: 4.7, price: '$', distance: '2.1 km', reason: 'Highly rated budget-friendly street food.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
          { id: '3', name: 'Pink Mamma', cuisine: 'Mediterranean', rating: 4.8, price: '$$', distance: '1.8 km', reason: 'Great vegetarian options available.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80' },
          { id: '4', name: 'Bistrot Paul Bert', cuisine: 'French', rating: 4.6, price: '$$$', distance: '3.2 km', reason: 'Classic Parisian bistro experience.', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80' },
        ];
        
        setTimeout(() => {
          setRecommendations(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to load recommendations');
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [tripId]);

  return (
    <>
      <Helmet><title>AI Restaurants - VaykAIo</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Utensils className="w-8 h-8 text-primary" /> AI Dining Guide
            </h1>
            <p className="text-muted-foreground mt-1">Curated culinary experiences for your trip.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Cuisine" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Card key={i} className="h-80 animate-pulse bg-muted/50 border-0" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec, i) => (
              <Card key={`${rec.id}-${i}`} className="overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="h-48 relative overflow-hidden">
                  <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {rec.rating}
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg line-clamp-1">{rec.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{rec.cuisine}</p>
                  <div className="flex flex-wrap gap-3 text-xs font-medium text-muted-foreground mb-3">
                    <span className="text-foreground">{rec.price}</span>
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-0.5" />{rec.distance}</span>
                  </div>
                  <div className="bg-primary/5 p-3 rounded-lg mb-4 mt-auto">
                    <p className="text-xs text-primary/80 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      {rec.reason}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Button className="flex-1 text-xs h-9"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
                    <Button variant="outline" size="icon" className="h-9 w-9"><Heart className="w-4 h-4 text-muted-foreground" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AIRestaurantRecommendationsPage;
