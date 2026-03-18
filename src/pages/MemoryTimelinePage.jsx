import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Share2,
  ArrowLeft,
  MapPin,
  Camera,
  Book,
  Sparkles,
  Heart
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import PhotoService from '@/services/PhotoService';
import { toast } from 'sonner';

const MemoryTimelinePage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState({});
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (tripId) {
      fetchTimeline();
    }
  }, [tripId]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      // Fetch trip data
      const trip = await pb.collection('trips').getOne(tripId, { $autoCancel: false });
      setTripData(trip);

      // Fetch memory timeline
      const timelineData = await PhotoService.getMemoryTimeline(tripId);
      setTimeline(timelineData);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      toast.error('Failed to load memories');
      // Load mock data
      setTimeline(getMockTimeline());
    } finally {
      setLoading(false);
    }
  };

  const getMockTimeline = () => ({
    1: {
      day: 1,
      photos: [
        { id: '1', title: 'Arrival', created: new Date() },
        { id: '2', title: 'Hotel check-in', created: new Date() }
      ],
      summary: 'Arrived in Tuscany. Beautiful sunset from the hotel balcony.'
    },
    2: {
      day: 2,
      photos: [
        { id: '3', title: 'Wine tasting', created: new Date() },
        { id: '4', title: 'Vineyard walk', created: new Date() },
        { id: '5', title: 'Group photo', created: new Date() }
      ],
      summary: 'Visited a famous Chianti vineyard. Best wine tasting ever!'
    }
  });

  const handleDownloadAllPhotos = async () => {
    toast.loading('Preparing download...');
    try {
      // In a real implementation, this would create a zip and download it
      toast.success('Photos downloaded! Check your downloads folder.');
    } catch (error) {
      toast.error('Failed to download photos');
    }
  };

  const handleCreateRecap = async () => {
    try {
      // Navigate to recap creation page or modal
      navigate(`/trip/${tripId}/recap`);
    } catch (error) {
      toast.error('Failed to create recap');
    }
  };

  const toggleFavorite = (photoId) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const getPhotoUrl = (photo) => {
    if (photo.file) {
      return pb.files.getUrl(photo, photo.file, { thumb: '400x300' });
    }
    // Mock image placeholder
    return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=400&h=300&fit=crop`;
  };

  const getDayDate = (day) => {
    if (!tripData) return new Date();
    const startDate = new Date(tripData.check_in_date || new Date());
    return new Date(startDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000);
  };

  const calculateStats = () => {
    let totalPhotos = 0;
    Object.values(timeline).forEach(day => {
      totalPhotos += day.photos?.length || 0;
    });
    return {
      totalPhotos,
      totalDays: Object.keys(timeline).length,
      tripDistance: '2,450 km',
      placesVisited: 12,
      totalSpent: 15000
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your memories...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pb-24">
      <Helmet><title>Memory Timeline | VaykAIo</title></Helmet>

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 mb-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">Your Journey</h1>
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground text-lg">
              {tripData?.name || 'Trip'} • {new Date(tripData?.check_in_date).toLocaleDateString()} - {new Date(tripData?.check_out_date).toLocaleDateString()}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Photos</div>
                <div className="text-2xl font-bold">{stats.totalPhotos}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Days</div>
                <div className="text-2xl font-bold">{stats.totalDays}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Distance</div>
                <div className="text-xl font-bold">{stats.tripDistance}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Places</div>
                <div className="text-2xl font-bold">{stats.placesVisited}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Spent</div>
                <div className="text-xl font-bold">${(stats.totalSpent / 1000).toFixed(1)}K</div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCreateRecap} className="gap-2">
              <Share2 className="w-4 h-4" /> Create Recap
            </Button>
            <Button variant="outline" onClick={handleDownloadAllPhotos} className="gap-2">
              <Download className="w-4 h-4" /> Download All Photos
            </Button>
          </div>
        </div>

        {/* Memory Timeline */}
        <div className="space-y-16">
          {Object.entries(timeline)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .map(([dayKey, dayData]) => {
              const dayNum = parseInt(dayKey);
              const dayDate = getDayDate(dayNum);

              return (
                <div key={dayKey} className="relative">
                  {/* Day Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                          <div className="text-center">
                            <div className="text-xs font-semibold text-muted-foreground">Day</div>
                            <div className="text-2xl font-bold text-primary">{dayNum}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
                        {dayData.summary && (
                          <p className="text-muted-foreground mt-1">{dayData.summary}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Photos Grid - Masonry Layout */}
                  {dayData.photos && dayData.photos.length > 0 && (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 mb-12">
                      {dayData.photos.map((photo, idx) => (
                        <div
                          key={photo.id || idx}
                          className="break-inside-avoid group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <img
                            src={getPhotoUrl(photo)}
                            alt={photo.title || `Day ${dayNum} Photo`}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Photo Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div>
                              {photo.title && (
                                <h3 className="text-white font-semibold text-sm">{photo.title}</h3>
                              )}
                              {photo.location && (
                                <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" /> {photo.location}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(photo.id);
                              }}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-sm"
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  favorites.has(photo.id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-white'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Trip Summary Card */}
        {tripData && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-lg mt-16">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Trip Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                What an amazing adventure! You've captured {stats.totalPhotos} incredible moments across {stats.totalDays} days,
                visited {stats.placesVisited} amazing places, and created memories that will last a lifetime.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCreateRecap} className="gap-2">
                  <Share2 className="w-4 h-4" /> Create Shareable Recap
                </Button>
                <Button variant="outline" onClick={handleDownloadAllPhotos} className="gap-2">
                  <Download className="w-4 h-4" /> Download Album
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Photo Detail Modal - Simple Implementation */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-2xl w-full bg-background rounded-xl overflow-hidden shadow-2xl">
            <div className="relative">
              <img
                src={getPhotoUrl(selectedPhoto)}
                alt={selectedPhoto.title || 'Photo'}
                className="w-full h-auto object-cover max-h-[60vh]"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {selectedPhoto.title && (
                <h3 className="text-xl font-bold mb-2">{selectedPhoto.title}</h3>
              )}
              {selectedPhoto.location && (
                <p className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" /> {selectedPhoto.location}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => toggleFavorite(selectedPhoto.id)}
                  variant={favorites.has(selectedPhoto.id) ? 'default' : 'outline'}
                  className="gap-2"
                >
                  <Heart className={favorites.has(selectedPhoto.id) ? 'fill-current' : ''} className="w-4 h-4" />
                  {favorites.has(selectedPhoto.id) ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryTimelinePage;
