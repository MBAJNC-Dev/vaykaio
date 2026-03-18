
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Plus, Calendar } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';

const TravelJournalPage = () => {
  const { tripId } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const records = await pb.collection('journal_entries').getList(1, 50, {
          filter: `trip_id="${tripId}"`,
          sort: '-date',
          $autoCancel: false
        });
        setEntries(records.items);
      } catch (error) {
        toast.error('Failed to load journal entries');
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [tripId]);

  return (
    <>
      <Helmet><title>Travel Journal - VaykAIo</title></Helmet>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" /> Travel Journal
            </h1>
            <p className="text-muted-foreground mt-1">Document your daily adventures and thoughts.</p>
          </div>
          <Button asChild><Link to={`/trip/${tripId}/journal/new`}><Plus className="w-4 h-4 mr-2" /> New Entry</Link></Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map(entry => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{entry.title}</h3>
                    <span className="text-2xl" title={entry.mood}>
                      {entry.mood === 'happy' ? '😊' : entry.mood === 'excited' ? '🤩' : entry.mood === 'relaxed' ? '😌' : '📝'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4 mr-1.5" /> {format(new Date(entry.date), 'MMMM d, yyyy')}
                  </div>
                  <p className="text-muted-foreground line-clamp-3 mb-4">{entry.content}</p>
                  <Button variant="outline" size="sm" asChild><Link to={`/trip/${tripId}/journal/${entry.id}`}>Read More</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No journal entries</h3>
            <p className="text-muted-foreground mb-8">Start documenting your trip memories today.</p>
            <Button asChild><Link to={`/trip/${tripId}/journal/new`}><Plus className="w-4 h-4 mr-2" /> Write First Entry</Link></Button>
          </div>
        )}
      </div>
    </>
  );
};

export default TravelJournalPage;
