
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Briefcase, Wifi, Clock } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KeyBenefitCard, MiniCTA } from '@/components/landing/SharedUI';

const BusinessLanding = () => {
  const { trackConversion } = useAnalytics();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Corporate Travel Planner | VaykAIo</title>
        <meta name="description" content="Optimize business trips with AI. Fast routing, reliable Wi-Fi spots, and easy expense reporting." />
      </Helmet>

      <section className="relative min-h-[90dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1695185577162-312236628a90?auto=format&fit=crop&w=2400&q=80" alt="Business travel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-white mt-6 mb-6 font-display">
              Business travel, <br/>
              <span className="text-accent">streamlined.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Maximize productivity. Our AI finds hotels near your meetings, tracks expenses automatically, and ensures reliable connectivity.
            </p>
            <MiniCTA text="Optimize My Trip" onClick={() => trackConversion('hero_cta_click')} />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyBenefitCard icon={<Briefcase />} title="Meeting Proximity" description="Input your meeting addresses; AI books hotels within a 10-minute radius." delay={0.1} />
            <KeyBenefitCard icon={<Wifi />} title="Connectivity Guaranteed" description="Filters for accommodations and cafes with verified high-speed internet." delay={0.2} />
            <KeyBenefitCard icon={<Clock />} title="Bleisure Ready" description="Have a free afternoon? AI instantly fills it with top local sights." delay={0.3} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessLanding;
