import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Calendar, Users, Compass, Image, DollarSign, Bell, Clock, ArrowRight } from 'lucide-react';

const FeatureSection = ({ icon: Icon, title, description, bullets, imagePosition = 'left' }) => {
  const content = (
    <div className="flex-1 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 mt-1">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
        </div>
      </div>
      <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
      <ul className="space-y-2 pt-2">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2 text-muted-foreground">
            <span className="text-primary font-bold shrink-0 mt-1">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const placeholder = (
    <div className="flex-1 h-64 md:h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center border border-primary/20">
      <div className="text-center">
        <Icon className="w-16 h-16 text-primary/30 mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">{title} Illustration</p>
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
      {imagePosition === 'left' ? (
        <>
          {placeholder}
          {content}
        </>
      ) : (
        <>
          {content}
          {placeholder}
        </>
      )}
    </div>
  );
};

const FeaturesPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Multi-Agent System',
      description: 'VaykAIo uses specialized AI agents working together to create personalized vacation plans. Each agent specializes in different aspects of travel planning.',
      bullets: [
        'Conversation agent understands your travel style and preferences',
        'Planning agent builds optimized itineraries based on your needs',
        'Discovery agent finds hidden gems and local experiences',
        'Learns from your feedback to improve recommendations over time',
      ],
    },
    {
      icon: Calendar,
      title: 'Smart Itinerary Builder',
      description: 'Automatically generate day-by-day itineraries that balance activities, rest time, and meals. Adjust on the fly as plans change.',
      bullets: [
        'Drag-and-drop activity planning interface',
        'Automatic route optimization to minimize travel time',
        'Real-time availability checking for restaurants and attractions',
        'Weather-aware activity suggestions',
      ],
    },
    {
      icon: Users,
      title: 'Group Coordination',
      description: 'Travel with friends and family seamlessly. Vote on activities, split expenses, and stay synchronized.',
      bullets: [
        'Real-time collaborative planning with your group',
        'Activity voting system to make decisions together',
        'Expense splitting with automatic settlement',
        'Shared trip documents and packing lists',
      ],
    },
    {
      icon: Compass,
      title: 'Discovery Engine',
      description: 'Discover amazing places beyond the guidebooks. Find restaurants, attractions, and experiences tailored to your interests.',
      bullets: [
        'Personalized recommendations based on your travel history',
        'Real-time local event suggestions',
        'Hidden gem discoveries from community reviews',
        'Integration with booking platforms for reservations',
      ],
    },
    {
      icon: Image,
      title: 'Memory & Photo System',
      description: 'Capture and organize your travel memories automatically. Create stunning albums and relive your journeys.',
      bullets: [
        'Automatic photo organization by location and date',
        'AI-powered photo enhancement and curation',
        'Shared albums for group trips',
        'Export travel stories and photo books',
      ],
    },
    {
      icon: DollarSign,
      title: 'Budget Tracking',
      description: 'Stay on budget with real-time expense tracking. Understand where your money goes and optimize spending.',
      bullets: [
        'Automatic expense categorization',
        'Daily and trip-level budget monitoring',
        'Multi-currency support with live conversion rates',
        'Spending analytics and insights',
      ],
    },
    {
      icon: Bell,
      title: 'Proactive Notifications',
      description: 'Get reminders exactly when you need them, without being overwhelmed. Smart notification system learns your preferences.',
      bullets: [
        'Flight and activity reminders 24 hours before',
        'Weather alerts for your destination',
        'Restaurant reservation confirmations',
        'Customizable quiet hours to avoid interruptions',
      ],
    },
    {
      icon: Clock,
      title: 'Routine Templates',
      description: 'Use pre-built vacation routines to get started faster. Customize them based on your destination and preferences.',
      bullets: [
        'City explorer, beach relaxation, adventure, and more templates',
        'Customizable timing and activities',
        'Save your favorite routines for future trips',
        'Community-shared templates from other travelers',
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Features - VaykAIo</title>
        <meta name="description" content="Discover VaykAIo's AI-powered features that transform vacation planning." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Features That Run Your Vacation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              VaykAIo handles the planning, coordination, and logistics so you can focus on creating memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="rounded-lg">Start Planning Free</Button>
              <Button size="lg" variant="outline" className="rounded-lg">
                Watch Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-24">
            {features.map((feature, idx) => (
              <FeatureSection
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                bullets={feature.bullets}
                imagePosition={idx % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Plan Your Perfect Vacation?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your first trip today and experience the future of travel planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-lg">Start Your First Trip</Button>
              <Button size="lg" variant="outline" className="rounded-lg">Schedule Demo</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesPage;
