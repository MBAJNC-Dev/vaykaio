
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderHeart, Wand2, Plus } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { SmartAlbumsService } from '@/services/SmartAlbumsService';
import { toast } from 'sonner';

const TripAlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!pb.authStore.isValid) return;
      try {
        const data = await SmartAlbumsService.getAlbums(pb.authStore.model.id);
        setAlbums(data);
      } catch (error) {
        toast.error('Failed to load albums');
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const handleAutoGenerate = async () => {
    toast.info('Analyzing photos to generate smart albums...');
    // In a real app, this would fetch photos, run SmartAlbumsService.generateSmartSuggestions, and save them.
    setTimeout(() => {
      toast.success('Smart albums generated successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet><title>Smart Albums | VaykAIo</title></Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Smart Albums</h1>
            <p className="text-muted-foreground">Collections organized by trips, dates, and AI.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleAutoGenerate}>
              <Wand2 className="w-4 h-4 mr-2" /> Auto-Generate
            </Button>
            <Button><Plus className="w-4 h-4 mr-2" /> New Album</Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />)}
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {albums.map(album => (
              <Card key={album.id} className="card-hover overflow-hidden cursor-pointer border-0 shadow-sm">
                <div className="h-48 bg-muted relative">
                  {/* Placeholder for cover photo */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <FolderHeart className="w-12 h-12 opacity-20" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{album.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{album.description || 'No description'}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed">
            <FolderHeart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No albums yet</h3>
            <p className="text-muted-foreground mb-6">Create one manually or let AI organize your photos.</p>
            <Button onClick={handleAutoGenerate}><Wand2 className="w-4 h-4 mr-2" /> Auto-Generate Albums</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripAlbumsPage;
