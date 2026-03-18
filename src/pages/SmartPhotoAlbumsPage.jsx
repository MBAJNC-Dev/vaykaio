
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Image as ImageIcon, Sparkles, FolderHeart, Play, Share2, Download, Plus } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const SmartPhotoAlbumsPage = () => {
  const { tripId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const records = await pb.collection('albums').getList(1, 50, {
          filter: `trip_id="${tripId}"`,
          sort: '-created',
          $autoCancel: false
        });
        setAlbums(records.items);
      } catch (error) {
        toast.error('Failed to load albums');
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, [tripId]);

  return (
    <>
      <Helmet><title>Smart Albums - VaykAIo</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FolderHeart className="w-8 h-8 text-primary" /> Smart Photo Albums
            </h1>
            <p className="text-muted-foreground mt-1">AI-organized collections of your best moments.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Sparkles className="w-4 h-4 mr-2" /> Auto-Generate</Button>
            <Button><Plus className="w-4 h-4 mr-2" /> New Album</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map(album => (
              <Card key={album.id} className="overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                  {album.cover_photo ? (
                    <img 
                      src={pb.files.getUrl(album, album.cover_photo)} 
                      alt={album.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <ImageIcon className="w-12 h-12 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-2 w-full">
                      <Button size="sm" variant="secondary" className="flex-1 h-8 text-xs"><Play className="w-3 h-3 mr-1"/> Play</Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8"><Share2 className="w-3 h-3"/></Button>
                    </div>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-background/90 text-foreground backdrop-blur-sm border-0">
                    {album.album_type}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{album.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[40px]">
                    {album.description || 'A collection of memories from your trip.'}
                  </p>
                  <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                    <span>{album.photos?.length || 0} items</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 -mr-2"><Download className="w-3 h-3 mr-1"/> PDF</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-3xl border border-dashed shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Let AI organize your photos</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We can automatically group your photos by location, activity, people, or mood to create beautiful albums.
            </p>
            <Button size="lg" className="rounded-full px-8"><Sparkles className="w-5 h-5 mr-2" /> Generate Smart Albums</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default SmartPhotoAlbumsPage;
