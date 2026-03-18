import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIRecommendationCard from '@/components/AIRecommendationCard';
import AIStatusRibbon from '@/components/AIStatusRibbon';
import {
  Sparkles,
  UtensilsCrossed,
  Compass,
  Calendar,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useTripContext } from '@/contexts/TripContext';
import { toast } from 'sonner';

// Mock recommendation data
const mockRecommendations = {
  forYou: [
    {
      id: 'fy1',
      title: 'Perfect Time for Museum Visit',
      description: 'Weather is ideal and museums are less crowded in the morning.',
      type: 'activity',
      confidence: 0.92,
      reasoning: 'Based on your interest in art and quiet experiences',
      actionLabel: 'Add to Itinerary',
      metadata: {},
    },
    {
      id: 'fy2',
      title: 'Dinner Reservation Opportunity',
      description: 'Michelin-starred restaurant has last-minute availability tonight.',
      type: 'restaurant',
      confidence: 0.88,
      reasoning: 'Matches your preferences and your free evening schedule',
      actionLabel: 'Book Now',
      metadata: {
        price: '€€€',
        rating: 4.8,
        reviewCount: 342,
      },
    },
    {
      id: 'fy3',
      title: 'Alternative Route Saves 45 Minutes',
      description: 'Traffic is lighter on Highway A7 today. Could save significant time.',
      type: 'schedule_change',
      confidence: 0.85,
      reasoning: 'Real-time traffic analysis shows this route is optimal',
      actionLabel: 'Update Route',
      metadata: {
        timeSaved: '45 minutes',
        distance: '12 km',
      },
    },
  ],
  restaurants: [
    {
      id: 'rest1',
      title: 'Trattoria da Marco',
      description: 'Authentic Italian cuisine in historic old town. Cozy atmosphere.',
      type: 'restaurant',
      confidence: 0.90,
      reasoning: 'You love Italian food and this has excellent reviews',
      actionLabel: 'Add to Wishlist',
      metadata: {
        price: '€€',
        rating: 4.7,
        reviewCount: 258,
        distance: '2.3 km away',
      },
    },
    {
      id: 'rest2',
      title: 'Street Food Market Night',
      description: 'Local food vendors with fresh, local specialties. Great value.',
      type: 'restaurant',
      confidence: 0.82,
      reasoning: 'Aligns with your budget-conscious preferences',
      actionLabel: 'Get Details',
      metadata: {
        price: '€',
        rating: 4.5,
        reviewCount: 412,
        distance: '1.5 km away',
      },
    },
    {
      id: 'rest3',
      title: 'Fine Dining at Sky Terrace',
      description: 'Rooftop restaurant with panoramic city views and modern cuisine.',
      type: 'restaurant',
      confidence: 0.79,
      reasoning: 'Great for special occasions, available tomorrow evening',
      actionLabel: 'Reserve Table',
      metadata: {
        price: '€€€',
        rating: 4.9,
        reviewCount: 189,
        distance: '3.1 km away',
      },
    },
    {
      id: 'rest4',
      title: 'Vegan Paradise Café',
      description: 'Plant-based restaurant with creative dishes and organic ingredients.',
      type: 'restaurant',
      confidence: 0.75,
      reasoning: 'Health-conscious option based on your dietary notes',
      actionLabel: 'Explore Menu',
      metadata: {
        price: '€€',
        rating: 4.6,
        reviewCount: 324,
        distance: '0.8 km away',
      },
    },
  ],
  activities: [
    {
      id: 'act1',
      title: 'Sunrise Hike with Local Guide',
      description: 'Scenic mountain hike with knowledgeable local guide. 2 hours.',
      type: 'activity',
      confidence: 0.88,
      reasoning: 'Matches your adventure preferences and free morning slot',
      actionLabel: 'Book Activity',
      metadata: {
        distance: '8 km away',
      },
    },
    {
      id: 'act2',
      title: 'Cultural Walking Tour',
      description: 'Explore historic neighborhoods with expert historian. Includes lunch.',
      type: 'activity',
      confidence: 0.84,
      reasoning: 'Perfect for cultural enthusiasts like yourself',
      actionLabel: 'Join Tour',
      metadata: {
        distance: '0.5 km away',
      },
    },
    {
      id: 'act3',
      title: 'Water Sports Adventure',
      description: 'Kayaking or paddleboarding with equipment rental. Beginner friendly.',
      type: 'activity',
      confidence: 0.76,
      reasoning: 'Great outdoor activity for your travel style',
      actionLabel: 'Check Availability',
      metadata: {
        distance: '5 km away',
      },
    },
  ],
  scheduleChanges: [
    {
      id: 'sc1',
      title: 'Swap Activities for Better Flow',
      description: 'Move afternoon museum visit to morning to avoid crowds and afternoon heat.',
      type: 'schedule_change',
      confidence: 0.86,
      reasoning: 'Analysis shows this improves your experience and saves energy',
      actionLabel: 'Accept Change',
      metadata: {},
    },
    {
      id: 'sc2',
      title: 'Extend Hotel Checkout',
      description: 'Current flight leaves at 5pm. You could enjoy a leisurely checkout.',
      type: 'schedule_change',
      confidence: 0.78,
      reasoning: 'Reduces morning stress and gives more flexibility',
      actionLabel: 'Request Extension',
      metadata: {},
    },
  ],
  budgetTips: [
    {
      id: 'bt1',
      title: 'Free Museum Day Tomorrow',
      description: 'Many museums offer free entry on the first Sunday. Save €45+',
      type: 'budget',
      confidence: 0.95,
      reasoning: 'Tomorrow is a Sunday and museums you wanted to visit are participating',
      actionLabel: 'Plan Visit',
      metadata: {
        savings: '€45',
      },
    },
    {
      id: 'bt2',
      title: 'Lunch Discount Combo',
      description: 'Restaurant offers 20% off lunch menu 11am-2pm. Same quality food.',
      type: 'budget',
      confidence: 0.89,
      reasoning: 'You mentioned flexible lunch timing',
      actionLabel: 'Set Reminder',
      metadata: {
        savings: '€12-18 per meal',
      },
    },
  ],
};

