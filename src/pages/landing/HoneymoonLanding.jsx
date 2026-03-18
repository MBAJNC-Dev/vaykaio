
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Camera, Sparkles } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KeyBenefitCard, MiniCTA } from '@/components/landing/SharedUI';

const HoneymoonLanding = () => {
  const { trackConversion } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Honeymoon Planner | VaykAIo</title>
        <meta name="description" content="Plan the perfect romantic getaway. Let AI handle the stress so you can focus on each other." />
      </Helmet>

      <section className="relative min-h-[90dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1685688068009-0eb513a8e257?auto=format&fit=crop&w=2400&q=80" alt="Romantic honeymoon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-white mt-6 mb-6 font-display">
              The perfect honeymoon, <br/>
              <span className="text-accent">zero planning stress.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              You planned the wedding; let us plan the getaway. Discover romantic retreats, private dinners, and unforgettable moments.
            </p>
            <MiniCTA text="Start Planning Together" onClick={() => trackConversion('hero_cta_click')} />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyBenefitCard icon={<Heart />} title="Romantic Pacing" description="Slower itineraries designed for sleeping in, long dinners, and relaxation." delay={0.1} />
            <KeyBenefitCard icon={<Sparkles />} title="Special Touches" description="AI automatically flags your bookings as a honeymoon for potential upgrades." delay={0.2} />
            <KeyBenefitCard icon={<Camera />} title="Memory Maker" description="Beautifully organized photo albums to capture your first trip as a married couple." delay={0.3} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HoneymoonLanding;
