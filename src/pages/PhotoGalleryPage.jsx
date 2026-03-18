import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Grid,
  Map as MapIcon,
  Clock,
  Plus,
  Heart,
  Download,
  Share2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import PhotoUploadComponent from '@/components/PhotoUploadComponent.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const PhotoGalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [filterDay, setFilterDay] = useState(null);
  const [filterLocation, setFilterLocation] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('photos').getList(1, 100, {
        sort: '-created',
        $autoCancel: false
      });
      setPhotos(records.items);
    } catch (error) {
      console.error('Failed to load photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pb.authStore.isValid) {
      fetchPhotos();
    } else {
      setLoading(false);
    }
  }, []);

  const getPhotoUrl = (photo) => {
    if (photo.file) {
      return pb.files.getUrl(photo, photo.file, { thumb: '400x300' });
    }
    return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=400&h=300&fit=crop`;
  };

  const getFullPhotoUrl = (photo) => {
    if (photo.file) {
      return pb.files.getUrl(photo, photo.file);
    }
    return getPhotoUrl(photo);
  };

  const filteredPhotos = photos.filter(p => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const tags = p.ai_tags || p.tags || [];
      const title = p.title?.toLowerCase() || '';
      const location = p.location?.formatted || p.location?.name || '';
      const searchMatch = title.includes(q) ||
        location.toLowerCase().includes(q) ||
        tags.some(t => t.toLowerCase().includes(q));
      if (!searchMatch) return false;
    }

    // Day filter
    if (filterDay && p.day !== filterDay) return false;

    // Location filter
    if (filterLocation && p.location_id !== filterLocation) return false;

    // Tag filter
    if (filterTag) {
      const tags = p.ai_tags || p.tags || [];
      if (!tags.includes(filterTag)) return false;
    }

    return true;
  });

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

  const toggleSelectPhoto = (photoId) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleAutoOrganize = async () => {
    toast.loading('Organizing photos by AI...');
    // In a real implementation, this would call an AI service
    setTimeout(() => {
      toast.success('Photos organized by AI');
    }, 2000);
  };

  const handleDownloadSelected = () => {
    if (selectedPhotos.size === 0) {
      toast.error('Select photos to download');
      return;
    }
    toast.loading(`Preparing ${selectedPhotos.size} photo${selectedPhotos.size > 1 ? 's' : ''}...`);
    setTimeout(() => {
      toast.success('Download started');
    }, 1500);
  };

  const handlePrevPhoto = () => {
    if (lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
      setSelectedPhoto(filteredPhotos[lightboxIndex - 1]);
    }
  };

  const handleNextPhoto = () => {
    if (lightboxIndex < filteredPhotos.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
      setSelectedPhoto(filteredPhotos[lightboxIndex + 1]);
    }
  };

  // Get unique values for filters
  const uniqueDays = [...new Set(photos.map(p => p.day).filter(Boolean))];
  const uniqueLocations = [...new Set(photos.map(p => p.location?.name || p.location).filter(Boolean))];
  const uniqueTags = [...new Set(photos.flatMap(p => p.ai_tags || p.tags || []))];

  if (!pb.authStore.isValid) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your gallery</h2>
          <Button asChild><a href="/login">Log In</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pb-24">
      <Helmet><title>Photo Gallery | VaykAIo</title></Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Photo Gallery</h1>
              <p className="text-muted-foreground text-lg">Your memories, intelligently organized.</p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Upload Photos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <PhotoUploadComponent
                    tripId="default-trip"
                    onUploadComplete={() => {
                      setUploadOpen(false);
                      fetchPhotos();
                    }}
                  />
                </DialogContent>
              </Dialog>

              {selectedPhotos.size > 0 && (
                <Button
                  variant="outline"
                  onClick={handleDownloadSelected}
                  className="gap-2 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download ({selectedPhotos.size})
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleAutoOrganize}
                className="gap-2 shrink-0"
              >
                <Maximize2 className="w-4 h-4" /> AI Organize
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, location, tags..."
                className="pl-9 bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {filterDay && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => setFilterDay(null)}
                >
                  Day {filterDay} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {filterLocation && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => setFilterLocation(null)}
                >
                  {filterLocation} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              {filterTag && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => setFilterTag(null)}
                >
                  #{filterTag} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="grid" className="gap-2">
              <Grid className="w-4 h-4" /> Grid
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Clock className="w-4 h-4" /> Timeline
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapIcon className="w-4 h-4" /> Map
            </TabsTrigger>
          </TabsList>

          {/* Grid View */}
          <TabsContent value="grid" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
                ))}
              </div>
            ) : filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-muted aspect-square cursor-pointer"
                  >
                    <img
                      src={getPhotoUrl(photo)}
                      alt={photo.title || 'Photo'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setLightboxIndex(filteredPhotos.indexOf(photo));
                      }}
                    />

                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedPhotos.has(photo.id)}
                      onChange={() => toggleSelectPhoto(photo.id)}
                      className="absolute top-2 left-2 w-4 h-4 cursor-pointer rounded z-20"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 z-10">
                      <div className="text-white text-xs flex-1 min-w-0">
                        {photo.title && <p className="font-medium truncate">{photo.title}</p>}
                        {photo.day && <p className="text-white/70">Day {photo.day}</p>}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(photo.id);
                          }}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-sm"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.has(photo.id) ? 'fill-red-500 text-red-500' : 'text-white'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-card rounded-2xl border border-dashed">
                <p className="text-muted-foreground mb-4">No photos found. Try uploading some!</p>
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" /> Upload First Photo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <PhotoUploadComponent
                      tripId="default-trip"
                      onUploadComplete={() => {
                        setUploadOpen(false);
                        fetchPhotos();
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>

          {/* Timeline View */}
          <TabsContent value="timeline" className="mt-0">
            <div className="space-y-12 pl-4 border-l-2 border-muted ml-4">
              {filteredPhotos.length > 0 ? (
                filteredPhotos.reduce((acc, photo, idx) => {
                  const dayKey = photo.day || 'undated';
                  if (!acc[dayKey]) {
                    acc[dayKey] = [];
                  }
                  acc[dayKey].push({ photo, idx });
                  return acc;
                }, {})
                  ? Object.entries(
                    filteredPhotos.reduce((acc, photo) => {
                      const dayKey = photo.day || 'undated';
                      if (!acc[dayKey]) acc[dayKey] = [];
                      acc[dayKey].push(photo);
                      return acc;
                    }, {})
                  ).map(([day, dayPhotos]) => (
                    <div key={day} className="relative">
                      <div className="absolute -left-[21px] top-2 w-3 h-3 bg-primary rounded-full ring-4 ring-background" />
                      <div className="mb-4">
                        <Badge variant="outline" className="text-sm">
                          {day === 'undated' ? 'Undated' : `Day ${day}`}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {dayPhotos.map(photo => (
                          <div
                            key={photo.id}
                            className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer aspect-video"
                            onClick={() => {
                              setSelectedPhoto(photo);
                              setLightboxIndex(filteredPhotos.indexOf(photo));
                            }}
                          >
                            <img
                              src={getPhotoUrl(photo)}
                              alt={photo.title || 'Photo'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                  : null
              ) : (
                <p className="text-muted-foreground text-center py-12">No photos to display</p>
              )}
            </div>
          </TabsContent>

          {/* Map View */}
          <TabsContent value="map" className="mt-0">
            <div className="h-[600px] rounded-2xl overflow-hidden border shadow-sm relative z-0">
              {filteredPhotos.some(p => p.location?.lat && p.location?.lng) ? (
                <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {filteredPhotos
                    .filter(p => p.location?.lat && p.location?.lng)
                    .map(photo => (
                      <Marker key={photo.id} position={[photo.location.lat, photo.location.lng]}>
                        <Popup>
                          <div
                            className="w-40 cursor-pointer"
                            onClick={() => {
                              setSelectedPhoto(photo);
                              setLightboxIndex(filteredPhotos.indexOf(photo));
                            }}
                          >
                            <img
                              src={getPhotoUrl(photo)}
                              alt="thumb"
                              className="w-full h-32 object-cover rounded-lg mb-2"
                            />
                            <p className="text-xs font-medium truncate">{photo.location?.city || 'Location'}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  <p>No geotagged photos available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50"
            disabled={lightboxIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] flex flex-col gap-4">
            <img
              src={getFullPhotoUrl(selectedPhoto)}
              alt={selectedPhoto.title || 'Photo'}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />

            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {selectedPhoto.title && (
                    <h3 className="text-lg font-semibold">{selectedPhoto.title}</h3>
                  )}
                  {selectedPhoto.day && (
                    <p className="text-sm text-white/70">Day {selectedPhoto.day}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedPhoto.id)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Heart
                      className={favorites.has(selectedPhoto.id) ? 'fill-red-500 text-red-500' : 'text-white'}
                      className="w-5 h-5"
                    />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-white/70">
                {lightboxIndex + 1} of {filteredPhotos.length}
              </p>
            </div>
          </div>

          <button
            onClick={handleNextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50"
            disabled={lightboxIndex === filteredPhotos.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryPage;
