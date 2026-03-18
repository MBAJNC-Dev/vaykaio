
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, Smile, Info, Download, Edit2, Share2, Heart } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Link } from 'react-router-dom';

const AIPhotoModal = ({ photo, isOpen, onClose }) => {
  if (!photo) return null;

  const imageUrl = pb.files.getUrl(photo, photo.file);
  const aiTags = photo.ai_tags || [];
  const location = photo.location || {};
  const emotion = photo.emotion;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50">
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Image Area */}
          <div className="flex-1 bg-black/5 relative flex items-center justify-center overflow-hidden">
            <img 
              src={imageUrl} 
              alt="View" 
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full bg-background/50 backdrop-blur hover:bg-background/80">
                <Heart className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full bg-background/50 backdrop-blur hover:bg-background/80">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full bg-background/50 backdrop-blur hover:bg-background/80" asChild>
                <Link to={`/editor/${photo.id}`}><Edit2 className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="w-full md:w-80 bg-card border-l p-6 overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">Photo Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* AI Analysis Section */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> AI Detected Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiTags.length > 0 ? aiTags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                      {tag}
                    </Badge>
                  )) : (
                    <span className="text-sm text-muted-foreground">No tags detected</span>
                  )}
                </div>
              </div>

              {/* Location Section */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </h4>
                {location.formatted ? (
                  <div className="bg-muted rounded-xl p-3 text-sm">
                    <p className="font-medium">{location.landmark || location.city}</p>
                    <p className="text-muted-foreground">{location.formatted}</p>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No location data</span>
                )}
              </div>

              {/* Emotion/People Section */}
              {emotion && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Smile className="w-4 h-4" /> Vibe
                  </h4>
                  <Badge variant="outline" className="capitalize">{emotion}</Badge>
                </div>
              )}

              {/* EXIF Info */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Info
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{new Date(photo.created).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quality Score</span>
                    <span>{photo.quality_score ? `${(photo.quality_score * 100).toFixed(0)}%` : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                <Download className="w-4 h-4 mr-2" /> Download Original
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPhotoModal;
