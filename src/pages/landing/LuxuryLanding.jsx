
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Sparkles, Star, Wine } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KeyBenefitCard, MiniCTA } from '@/components/landing/SharedUI';

const LuxuryLanding = () => {
  const { trackConversion } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Luxury Travel Concierge | VaykAIo</title>
        <meta name="description" content="Curated luxury experiences, 5-star dining, and exclusive access powered by AI." />
      </Helmet>

      <section className="relative min-h-[90dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1683719228269-7398188955af?auto=format&fit=crop&w=2400&q=80" alt="Luxury resort" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-white mt-6 mb-6 font-display">
              Uncompromising luxury. <br/>
              <span className="text-accent">Curated instantly.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Your AI concierge for 5-star hotels, Michelin-starred dining, and exclusive private tours. Experience the extraordinary.
            </p>
            <MiniCTA text="Curate My Experience" onClick={() => trackConversion('hero_cta_click')} />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyBenefitCard icon={<Star />} title="5-Star Only" description="Strict filtering ensures only the highest-rated luxury accommodations and services." delay={0.1} />
            <KeyBenefitCard icon={<Wine />} title="Fine Dining" description="Auto-scans for Michelin stars and exclusive culinary experiences." delay={0.2} />
            <KeyBenefitCard icon={<Sparkles />} title="Private Access" description="Discover private yacht charters, exclusive museum tours, and VIP access." delay={0.3} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuxuryLanding;
