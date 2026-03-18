
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sun, CloudRain, Wind, Cloud, Sparkles, Plus } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AIWeatherSuggestionsPage = () => {
  const { tripId } = useParams();
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Mock weather data
        const mockData = [
          { date: 'Mar 15', temp: '72°F', condition: 'Sunny', icon: Sun, suggestions: ['Beach Day', 'Outdoor Hiking'] },
          { date: 'Mar 16', temp: '65°F', condition: 'Cloudy', icon: Cloud, suggestions: ['City Walking Tour', 'Photography'] },
          { date: 'Mar 17', temp: '58°F', condition: 'Rainy', icon: CloudRain, suggestions: ['Museum Visit', 'Indoor Shopping'] },
          { date: 'Mar 18', temp: '68°F', condition: 'Windy', icon: Wind, suggestions: ['Kite Surfing', 'Café Hopping'] },
        ];
        
        setTimeout(() => {
          setWeather(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to load weather data');
        setLoading(false);
      }
    };
    fetchWeather();
  }, [tripId]);

  return (
    <>
      <Helmet><title>Weather Insights - VaykAIo</title></Helmet>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sun className="w-8 h-8 text-orange-500" /> Weather-Based Suggestions
          </h1>
          <p className="text-muted-foreground mt-1">AI-curated activities optimized for the forecast.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weather.map((day, i) => {
              const Icon = day.icon;
              return (
                <Card key={i} className="overflow-hidden border-border/50 shadow-sm">
                  <div className="bg-muted/30 p-4 text-center border-b">
                    <h3 className="font-bold text-lg">{day.date}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-2xl font-bold">{day.temp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{day.condition}</p>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> AI Suggests
                    </div>
                    {day.suggestions.map((sug, j) => (
                      <div key={j} className="flex justify-between items-center bg-card border rounded-lg p-3 shadow-sm">
                        <span className="text-sm font-medium">{sug}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Plus className="w-4 h-4" /></Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AIWeatherSuggestionsPage;
