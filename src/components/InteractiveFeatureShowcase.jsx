
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Users, Search, Heart, Briefcase, FileText, Grid
} from 'lucide-react';
import PhoneMockup from './PhoneMockup.jsx';

const features = [
  { id: 'trip-planning', title: 'Trip Planning', desc: 'Set destinations, dates, and budgets easily.', icon: MapPin },
  { id: 'itinerary', title: 'Itinerary Builder', desc: 'Drag & drop activities into a visual timeline.', icon: Calendar },
  { id: 'family', title: 'Family Coordination', desc: 'Vote on activities and resolve conflicts.', icon: Users },
  { id: 'discovery', title: 'Search & Discovery', desc: 'Find top-rated restaurants and attractions.', icon: Search },
  { id: 'favorites', title: 'Favorites', desc: 'Save and organize places you want to visit.', icon: Heart },
  { id: 'packing', title: 'Packing Checklist', desc: 'Never forget an item with shared lists.', icon: Briefcase },
  { id: 'documents', title: 'Travel Documents', desc: 'Store tickets and passports securely.', icon: FileText },
  { id: 'shared-calendar', title: 'Shared Calendar', desc: 'See everyone\'s schedule in one place.', icon: Grid },
];

const InteractiveFeatureShowcase = () => {
  const [selectedFeature, setSelectedFeature] = useState(features[0].id);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setSelectedFeature(features[activeIndex].id);
  }, [activeIndex]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % features.length);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    }
  };

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center outline-none" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      aria-label="Interactive feature showcase. Use arrow keys to navigate."
    >
      {/* Left Side: Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 order-2 lg:order-1">
        {features.map((feature, index) => {
          const isActive = activeIndex === index;
          const Icon = feature.icon;
          
          return (
            <button
              key={feature.id}
              onClick={() => setActiveIndex(index)}
              className={`text-left p-5 rounded-2xl transition-all duration-300 border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                isActive 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]' 
                  : 'bg-card border-transparent hover:border-border hover:bg-muted/50 hover:shadow-md'
              }`}
              aria-pressed={isActive}
              role="button"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                isActive ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                {feature.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {feature.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Right Side: Phone Mockup */}
      <div className="flex justify-center lg:justify-end order-1 lg:order-2 lg:sticky lg:top-24">
        <PhoneMockup selectedFeature={selectedFeature} />
      </div>
    </div>
  );
};

export default InteractiveFeatureShowcase;
