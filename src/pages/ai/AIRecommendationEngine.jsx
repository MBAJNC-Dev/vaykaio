
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MapPin, ThumbsUp, ThumbsDown, BookmarkPlus, Share2 } from 'lucide-react';
import { AIRecommendationService } from '@/services/AIRecommendationService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AIRecommendationEngine = () => {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        // Simulate fetching personalized recs
        const res = await AIRecommendationService.generateNewRecommendations({});
        setRecommendations(res.data);
      } catch (error) {
        toast.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>AI Recommendations | Vacation Planner</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            For You
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Hyper-personalized travel suggestions based on your unique style.</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Suggestions
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-64 bg-muted/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((rec, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="h-full flex flex-col card-hover overflow-hidden border-0 shadow-lg">
                <div className="h-48 bg-muted relative">
                  <img src={`https://source.unsplash.com/random/800x600/?${encodeURIComponent(rec.title)}`} alt={rec.title} className="w-full h-full object-cover" />
                  <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground border-0">
                    {rec.score}% Match
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> {rec.title}
                  </CardTitle>
                  <CardDescription>{rec.reason}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-4 border-t flex justify-between bg-muted/10">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toast.success('Feedback recorded')}><ThumbsUp className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toast.success('Feedback recorded')}><ThumbsDown className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Share2 className="w-4 h-4" /></Button>
                    <Button variant="default" size="sm"><BookmarkPlus className="w-4 h-4 mr-2" /> Save</Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationEngine;
