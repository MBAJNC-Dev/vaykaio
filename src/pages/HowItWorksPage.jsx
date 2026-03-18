
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';

const HowItWorksPage = () => {
  const steps = [
    {
      number: '1',
      title: 'Enter trip details',
      description: 'Tell us where you want to go, when, how many travelers, your budget, and your interests. The more details you provide, the better your itinerary will be.',
    },
    {
      number: '2',
      title: 'AI generates your plan',
      description: 'Our AI analyzes thousands of travel options and creates a personalized day-by-day itinerary with activities, restaurants, hotels, and transportation tailored to your preferences.',
    },
    {
      number: '3',
      title: 'View and customize',
      description: "Review your itinerary in our interactive timeline view. See all activities, meals, and transport organized by day. Drag and drop to rearrange, add new items, or remove what you don't like.",
    },
    {
      number: '4',
      title: 'Book and track',
      description: 'Use our booking links to reserve hotels, activities, and restaurants. Track all confirmations in one place. Monitor your budget in real-time and get alerts if you are overspending.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>How It Works - VaykAIo</title>
        <meta name="description" content="Learn how VaykAIo helps you plan your perfect trip in 4 simple steps: enter details, AI generates plan, customize, and book." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance" style={{letterSpacing: '-0.02em'}}>
                Plan your trip in 4 simple steps
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                From idea to itinerary in minutes with AI-powered planning
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-16">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/signup">Start planning your trip</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HowItWorksPage;
