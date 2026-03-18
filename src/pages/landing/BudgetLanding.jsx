
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, Tag, PieChart } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KeyBenefitCard, TestimonialCard, MiniCTA, TrustBadge } from '@/components/landing/SharedUI';
import { SavingsBreakdownChart, PersonaFAQAccordion } from '@/components/landing/FeatureSections';

const BudgetLanding = () => {
  const { trackConversion } = useAnalytics();

  const chartData = [
    { name: 'Flights', traditional: 800, ai: 550 },
    { name: 'Hotels', traditional: 1200, ai: 850 },
    { name: 'Activities', traditional: 400, ai: 320 },
  ];

  const faqs = [
    { q: "How does the AI find cheaper flights?", a: "Our engine continuously scans historical pricing data and alternative routing options that standard search engines miss." },
    { q: "Is the budget tracker free?", a: "Yes! Basic expense tracking is included in our free tier. Group splitting requires a premium plan." },
    { q: "Can I set a strict daily limit?", a: "Absolutely. Tell the AI your daily budget, and it will only suggest restaurants and activities that fit within it." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Budget Travel Planner | VaykAIo</title>
        <meta name="description" content="Travel further for less. Our AI finds hidden deals and optimizes your itinerary to maximize your budget." />
      </Helmet>

      <section className="relative min-h-[90dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1686079548871-dcdbac163644?auto=format&fit=crop&w=2400&q=80" alt="Budget travel" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <TrustBadge text="Save an average of 30% per trip" icon={<TrendingDown className="w-4 h-4 text-green-400" />} />
            <h1 className="text-white mt-6 mb-6 font-display">
              Travel further. <br/>
              <span className="text-green-400">Spend less.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Tell our AI your exact budget. We'll build a complete itinerary, find hidden flight deals, and track every penny while you travel.
            </p>
            <MiniCTA text="Build My Budget Trip" onClick={() => trackConversion('hero_cta_click')} />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-6">How we stretch your dollar</h2>
              <p className="text-lg text-muted-foreground mb-8">Our AI doesn't just find cheap flights; it optimizes your entire route to minimize transit costs and suggests free local activities.</p>
              <div className="space-y-6">
                <KeyBenefitCard icon={<Tag />} title="Hidden Deal Discovery" description="We scan alternative airports and hidden city-pair fares automatically." />
                <KeyBenefitCard icon={<Wallet />} title="Real-time Expense Tracking" description="Log expenses on the go. Get alerts before you overspend your daily limit." />
              </div>
            </div>
            <div className="bg-muted/30 p-8 rounded-3xl border">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><PieChart className="text-primary"/> Average Savings (7-Day Trip)</h3>
              <SavingsBreakdownChart data={chartData} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-16 text-white">Real travelers, real savings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <TestimonialCard 
              quote="I told the AI I had $1500 for a week in Japan. It found a routing I never would have thought of and suggested amazing cheap eats."
              author="David R." role="Backpacker" image="https://i.pravatar.cc/150?img=33"
            />
            <TestimonialCard 
              quote="The expense splitting feature is a lifesaver for group trips. No more awkward math at the end of the vacation."
              author="Elena M." role="Student" image="https://i.pravatar.cc/150?img=45" delay={0.2}
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12">Budget FAQ</h2>
          <PersonaFAQAccordion faqs={faqs} />
        </div>
      </section>
    </div>
  );
};

export default BudgetLanding;