const AIRecommendationsPage = () => {
  const { tripId } = useParams();
  const { currentTrip, isLoading: tripLoading } = useTripContext();
  const [activeTab, setActiveTab] = useState('for-you');
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In real app, this would fetch fresh recommendations
      setDismissedIds(new Set());
      toast.success('Recommendations refreshed');
    } catch (error) {
      toast.error('Failed to refresh recommendations');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDismiss = (id) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const handleAction = (recommendation) => {
    toast.success(`Action taken: ${recommendation.title}`);
    // In real app, this would trigger the appropriate action
  };

  const filterRecommendations = (recs) =>
    recs.filter((r) => !dismissedIds.has(r.id));

  // Status ribbon alerts
  const alerts = filterRecommendations(recommendations.budgetTips)
    .slice(0, 2)
    .map((r, idx) => ({
      id: r.id,
      title: r.title,
      description: r.metadata?.savings,
    }));

  const agents = [
    { id: 'experience', name: 'Experience', status: 'active' },
    { id: 'monitor', name: 'Monitor', status: 'active' },
    { id: 'optimization', name: 'Optimization', status: 'active' },
  ];

  return (
    <>
      <Helmet>
        <title>AI Recommendations - VaykAIo</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  AI Recommendations
                </h1>
                <p className="text-muted-foreground mt-1">
                  Personalized suggestions for {currentTrip?.name || 'your trip'}
                </p>
              </div>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="lg"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </motion.div>

        {/* Status Ribbon */}
        <AIStatusRibbon
          isMonitoring={true}
          alerts={alerts}
          agents={agents}
          onDismissAlert={handleDismiss}
          compact={true}
        />

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:gap-2">
              <TabsTrigger value="for-you" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">For You</span>
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                <span className="hidden sm:inline">Restaurants</span>
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Activities</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Budget</span>
              </TabsTrigger>
            </TabsList>

            {/* For You Tab */}
            <TabsContent value="for-you" className="space-y-4">
              {filterRecommendations(recommendations.forYou).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      All recommendations dismissed. Refresh to get new suggestions.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filterRecommendations(recommendations.forYou).map(
                    (rec, idx) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                      >
                        <AIRecommendationCard
                          {...rec}
                          onAction={handleAction}
                          onDismiss={handleDismiss}
                        />
                      </motion.div>
                    )
                  )}
                </div>
              )}
            </TabsContent>

            {/* Restaurants Tab */}
            <TabsContent value="restaurants" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filterRecommendations(recommendations.restaurants).map(
                  (rec, idx) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <AIRecommendationCard
                        {...rec}
                        onAction={handleAction}
                        onDismiss={handleDismiss}
                      />
                    </motion.div>
                  )
                )}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filterRecommendations(recommendations.activities).map(
                  (rec, idx) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <AIRecommendationCard
                        {...rec}
                        onAction={handleAction}
                        onDismiss={handleDismiss}
                      />
                    </motion.div>
                  )
                )}
              </div>
            </TabsContent>

            {/* Schedule Changes Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <div className="grid gap-4">
                {filterRecommendations(recommendations.scheduleChanges).map(
                  (rec, idx) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <AIRecommendationCard
                        {...rec}
                        onAction={handleAction}
                        onDismiss={handleDismiss}
                      />
                    </motion.div>
                  )
                )}
              </div>
            </TabsContent>

            {/* Budget Tips Tab */}
            <TabsContent value="budget" className="space-y-4">
              <div className="grid gap-4">
                {filterRecommendations(recommendations.budgetTips).map(
                  (rec, idx) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <AIRecommendationCard
                        {...rec}
                        onAction={handleAction}
                        onDismiss={handleDismiss}
                      />
                    </motion.div>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-l-4 bg-gradient-to-r from-primary/5 to-transparent"
            style={{ borderLeftColor: 'hsl(var(--primary))' }}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                💡 These recommendations are generated by VaykAIo's intelligent agent
                system, which analyzes your preferences, schedule, budget, and real-time
                data to provide personalized suggestions. The confidence score indicates
                how well each recommendation matches your profile.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AIRecommendationsPage;
