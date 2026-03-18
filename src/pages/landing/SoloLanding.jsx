
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Users, MapPin } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KeyBenefitCard, MiniCTA, TrustBadge } from '@/components/landing/SharedUI';

const SoloLanding = () => {
  const { trackConversion } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Solo Travel Planner | VaykAIo</title>
        <meta name="description" content="Safe, social, and perfectly paced itineraries for the solo traveler." />
      </Helmet>

      <section className="relative min-h-[90dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1600788817779-7bf42582f351?auto=format&fit=crop&w=2400&q=80" alt="Solo traveler" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <TrustBadge text="Safety-First Routing" icon={<Shield className="w-4 h-4 text-blue-400" />} />
            <h1 className="text-white mt-6 mb-6 font-display">
              Travel solo. <br/>
              <span className="text-accent">Never alone.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Curate the perfect solo journey. Find safe neighborhoods, social hostels, and activities where you can meet fellow travelers.
            </p>
            <MiniCTA text="Start Solo Journey" onClick={() => trackConversion('hero_cta_click')} />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyBenefitCard icon={<Shield />} title="Safety First" description="AI prioritizes highly-rated, well-lit areas and safe transit options for solo travelers." delay={0.1} />
            <KeyBenefitCard icon={<Users />} title="Social Spots" description="Looking to mingle? Get recommendations for social cafes, group tours, and events." delay={0.2} />
            <KeyBenefitCard icon={<MapPin />} title="Share Location" description="Easily share your live itinerary and location updates with family back home." delay={0.3} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SoloLanding;
