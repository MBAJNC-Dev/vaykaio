
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Sparkles } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AIPhotoCard = ({ photo, onClick }) => {
  const imageUrl = pb.files.getUrl(photo, photo.file, { thumb: '300x300' });
  const location = photo.location?.city || photo.location?.country;
  const topTag = photo.ai_tags?.[0];

  return (
    <Card 
      className="overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 relative"
      onClick={() => onClick(photo)}
    >
      <div className="aspect-square relative bg-muted">
        <img 
          src={imageUrl} 
          alt="Gallery item" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex flex-col gap-2">
            {location && (
              <div className="flex items-center gap-1 text-white text-xs font-medium">
                <MapPin className="w-3 h-3" /> {location}
              </div>
            )}
            {topTag && (
              <Badge variant="secondary" className="w-fit bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> {topTag}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIPhotoCard;
