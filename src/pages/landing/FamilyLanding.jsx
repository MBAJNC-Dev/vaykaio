
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Heart, Camera, ShieldCheck } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KeyBenefitCard, TestimonialCard, MiniCTA, CategoryCard } from '@/components/landing/SharedUI';
import { PersonaFAQAccordion } from '@/components/landing/FeatureSections';

const FamilyLanding = () => {
  const { trackConversion } = useAnalytics();

  const faqs = [
    { q: "Can the AI plan for toddlers and teenagers?", a: "Yes! Input the ages of your children, and the AI will balance nap times, kid-friendly museums, and activities older kids will actually enjoy." },
    { q: "How does family photo sharing work?", a: "Create a private trip group. Everyone uploads their photos, and our AI automatically organizes them by day and location." },
    { q: "Can we share the itinerary with grandparents?", a: "Easily. Generate a read-only web link or PDF to share your exact schedule with family back home." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Family Vacation Planner | VaykAIo</title>
        <meta name="description" content="Plan the perfect family vacation. Kid-friendly itineraries, shared photo albums, and stress-free logistics." />
      </Helmet>

      <section className="relative min-h-[90dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1676663401298-bc1e1209026b?auto=format&fit=crop&w=2400&q=80" alt="Happy family on vacation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-white mt-6 mb-6 font-display">
              Memories made easy. <br/>
              <span className="text-accent">Tantrums avoided.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              The only AI planner that understands nap times, stroller accessibility, and finding restaurants where kids actually eat.
            </p>
            <MiniCTA text="Plan Our Family Trip" onClick={() => trackConversion('hero_cta_click')} />
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2>Built for modern families</h2>
            <p className="text-muted-foreground mt-4 text-lg">Keep everyone happy, from toddlers to grandparents.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <KeyBenefitCard icon={<Heart className="text-red-500"/>} title="Age-Appropriate Plans" description="AI suggests activities tailored to your kids' exact ages and interests." delay={0.1} />
            <KeyBenefitCard icon={<ShieldCheck className="text-blue-500"/>} title="Paced for Sanity" description="Built-in downtime, realistic transit estimates, and nearby restroom alerts." delay={0.2} />
            <KeyBenefitCard icon={<Camera className="text-purple-500"/>} title="Smart Photo Albums" description="Everyone uploads to one place. AI auto-tags faces and creates a highlight reel." delay={0.3} />
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center">Discover Family Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard title="Theme Parks" image="https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=600&q=80" />
            <CategoryCard title="Beach Resorts" image="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80" delay={0.1} />
            <CategoryCard title="Nature Trails" image="https://images.unsplash.com/photo-1445307806294-bff7f67ff225?auto=format&fit=crop&w=600&q=80" delay={0.2} />
            <CategoryCard title="Interactive Museums" image="https://images.unsplash.com/photo-1518998053401-a4149019b802?auto=format&fit=crop&w=600&q=80" delay={0.3} />
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12">Family Travel FAQ</h2>
          <PersonaFAQAccordion faqs={faqs} />
        </div>
      </section>
    </div>
  );
};

export default FamilyLanding;
