
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, BookOpen, MapPin, Users, Activity, Calendar } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

const JournalSummaryPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const records = await pb.collection('journal_summaries').getList(1, 30, {
          filter: `trip_id="${tripId}"`,
          sort: '-date',
          $autoCancel: false
        });
        setSummaries(records.items);
      } catch (error) {
        toast.error('Failed to load journal summaries');
      } finally {
        setLoading(false);
      }
    };
    fetchSummaries();
  }, [tripId]);

  const getMoodEmoji = (mood) => {
    const moods = { happy: '😊', excited: '🤩', relaxed: '😌', sad: '😢', tired: '😴', adventurous: '🎉' };
    return moods[mood] || '📝';
  };

  return (
    <>
      <Helmet><title>AI Journal Summaries - VaykAIo</title></Helmet>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" /> AI Journal Summaries
            </h1>
            <p className="text-muted-foreground mt-1">Intelligent recaps of your daily adventures.</p>
          </div>
          <Button><Sparkles className="w-4 h-4 mr-2" /> Generate New Summary</Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : summaries.length > 0 ? (
          <div className="space-y-6">
            {summaries.map(summary => (
              <Card key={summary.id} className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-muted/30 px-6 py-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-bold text-lg">{format(new Date(summary.date), 'EEEE, MMMM d, yyyy')}</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border shadow-sm">
                    <span className="text-xl">{getMoodEmoji(summary.mood)}</span>
                    <span className="text-sm font-medium capitalize">{summary.mood}</span>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> AI Recap
                    </h4>
                    <p className="text-lg leading-relaxed text-balance">{summary.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="bg-primary/5 rounded-xl p-4">
                      <h5 className="text-sm font-bold flex items-center gap-2 mb-3 text-primary">
                        <Activity className="w-4 h-4" /> Key Activities
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {summary.key_activities ? JSON.parse(summary.key_activities).map((act, i) => (
                          <Badge key={i} variant="outline" className="bg-background">{act}</Badge>
                        )) : <span className="text-sm text-muted-foreground">None recorded</span>}
                      </div>
                    </div>
                    
                    <div className="bg-secondary/5 rounded-xl p-4">
                      <h5 className="text-sm font-bold flex items-center gap-2 mb-3 text-secondary">
                        <MapPin className="w-4 h-4" /> Locations Visited
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {summary.key_locations ? JSON.parse(summary.key_locations).map((loc, i) => (
                          <Badge key={i} variant="outline" className="bg-background">{loc}</Badge>
                        )) : <span className="text-sm text-muted-foreground">None recorded</span>}
                      </div>
                    </div>

                    <div className="bg-accent/5 rounded-xl p-4">
                      <h5 className="text-sm font-bold flex items-center gap-2 mb-3 text-accent">
                        <Users className="w-4 h-4" /> People Mentioned
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {summary.key_people ? JSON.parse(summary.key_people).map((person, i) => (
                          <Badge key={i} variant="outline" className="bg-background">{person}</Badge>
                        )) : <span className="text-sm text-muted-foreground">None recorded</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-3xl border border-dashed shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No summaries yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Write some journal entries first, and our AI will automatically generate beautiful daily recaps and insights.
            </p>
            <Button asChild><Link to={`/trip/${tripId}/journal/new`}>Write Journal Entry</Link></Button>
          </div>
        )}
      </div>
    </>
  );
};

export default JournalSummaryPage;
