
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Map, Compass, Mountain, CloudLightning } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KeyBenefitCard, TestimonialCard, MiniCTA } from '@/components/landing/SharedUI';

const AdventureLanding = () => {
  const { trackConversion } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Adventure Travel Planner | VaykAIo</title>
        <meta name="description" content="Find off-the-beaten-path trails, extreme sports, and hidden gems with our AI adventure planner." />
      </Helmet>

      <section className="relative min-h-[90dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1547827100-c4cfc7019019?auto=format&fit=crop&w=2400&q=80" alt="Mountain climbing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-white mt-6 mb-6 font-display">
              Off the beaten path. <br/>
              <span className="text-accent">On your terms.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Discover hidden trails, extreme sports, and local secrets. Our AI builds rugged itineraries for those who crave adrenaline.
            </p>
            <MiniCTA text="Find My Next Adventure" onClick={() => trackConversion('hero_cta_click')} />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyBenefitCard icon={<Mountain />} title="Hidden Gems" description="AI analyzes millions of local reviews to find spots tourists miss." delay={0.1} />
            <KeyBenefitCard icon={<CloudLightning />} title="Weather Aware" description="Dynamic itineraries that automatically suggest alternatives if it rains." delay={0.2} />
            <KeyBenefitCard icon={<Compass />} title="Gear Checklists" description="Auto-generated packing lists based on your specific activities and climate." delay={0.3} />
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <TestimonialCard 
              quote="It found a via ferrata route in the Dolomites that wasn't on any major blog. Best day of the trip."
              author="Alex K." role="Alpinist" image="https://i.pravatar.cc/150?img=12"
            />
            <TestimonialCard 
              quote="The weather-adaptive feature saved us. When a storm hit, it instantly re-routed us to an indoor climbing gym nearby."
              author="Sam T." role="Outdoor Enthusiast" image="https://i.pravatar.cc/150?img=32" delay={0.2}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdventureLanding;
