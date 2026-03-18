import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UtensilsCrossed,
  Compass,
  Calendar,
  TrendingUp,
  Star,
  X,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const typeConfig = {
  restaurant: {
    icon: UtensilsCrossed,
    color: 'bg-orange-500/10 text-orange-600',
    accentColor: 'from-orange-400 to-red-400',
  },
  activity: {
    icon: Compass,
    color: 'bg-blue-500/10 text-blue-600',
    accentColor: 'from-blue-400 to-purple-400',
  },
  schedule_change: {
    icon: Calendar,
    color: 'bg-purple-500/10 text-purple-600',
    accentColor: 'from-purple-400 to-pink-400',
  },
  weather: {
    icon: Calendar,
    color: 'bg-cyan-500/10 text-cyan-600',
    accentColor: 'from-cyan-400 to-blue-400',
  },
  budget: {
    icon: TrendingUp,
    color: 'bg-green-500/10 text-green-600',
    accentColor: 'from-green-400 to-emerald-400',
  },
};

const AIRecommendationCard = ({
  id,
  title,
  description,
  type = 'activity',
  confidence = 0.85,
  reasoning,
  actionLabel = 'Action',
  onAction,
  onDismiss,
  metadata = {},
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const config = typeConfig[type] || typeConfig.activity;
  const Icon = config.icon;
  const confidencePercent = Math.round(confidence * 100);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.(id);
  };

  const handleAction = () => {
    onAction?.({
      id,
      type,
      title,
      metadata,
    });
  };

  if (isDismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-l-4"
        style={{ borderLeftColor: 'hsl(var(--accent))' }}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn('p-2 rounded-lg', config.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-amber-600">
                      {confidencePercent}%
                    </span>
                  </div>
                  <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--tw-from), var(--tw-to))`,
                        '--tw-from': 'hsl(var(--accent))',
                        '--tw-to': 'hsl(var(--accent) / 0.6)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${confidencePercent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-muted rounded transition-colors"
                aria-label="Dismiss recommendation"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {description && (
            <p className="text-sm text-foreground line-clamp-2">
              {description}
            </p>
          )}

          {reasoning && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Why this recommendation
              </p>
              <p className="text-sm text-foreground">
                {reasoning}
              </p>
            </div>
          )}

          {metadata.rating && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{metadata.rating}</span>
              {metadata.reviewCount && (
                <span className="text-muted-foreground">
                  ({metadata.reviewCount} reviews)
                </span>
              )}
            </div>
          )}

          {metadata.distance && (
            <p className="text-xs text-muted-foreground">
              📍 {metadata.distance}
            </p>
          )}

          {metadata.price && (
            <div className="text-sm text-muted-foreground">
              💰 {metadata.price}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={handleAction}
            >
              {actionLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIRecommendationCard;
