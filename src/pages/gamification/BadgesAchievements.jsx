
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Map, Camera, Star } from 'lucide-react';

const BadgesAchievements = () => {
  const badges = [
    { id: 1, name: 'Globe Trotter', desc: 'Visited 5+ countries', icon: Map, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', unlocked: true },
    { id: 2, name: 'Shutterbug', desc: 'Uploaded 100+ photos', icon: Camera, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', unlocked: true },
    { id: 3, name: 'Top Reviewer', desc: 'Left 50+ helpful reviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', unlocked: false },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Helmet><title>Badges | Vacation Planner</title></Helmet>
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Badges & Achievements</h1>
        <p className="text-muted-foreground mt-2">Unlock rewards as you explore the world.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {badges.map(badge => {
          const Icon = badge.icon;
          return (
            <Card key={badge.id} className={`border-0 shadow-sm ${!badge.unlocked ? 'opacity-60 grayscale' : ''}`}>
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${badge.bg}`}>
                  <Icon className={`w-8 h-8 ${badge.color}`} />
                </div>
                <h3 className="font-bold text-lg">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{badge.desc}</p>
                {!badge.unlocked && <p className="text-xs font-medium mt-4 uppercase tracking-wider">Locked</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesAchievements;
